import React from 'react';
import classnames from 'classnames';
import SimpleTooltip from './simple-tooltip';
import { connect } from 'react-redux';
import {
    isArticleFavourite,
    Creators as FavouriteCreators
} from '../ducks/favourites';


const LikeButton = ({ isFavourite, likeDislikeArticle, iconBaseClassName, hideKeyHint, wrapperClassName, btnBaseClassName }) => {
    const isLiked = isFavourite;
    const likeIcon = isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up';
    return (
        <SimpleTooltip wrapperClassName={classnames(wrapperClassName || 'float-right')} content={(isLiked ? 'Remove from favourites' : 'Add to favourites') + (!hideKeyHint ? ' [L]' : '')}>
            <button type="button" className={classnames('btn btn-transparent like-quote', btnBaseClassName || 'btn-lg')}
                aria-label="Like/Unlike" data-toggle="tooltip"
                data-placement="top"
                onClick={likeDislikeArticle}>
                <i className={classnames(iconBaseClassName || 'fa-2x', likeIcon)}></i>
            </button>
        </SimpleTooltip>
    );
};

const mapStateToProps = (state, props) => ({
    isFavourite: isArticleFavourite(state, props.article),
});

const mapDispatchToProps = (dispatch, props) => ({
    likeDislikeArticle: () => dispatch(FavouriteCreators.likeDislikeArticle(props.article))
});


export default connect(mapStateToProps, mapDispatchToProps)(LikeButton);