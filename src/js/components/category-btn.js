import React from 'react';
import { connect } from 'react-redux';
import { getCategorisedArticles, getArticlesLoading } from '../ducks/articles';
import { getFavourites } from '../ducks/favourites';
import { Creators } from '../ducks/slideshow';
import classnames from 'classnames';
import { isFavouriteCategory } from '../utils/category';
import Spinner from './spinner';

const CategoryBtnInner = ({ category, isSelected, toggleCategory, count, isLoading }) => {
    const countText = count > 0 ? ` (${count})` : '';
    return (
        <button type="button" 
            className={classnames('btn btn-default mr-2 mt-2 cat-btn flex-fill', { active: isSelected })} 
            onClick={toggleCategory(category, isSelected)}
            >
            {category} 
            <span>{
                isLoading 
                ? <Spinner className="ml-2" /> 
                : countText}
            </span>
        </button>
    );
};

const mapDispatchToProps = dispatch => ({
    toggleCategory: (category, isCurrentlySelected) => () => {
        if (isCurrentlySelected) {
            dispatch(Creators.deselectCategory(category));
        } else {
            dispatch(Creators.selectCategory(category));
        }
    },
});
const mapStateToProps = (state, ownerProps) => {
    const categorisedArticles = getCategorisedArticles(state);
    const favouriteArticles = getFavourites(state);
    const isFavourite = isFavouriteCategory(ownerProps.category);
    const currentCategory = (isFavourite ? favouriteArticles : categorisedArticles[ownerProps.category]) || [];
    const count = currentCategory.length;
    const isArticlesLoading = getArticlesLoading(state);
    const isLoading = isArticlesLoading && count === 0 && ownerProps.isSelected && !isFavourite;
    return {
        count,
        isLoading
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryBtnInner);
