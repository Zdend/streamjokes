import { createActions } from 'reduxsauce';
import { createSelector } from 'reselect';

/* ========= Types + Actions ========= */
export const { Types, Creators } = createActions(
    {
        toggleSidebar: ['isOpen']
    },
    {
        prefix: 'layout/'
    }
);

export const initialState = {
    sidebarOpen: false
};

/* ========= Reducers ========= */
const layout = (state = initialState, action) => {
    switch (action.type) {
        case Types.TOGGLE_SIDEBAR:
            return { ...state, sidebarOpen: typeof action.isOpen === 'boolean' ? action.isOpen : !state.sidebarOpen };
        default:
            return state;
    }
};

export default layout;

export const getLayout = state => state.layout;
export const getSidebarOpen = createSelector(getLayout, layout => layout.sidebarOpen);
