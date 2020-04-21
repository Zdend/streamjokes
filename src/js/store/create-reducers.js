import { combineReducers } from 'redux';
import LayoutReducer from '../ducks/layout';
import SlideshowReducer from '../ducks/slideshow';
import ArticlesReducer from '../ducks/articles';
import FavouriteReducer from '../ducks/favourites';
import HistoryReducer from '../ducks/history';
import { routerReducer } from 'react-router-redux';

export default () => combineReducers({
    layout: LayoutReducer,
    slideshow: SlideshowReducer,
    articleContainer: ArticlesReducer,
    favouriteContainer: FavouriteReducer,
    historyContainer: HistoryReducer,
    router: routerReducer
});
