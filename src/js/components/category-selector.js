import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { Creators, getSelectedCategories, getFocusModeActive } from '../ducks/slideshow';
import { ALL_CATEGORIES, POPULAR_CATEGORIES, FAVOURITE_CATEGORY } from '../constants/global';
import CategoryBtn from './category-btn';
import { mapIndexToCategory } from '../utils/category';
import { unique } from '../utils/functions';
import qs from 'qs';

const variousCategories = ALL_CATEGORIES.filter(cat => !POPULAR_CATEGORIES.includes(cat));

const CategorySegment = ({ categories, selectedCategories, toggleCategory }) => (
    categories.map(cat => <CategoryBtn key={cat} 
        category={cat} 
        toggleCategory={toggleCategory}
        isSelected={selectedCategories.includes(cat)} />)
);

class CategorySelector extends React.Component {
    componentDidMount() {
        const { selectedCategories, deselectCategory, selectCategory, loadArticleById, changeRate, location: { search } = {} } = this.props;
        const { id, categories, rate } = qs.parse(search, { ignoreQueryPrefix: true });
        
        const queryCategories = mapIndexToCategory(categories?.split(','));
        if (queryCategories) {
            selectedCategories.forEach(deselectCategory);
            unique([...queryCategories, FAVOURITE_CATEGORY]).forEach(selectCategory);
            loadArticleById(id);
            changeRate(rate);
        } else {
            POPULAR_CATEGORIES.forEach(selectCategory);
        }
    }

    render () {
        const { selectedCategories, toggleCategory, toggleAllCategories, isFocusModeActive } = this.props;
    
        if (isFocusModeActive) {
            return null;
        }

        return (
            <>
                <div className="mt-4">
                    <button type="button" 
                        className="btn btn-default" 
                        id="toggleAll" 
                        data-toggle="tooltip" 
                        data-placement="top" 
                        title="Select/Deselect all categories"
                        onClick={toggleAllCategories}>
                        Toggle All
                    </button>
                    <div className="text-nowrap ml-sm-4 mt-3 text-uppercase d-sm-inline-block">Selected categories: {selectedCategories.length}</div>
                </div>

                <h3 className="category-title mt-4">Popular</h3>
                <div id="popular-categories" className="d-flex flex-wrap align-content-start">
                    <CategorySegment categories={POPULAR_CATEGORIES} 
                        selectedCategories={selectedCategories} 
                        toggleCategory={toggleCategory} />
                </div>
                <h3 className="category-title mt-4">Various</h3>
                <div id="categories" className="d-flex flex-wrap align-content-start">
                    <CategorySegment categories={variousCategories} 
                        selectedCategories={selectedCategories} 
                        toggleCategory={toggleCategory} />
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    selectedCategories: getSelectedCategories(state),
    isFocusModeActive: getFocusModeActive(state)
});

const mapDispatchToProps = (dispatch) => ({
    toggleAllCategories: () => dispatch(Creators.toggleAllCategories()),
    deselectCategory: (cat) => dispatch(Creators.deselectCategory(cat)),
    selectCategory: (cat) => dispatch(Creators.selectCategory(cat)),
    loadArticleById: (id) => dispatch(Creators.loadArticleById(id)),
    changeRate: (value) => dispatch(Creators.changeRate(value))
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(CategorySelector);

