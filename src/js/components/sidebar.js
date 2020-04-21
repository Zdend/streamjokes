import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getFavourites } from '../ducks/favourites';
import { Creators, getChangeSearchExpression, getSearchResults, getSearching } from '../ducks/slideshow';
import { getHistory } from '../ducks/history';
import classnames from 'classnames';
import { getIconByCategory } from '../utils/category';
import SimpleTooltip from './simple-tooltip';
import Spinner from './spinner';


const renderFavouriteLink = (favourite, changeArticle, toggleSidebar, historyIndex) => {
    const { article, color } = favourite;
    const fullText = article.text || '';
    const category = article.cat || '';
    const excerpt = fullText.substring(0, 25);
    const catExcerpt = category.substring(0, 25);
    const icon = getIconByCategory(category);
    return (
        <li key={`${article.id || fullText}-${historyIndex ?? ''}`}>
            <SimpleTooltip content={fullText} boundariesElement="window" delay={500} placement="right" wrapperClassName="d-block">
                <div
                    className="favourite-quote-link"
                    aria-label={fullText}
                    onClick={() => {
                        changeArticle(article, color, historyIndex);
                        if (window.outerWidth < 800) {
                            toggleSidebar(false);
                        }
                    }}
                >
                    <div className="favourite-quote-link__title">
                        <i className={classnames(icon, 'mr-2')}></i>{excerpt}..
                    </div>
                    <div className="favourite-quote-link__cat">{catExcerpt}</div>
                </div>
            </SimpleTooltip>
        </li>
    );
};

const SidebarAccordion = ({ title, isOpen, toggle, children }) => {
    return (
        <>
            <button type="button" className="sidebar-brand" onClick={() => toggle(!isOpen)}>
                <i className={classnames('fas fa-caret-right mr-1 basic-transition', { 'fa-rotate-90': isOpen })} /> {title}
            </button>
            {isOpen && <ul className="sidebar-nav">
                {children}
            </ul>}
        </>
    );
};

const Sidebar = ({ favourites, history, changeArticle, searchExpression, changeSearchExpression,
    isSearchingArticle, searchArticle, searchResults, toggleSidebar }) => {
    const [ isHistoryVisible, setHistoryVisible ] = useState(false);
    const [ isFavouritesVisible, setFavouritesVisible ] = useState(true);
    const [ isSearchVisible, setSearchVisible ] = useState(searchExpression);
    
    return (
        <div id="sidebar-wrapper">
            <div className="search-input__wrapper">
                <button type="button" className="btn btn-transparent search-input__icon"
                    aria-label="Search by text or author across selected categories"
                    onClick={searchArticle}
                    disabled={isSearchingArticle}
                >
                    {isSearchingArticle
                        ? <Spinner />
                        : <i className="fa fa-search"
                            data-toggle="tooltip"
                            data-placement="right"
                            data-boundary="window"
                            data-delay="500"
                            title="Search by text or author across selected categories"
                        ></i>
                    }
                </button>
                <input type="text"
                    className="search-input"
                    placeholder="Type in text or author"
                    aria-label="Search quotes and jokes"
                    value={searchExpression}
                    onChange={changeSearchExpression}
                />
            </div>
            <SidebarAccordion title="SEARCH" isOpen={isSearchVisible || !!searchExpression} toggle={(val) => {
                    if (searchExpression) {
                        changeSearchExpression({ target: { value: '' } });
                    } else {
                        setSearchVisible(val);
                    }
                }}>
                {!!searchResults.length && searchResults.map(i => renderFavouriteLink(i, changeArticle, toggleSidebar))}
                {!searchResults.length && <div className="p-3">No results</div>}
            </SidebarAccordion>
            <SidebarAccordion title="HISTORY" isOpen={isHistoryVisible} toggle={setHistoryVisible}>
                {history.map((i, index) => renderFavouriteLink(i, changeArticle, toggleSidebar, index))}
            </SidebarAccordion>
            <SidebarAccordion title="FAVOURITES" isOpen={isFavouritesVisible} toggle={setFavouritesVisible}>
                {favourites.map(i => renderFavouriteLink(i, changeArticle, toggleSidebar))}
            </SidebarAccordion>

        </div>
    );
};

const mapStateToProps = state => ({
    favourites: getFavourites(state),
    history: getHistory(state),
    searchExpression: getChangeSearchExpression(state),
    isSearchingArticle: getSearching(state),
    searchResults: getSearchResults(state)
});

const mapDispatchToProps = dispatch => ({
    changeArticle: (article, color, index) => dispatch(Creators.changeArticle(article, color, index)),
    changeSearchExpression: (e) => dispatch(Creators.changeSearchExpression(e.target.value)),
    searchArticle: () => dispatch(Creators.searchRequest())
});


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);