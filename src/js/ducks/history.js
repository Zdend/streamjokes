import { createActions } from 'reduxsauce';
import { createSelector } from 'reselect';
import { Types as SlideshowTypes } from './slideshow';
import { MAX_HISTORY } from '../constants/global';

/* ========= Types + Actions ========= */
export const { Types, Creators } = createActions(
    {
        RESET: null
    },
    {
        prefix: 'history/'
    }
);


export const initialState = {
    history: [],
    index: -1
};

const nextIndex = (index, history) => index < history.length - 1 ? index + 1 : history.length - 1;
const previousIndex = (index) => index > 0 ? index - 1 : 0;

/* ========= Reducers ========= */
const historyContainer = (state = initialState, action) => {
    switch (action.type) {
        case SlideshowTypes.CHANGE_ARTICLE: {
            const { article, color, historyIndex } = action;
            if (!Number.isInteger(historyIndex) || historyIndex < 0) {
                const latestHistory = state.history.length >= MAX_HISTORY ? state.history.slice(1, MAX_HISTORY) : state.history;
                return { 
                    ...state, 
                    history: [...latestHistory, { article, color }],
                    index: latestHistory.length
                };
            } else if (historyIndex >= 0) {
                return {
                    ...state,
                    index: historyIndex
                };
            }
            
            return state;
        }
        default:
            return state;
    }
};

export default historyContainer;

export const getHistoryContainer = state => state.historyContainer;
export const getHistory = createSelector(getHistoryContainer, container => container.history);
export const getHistoryIndex = createSelector(getHistoryContainer, container => container.index);
export const getNextInHistory = createSelector(
    getHistoryIndex, 
    getHistory, 
    (index, history) => history[nextIndex(index, history)]
);
export const getPreviousInHistory = createSelector(
    getHistoryIndex, 
    getHistory,
    (index, history) => history[previousIndex(index)]
);
export const getNextIndex = createSelector(
    getHistoryIndex, 
    getHistory, 
    (index, history) => nextIndex(index, history)
);
export const getPreviousIndex = createSelector(
    getHistoryIndex, 
    (index) => previousIndex(index)
);
