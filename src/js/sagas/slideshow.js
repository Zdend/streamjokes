import { delay, takeEvery, take, takeLatest, put, call, select, debounce } from 'redux-saga/effects';
import { Types, Creators, getCategorisedArticles, getTotalCounts, getArticlesBySelectedCategories } from '../ducks/articles';
import {
    Types as SlideshowTypes, Creators as SlideshowCreators, getCurrentArticle, getCurrentColor,
    getSlideshow, getAutoRead, getSelectedCategories
} from '../ducks/slideshow';
import { getHistoryIndex, getHistory, getNextInHistory, getNextIndex, getPreviousInHistory, getPreviousIndex } from '../ducks/history';
import { ALL_CATEGORIES, FAVOURITE_CATEGORY, BACKGROUND_COLORS, EXPLICIT } from '../constants/global';
import { randomElement, getContrastYIQ, matchesSearch, playAudio } from '../utils/functions';
import { strigifyCategories, filterNonFavouriteCategories } from '../utils/category';
import { expandArticles } from '../utils/converter';
import { Types as FavouriteTypes, Creators as FavouriteCreators, isArticleFavourite } from '../ducks/favourites';
import { toggleFullScreen } from '../utils/fullscreen';
import { pushData } from '../utils/gtm';
import { push } from 'react-router-redux';
import qs from 'qs';

const getArticlePath = (category) => `/categories/${category}.json`;

function* loadAllCategories() {
    for (const cat of ALL_CATEGORIES) {
        yield put(Creators.loadCategoryRequest(cat));
    }
}

function* loadCategory({ category }) {
    const categorisedArticles = yield select(getCategorisedArticles);
    const totalCounts = yield select(getTotalCounts);
    const articles = categorisedArticles[category] || [];
    const articleTotal = totalCounts[category];
    if ((articles.length >= articleTotal && articleTotal !== 0) || (articles.length && !articleTotal) || category === FAVOURITE_CATEGORY) {
        return;
    }
    let response;
    try {
        response = yield call(fetch, getArticlePath(category));
        if (!response.ok) {
            yield put(
                Creators.loadCategoryFailure(response.error())
            );
        }
        const data = yield call([response, 'json']);
        yield delay(100);
        yield put(Creators.loadCategorySuccess(expandArticles(data), category));
    } catch (e) {
        yield put(Creators.loadCategoryFailure(e));
    }
}

function* moveInHistory() {
    const historyItem = yield select(getNextInHistory);
    const nextIndex = yield select(getNextIndex);
    const currentIndex = yield select(getHistoryIndex);
    const isDifferentIndex = currentIndex !== nextIndex;

    if (isDifferentIndex && historyItem?.article?.text) {
        yield put(SlideshowCreators.changeArticle(historyItem.article, historyItem.color, nextIndex));
    }

    return isDifferentIndex;
}

function* requestNextArticle() {
    yield delay(100);
    const inHistory = yield moveInHistory();
    if (inHistory) {
        return;
    }
    const { explicitRule } = yield select(getSlideshow);
    const selectedArticles = yield select(getArticlesBySelectedCategories);
    const color = randomElement(BACKGROUND_COLORS);

    let counter = 0;
    let article, explicitCriteria, inifiniteLoopProtection;
    
    do {
        explicitCriteria = false;
        inifiniteLoopProtection = false;
        article = randomElement(selectedArticles);

        counter++;

        const articleExists = article && article.text;
        if (articleExists) {
            explicitCriteria = (explicitRule === EXPLICIT.ONLY && !article.exp) || (explicitRule === EXPLICIT.OFF && article.exp);
        }
        inifiniteLoopProtection = counter <= selectedArticles.length;
    } while (inifiniteLoopProtection && explicitCriteria);

    if (!article || !article.text) {
        yield put(SlideshowCreators.stopLoadingArticle());
    } else {
        yield put(SlideshowCreators.changeArticle(article, color));
    }
}

function* searchRequest() {
    const { searchExpression } = yield select(getSlideshow);
    const selectedArticles = yield select(getArticlesBySelectedCategories);
    const history = yield select(getHistory);
    if (!searchExpression) {
        yield put(SlideshowCreators.searchComplete([]));
        return;
    }
    
    const matchingArticles = selectedArticles.filter(article => {
        const isNotInHistory = history.every(historyArticle => historyArticle.text !== article.text);
        const expressionMatches = matchesSearch(article, searchExpression);
        return isNotInHistory && expressionMatches;
    }).map(article => ({ article, color: randomElement(BACKGROUND_COLORS) })).slice(0, 100);

    yield put(SlideshowCreators.searchComplete(matchingArticles));
}

function* requestPreviousArticle() {
    const historyItem = yield select(getPreviousInHistory);
    const previousIndex = yield select(getPreviousIndex);
    const currentIndex = yield select(getHistoryIndex);
    const isDifferentIndex = currentIndex !== previousIndex;
    
    if (isDifferentIndex && historyItem?.article?.text) {
        yield put(SlideshowCreators.changeArticle(historyItem.article, historyItem.color, previousIndex));
    } else {
        yield put(SlideshowCreators.stopLoadingArticle());
    }
}

