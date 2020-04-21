import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    Creators,
    isLoadingArticle
} from '../ducks/slideshow';
import {
    Creators as FavouriteCreators
} from '../ducks/favourites';

const handleKeyEvent = ({ likeDislikeArticle, nextArticle, readArticle, playPause, 
    previousArticle, toggleFocusMode, isLoadingArticle, searchArticle }) => (e) => {
    const code = e.keyCode || e.which;
    const inSearch = e.target && e.target.classList.contains('search-input');
    const onReadBtn = e.target && e.target.classList.contains('action-buttons__read-btn');
    const exceptions = [13];
    if (e.target instanceof HTMLInputElement && !exceptions.includes(code)) {
        return;
    }
    
    if (code == 37 && !isLoadingArticle) { // left
        previousArticle();
    } else if (code == 39 && !isLoadingArticle) { // right
        nextArticle();
    } else if (code == 13 && !onReadBtn) { // enter
        if (inSearch && !isLoadingArticle) {
            searchArticle();
        } else {
            readArticle();
        }
    } else if (code == 32) { // space
        playPause();
    } else if (code == 76) { // L
        likeDislikeArticle();
    } else if (code == 70) { // F
        toggleFocusMode();
    }
};

function suppressDefaultSpace(e) {
    if (e.keyCode == 32 && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
    }
}

const SlideshowKeys = (props) => {
    useEffect(() => {
        const handler = handleKeyEvent(props);
        document.addEventListener('keyup', handler, false);
        window.addEventListener('keydown', suppressDefaultSpace);

        return () => {
            document.removeEventListener('keyup', handler, false);
            window.removeEventListener('keydown', suppressDefaultSpace);
        };
    }, [ props.isLoadingArticle ]);
    return null;
};

const mapStateToProps = state => ({
    isLoadingArticle: isLoadingArticle(state)    
});


const mapDispatchToProps = dispatch => ({
    likeDislikeArticle: () => dispatch(FavouriteCreators.likeDislikeArticle()),
    nextArticle: () => dispatch(Creators.requestNextArticle()),
    previousArticle: () => dispatch(Creators.requestPreviousArticle()),
    readArticle: () => dispatch(Creators.readArticle()),
    playPause: () => dispatch(Creators.playPause()),
    toggleFocusMode: () => dispatch(Creators.toggleFocusMode()),
    searchArticle: () => dispatch(Creators.searchRequest()),
});


export default connect(mapStateToProps, mapDispatchToProps)(SlideshowKeys);