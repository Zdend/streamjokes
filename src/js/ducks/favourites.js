import { createActions } from 'reduxsauce';
import { createSelector } from 'reselect';
import { getCurrentArticle } from './slideshow';

/* ========= Types + Actions ========= */
export const { Types, Creators } = createActions(
    {
        likeArticle: ['article', 'color'],
        dislikeArticle: ['article'],
        likeDislikeArticle: ['article']
    },
    {
        prefix: 'favourite/'
    }
);

export const initialState = {
    favourites: [],
    dislikedArticles: []
};

const checkArticleFavourite = (favourites, article) => favourites.some(c => c?.article?.text === article?.text);

/* ========= Reducers ========= */
const favouriteContainer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIKE_ARTICLE:
            return { ...state, 
                favourites: [ ...state.favourites, { article: action.article, color: action.color } ]
            };
        case Types.DISLIKE_ARTICLE: {
            const isLiked = checkArticleFavourite(state.favourites, action.article);
            if (isLiked) {
                return { ...state, 
                    favourites: state.favourites.filter(c => c.article.text !== action.article.text)
                };
            } else {
                return { ...state, 
                    dislikedArticles: [...state.dislikedArticles, action.article ]
                };
            }
        }

        default:
            return state;
    }
};

export default favouriteContainer;



export const getFavouriteContainer = state => state.favouriteContainer;
export const getFavourites = createSelector(getFavouriteContainer, container => container.favourites);
export const getFavouriteArticles = createSelector(getFavourites, favourites => favourites.map(f => f.article));
export const getDislikedArticles = createSelector(getFavouriteContainer, container => container.dislikedArticles);
export const isFavourite = createSelector(
    getFavourites, 
    getCurrentArticle, 
    checkArticleFavourite
);
export const isArticleFavourite = createSelector(
    [getFavourites, (state, article) => article],
    checkArticleFavourite
);