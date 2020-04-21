import { createActions } from 'reduxsauce';
import { createSelector } from 'reselect';
import { getSelectedCategories } from './slideshow';
import { getFavouriteArticles } from './favourites';
import { isFavouriteCategory } from '../utils/category';

/* ========= Types + Actions ========= */
export const { Types, Creators } = createActions(
    {
        loadCategoryRequest: ['category'],
        loadCategorySuccess: ['articles', 'category'],
        loadCategoryFailure: ['error']
    },
    {
        prefix: 'articles/'
    }
);

export const initialState = {
    articles: [],
    categorisedArticles: {},
    totalCounts: {},
    loading: false,
    error: null
};

/* ========= Reducers ========= */
const articleContainer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LOAD_CATEGORY_REQUEST:
            return { ...state, loading: true };
        case Types.LOAD_CATEGORY_SUCCESS:
            return { ...state, 
                loading: false, 
                categorisedArticles: {
                    ...state.categorisedArticles,
                    [action.category]: action.articles
                },
                totalCounts: {
                    ...state.totalCounts,
                    [action.category]: action.articles.length
                }
            };
        case Types.LOAD_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default articleContainer;

export const getArticleContainer = state => state.articleContainer;
export const getCategorisedArticles = createSelector(getArticleContainer, container => container.categorisedArticles);
export const getTotalCounts = createSelector(getArticleContainer, container => container.totalCounts);
export const getArticlesLoading = createSelector(getArticleContainer, container => container.loading);
export const getArticlesBySelectedCategories = createSelector(
    getCategorisedArticles, 
    getSelectedCategories, 
    getFavouriteArticles,
    (categorisedArticles, selectedCategories, favouriteArticles) => {
        return selectedCategories.reduce((result, cat) => {
            const articlesByCategory = (isFavouriteCategory(cat) ? favouriteArticles : categorisedArticles[cat]) || [];
            return result.concat(articlesByCategory);
        }, []);
});

