import { createActions } from 'reduxsauce';
import { ALL_CATEGORIES, DEFAULT_CHANGE_RATE, EXPLICIT } from '../constants/global';
import { createSelector } from 'reselect';
import { unique } from '../utils/functions';

/* ========= Types + Actions ========= */
export const { Types, Creators } = createActions(
    {
        selectCategory: ['category'],
        deselectCategory: ['category'],
        toggleAllCategories: null,
        changeRate: ['rate'],
        requestNextArticle: null,
        requestPreviousArticle: null,
        changeArticle: ['article', 'color', 'historyIndex'],
        previousArticle: null,
        playPause: null,
        completeTransition: null,
        changeTheme: ['color'],
        changeSearchExpression: ['searchExpression'],
        toggleFocusMode: null,
        readArticle: ['article'],
        completeReading: null,
        stopLoadingArticle: null,
        toggleAutoRead: null,
        toggleAllowExplicit: null,
        resetNextRotation: null,
        searchRequest: null,
        searchComplete: ['searchResults'],
        loadArticleById: ['id']
    },
    {
        prefix: 'slideshow/'
    }
);

const calcNextRotation = rate => new Date().getTime() + (rate * 1000);
const allowedRate = rate => {
    const parsedRate = parseInt(rate, 10);
    if (parsedRate >= 5 && parsedRate <= 180) {
        return parsedRate;
    } else {
        return DEFAULT_CHANGE_RATE;
    }
};

export const initialState = {
    selectedCategories: [],
    rate: DEFAULT_CHANGE_RATE,
    autoRotate: true,
    nextRotationTime: calcNextRotation(DEFAULT_CHANGE_RATE),
    currentArticle: null,
    currentColor: null,
    loadingArticle: true,
    forwardDirection: true,
    beginTransition: false,
    explicitRule: EXPLICIT.OFF,
    searchExpression: '',
    focusModeActive: false,
    reading: false,
    autoRead: false,
    searchResults: [],
    searching: false
};

/* ========= Reducers ========= */
const slideshow = (state = initialState, action) => {
    switch (action.type) {
        case Types.SELECT_CATEGORY:
            return { ...state, selectedCategories: unique([ ...state.selectedCategories, action.category ]) };
        case Types.DESELECT_CATEGORY:
            return { ...state, selectedCategories: state.selectedCategories.filter(cat => cat !== action.category) };
        case Types.TOGGLE_ALL_CATEGORIES: {
            const isAllSelected = state.selectedCategories.length === ALL_CATEGORIES.length;
            return { ...state, selectedCategories: isAllSelected ? [] : [...ALL_CATEGORIES] };
        }
        case Types.CHANGE_RATE: {
            const rate = allowedRate(action.rate);
            return { ...state, rate, nextRotationTime: calcNextRotation(rate) };
        }
        case Types.RESET_NEXT_ROTATION:
            return { ...state, nextRotationTime: calcNextRotation(state.rate) };
        case Types.REQUEST_NEXT_ARTICLE:
            return { ...state, loadingArticle: true, forwardDirection: true };
        case Types.REQUEST_PREVIOUS_ARTICLE:
            return { ...state, loadingArticle: true, forwardDirection: false };
        case Types.STOP_LOADING_ARTICLE:
            return { ...state, loadingArticle: false, nextRotationTime: calcNextRotation(state.rate) };
        case Types.CHANGE_ARTICLE: {
            const { article, color } = action;
            return { ...state, 
                currentArticle: article, 
                currentColor: color, 
                loadingArticle: false,
                nextRotationTime: calcNextRotation(state.rate),
                beginTransition: true
            };
        }
        case Types.PLAY_PAUSE:
            return { ...state, 
                autoRotate: !state.autoRotate, 
                nextRotationTime: !state.autoRotate ? calcNextRotation(state.rate) : state.nextRotationTime
            };
        case Types.COMPLETE_TRANSITION:
            return { ...state, beginTransition: false };
        case Types.CHANGE_SEARCH_EXPRESSION:
            return { ...state, searchExpression: action.searchExpression, searching: !!action.searchExpression };
        case Types.SEARCH_REQUEST:
            return { ...state, searching: true };
        case Types.SEARCH_COMPLETE:
            return { ...state, searching: false, searchResults: action.searchResults };
        case Types.TOGGLE_FOCUS_MODE:
            return { ...state, focusModeActive: !state.focusModeActive };
        case Types.READ_ARTICLE:
            return { ...state, reading: true };
        case Types.COMPLETE_READING:
            return { ...state, reading: false };
        case Types.TOGGLE_AUTO_READ:
            return { ...state, autoRead: !state.autoRead };
        case Types.TOGGLE_ALLOW_EXPLICIT: {
            const values = Object.values(EXPLICIT);
            const index = values.findIndex(el => el === state.explicitRule);
            const nextIndex = index < 2 ? index + 1 : 0;
            return { ...state, explicitRule: values[nextIndex]};
        }
        default:
            return state;
    }
};

export default slideshow;

export const getSlideshow = state => state.slideshow;
export const getSelectedCategories = createSelector(getSlideshow, slideshow => slideshow.selectedCategories);
export const isAllSelected = createSelector(getSelectedCategories, selectedCategories => selectedCategories.length === ALL_CATEGORIES.length);
export const getRate = createSelector(getSlideshow, slideshow => slideshow.rate);
export const getNextRotationTime = createSelector(getSlideshow, slideshow => slideshow.nextRotationTime);
export const getAutoRotate = createSelector(getSlideshow, slideshow => slideshow.autoRotate);
export const isLoadingArticle = createSelector(getSlideshow, slideshow => slideshow.loadingArticle);
export const getCurrentArticle = createSelector(getSlideshow, slideshow => slideshow.currentArticle);
export const getCurrentColor = createSelector(getSlideshow, slideshow => slideshow.currentColor);
export const isForwardDirection = createSelector(getSlideshow, slideshow => slideshow.forwardDirection);
export const getBeginTransition = createSelector(getSlideshow, slideshow => slideshow.beginTransition);
export const getFocusModeActive = createSelector(getSlideshow, slideshow => slideshow.focusModeActive);
export const getReading = createSelector(getSlideshow, slideshow => slideshow.reading);
export const getChangeSearchExpression = createSelector(getSlideshow, slideshow => slideshow.searchExpression);
export const getExplicitRule = createSelector(getSlideshow, slideshow => slideshow.explicitRule);
export const getAutoRead = createSelector(getSlideshow, slideshow => slideshow.autoRead);
export const getSearchResults = createSelector(getSlideshow, slideshow => slideshow.searchResults);
export const getSearching = createSelector(getSlideshow, slideshow => slideshow.searching);