function* likeDislikeArticle({ article }) {
    let targetArticle = article;
    let targetColor = randomElement(BACKGROUND_COLORS);
    if (!targetArticle) {
        targetArticle = yield select(getCurrentArticle);
        targetColor = yield select(getCurrentColor);
    }
    const isFavouriteArticle = yield select(isArticleFavourite, targetArticle);

    if (isFavouriteArticle) {
        yield put(FavouriteCreators.dislikeArticle(targetArticle));
        playAudio('audio-fail', 0.2);
    } else {
        playAudio('audio-success', 0.2);
        yield put(FavouriteCreators.likeArticle(targetArticle, targetColor));
        pushData({
            event: 'like-article',
            targetArticle
        });
    }
}

function* changeTheme({ color }) {
    const isDark = getContrastYIQ(color) === 'black';
    const body = document.body;
    body.style.backgroundColor = color;
    if (isDark) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }
    document.querySelector('meta[name="theme-color"]').content = color;
    yield;
}

function* toggleFocusMode() {
    yield toggleFullScreen();
}

let speechUtter;
const stopSpeaking = () => {
    speechSynthesis.cancel();
    if (speechUtter) {
        speechUtter.onend = null;
    }
};

function readTextAndAuthor(text, author) {
    return new Promise((resolve) => {
        speechSynthesis.cancel();
        speechUtter = new SpeechSynthesisUtterance(`${text}${author ? ` by ${author}` : ''}`);
        speechSynthesis.speak(speechUtter);
        speechUtter.onend = function() {
            resolve(speechUtter);
        };
    });
}

function* readArticle({ article }) {
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
        return;
    }
    const currentArticle = yield select(getCurrentArticle);
    const { text, author } = (article || currentArticle);
    const speaking = speechSynthesis.speaking;

    if (speaking) {
        stopSpeaking();
        yield put(SlideshowCreators.completeReading());
        return;
    }
    try {
        yield call(readTextAndAuthor, text, author);
    } finally {
        yield put(SlideshowCreators.completeReading());
    }
}

function* dispatchReadArticle() {
    const isAutoReading = yield select(getAutoRead);
    const speaking = speechSynthesis.speaking;

    if (speaking) {
        stopSpeaking();
        yield put(SlideshowCreators.completeReading());
    }

    if (isAutoReading) {
        yield put(SlideshowCreators.readArticle());
    }
}



function* updateQuery() {
    const categories = yield select(getSelectedCategories);
    const categoryValue = strigifyCategories(categories);
    const currentArticle = yield select(getCurrentArticle);
    const queryParams = qs.stringify({ categories: categoryValue, id: currentArticle?.id }, { 
        addQueryPrefix: true, 
        skipNulls: true,
        encode: false
    });

    yield put(push({ search: queryParams }));
}

function* loadArticleById({ id }) {
    const categories = yield select(getSelectedCategories);
    const categorisedArticles = yield select(getCategorisedArticles);
    const unfetchedCategories = categories.filter(c => {
        return !Object.keys(categorisedArticles).includes(c);
    });
    const fetcheableCategories = filterNonFavouriteCategories(unfetchedCategories);

    for (let i = 0; i < fetcheableCategories.length; i++) {
        yield take([Types.LOAD_CATEGORY_SUCCESS, Types.LOAD_CATEGORY_FAILURE]);
    }
    
    const selectedArticles = yield select(getArticlesBySelectedCategories);
    const matchingArticle = selectedArticles.find(a => a.id === id);
    if (matchingArticle?.text) {
        yield put(SlideshowCreators.changeArticle(matchingArticle, randomElement(BACKGROUND_COLORS)));
    }
}

function* slideshowSagas() {
    yield takeEvery(Types.LOAD_CATEGORY_REQUEST, loadCategory);
    yield takeLatest(SlideshowTypes.TOGGLE_ALL_CATEGORIES, loadAllCategories);
    yield takeEvery(SlideshowTypes.SELECT_CATEGORY, loadCategory);
    yield takeEvery(SlideshowTypes.SELECT_CATEGORY, updateQuery);
    yield takeEvery(SlideshowTypes.DESELECT_CATEGORY, updateQuery);
    yield takeEvery(SlideshowTypes.TOGGLE_ALL_CATEGORIES, updateQuery);
    yield takeLatest(SlideshowTypes.REQUEST_NEXT_ARTICLE, requestNextArticle);
    yield takeLatest(SlideshowTypes.REQUEST_PREVIOUS_ARTICLE, requestPreviousArticle);
    yield takeEvery(FavouriteTypes.LIKE_DISLIKE_ARTICLE, likeDislikeArticle);
    yield takeEvery(SlideshowTypes.CHANGE_THEME, changeTheme);
    yield takeEvery(SlideshowTypes.TOGGLE_FOCUS_MODE, toggleFocusMode);
    yield takeEvery(SlideshowTypes.READ_ARTICLE, readArticle);
    yield takeEvery(SlideshowTypes.COMPLETE_TRANSITION, dispatchReadArticle);
    yield takeEvery(SlideshowTypes.SEARCH_REQUEST, searchRequest);
    yield debounce(1000, SlideshowTypes.CHANGE_SEARCH_EXPRESSION, searchRequest);
    yield takeEvery(SlideshowTypes.CHANGE_ARTICLE, updateQuery);
    yield takeLatest(SlideshowTypes.LOAD_ARTICLE_BY_ID, loadArticleById);
}

export default slideshowSagas;