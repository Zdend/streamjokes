import React from 'react';
import { connect } from 'react-redux';
import {
    getCurrentArticle,
    getCurrentColor,
    isForwardDirection,
    getBeginTransition,
    Creators
} from '../ducks/slideshow';
import { getArticlesBySelectedCategories } from '../ducks/articles';
import classnames from 'classnames';
import { getIconByCategory } from '../utils/category';
import { dashify } from '../utils/functions';
import LikeButton from './like-button';
import { Link } from 'react-router-dom';

const requestArticleIfNone = (props) => {
    const { article, nextArticle, allArticles } = props;
    if (!article && allArticles.length) {
        nextArticle();
    }
};

class Slideshow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entering: true,
            animationActive: false,
            previousArticle: null
        };
        this.timeouts = [];
    }

    addTimeout = (cb, sleep) => {
        const timeout = setTimeout(cb, sleep);
        this.timeouts.push(timeout);
    };

    handleTransition = () => {
        const { color, beginTransition, completeTransition, article, changeTheme } = this.props;
        if (beginTransition && this.state.entering) {
            this.setState({ entering: false, animationActive: true });
            completeTransition();
            changeTheme(color);
            this.timeouts.forEach(clearTimeout);
            this.timeouts = [];
        } else if (!this.state.entering) {
            this.addTimeout(() => {
                this.setState({ entering: true });
                this.addTimeout(() => {
                    this.setState({ animationActive: false });
                }, 700);
                this.addTimeout(() => {
                    this.setState({ previousArticle: article });
                }, 500);
            }, 300);
        }
    };

    componentDidMount() {
        this.props.resetNextRotation();
        requestArticleIfNone(this.props);
        this.handleTransition();
    }

    componentDidUpdate() {
        requestArticleIfNone(this.props);
        this.handleTransition();
    }

    render() {
        const { article, isForwardDirection, allArticles } = this.props;
        const { entering, animationActive, previousArticle } = this.state;

        const transitionClasses = {
            fadeOutLeft: animationActive && !entering && isForwardDirection,
            fadeInRight: animationActive && entering && isForwardDirection,
            fadeInLeft: animationActive && entering && !isForwardDirection,
            fadeOutRight: animationActive && !entering && !isForwardDirection
        };

        const currentArticle = !entering ? previousArticle : article;

        if (!currentArticle) {
            return (
                <div className={classnames('article-page animated fast', transitionClasses)}>
                    <div className="article">
                    {!allArticles.length ? 'There is nothing matching your selection.' : 'Loading...'}
                    </div>
                </div>
            );
        }
        const { text, author, cat } = currentArticle;

        const icon = getIconByCategory(cat);

        return (
            <div className={classnames('article-page animated fast', transitionClasses)}>
                <h1 className="article fb-quotable">
                    <i className={classnames(icon, 'mr-4 article-icon')} aria-hidden="true"></i>{text}
                </h1>
                <LikeButton article={article} />
                <div className="author">{author}
                    <Link to={`/categories/${dashify(cat)}/0/`}><span> ({cat})</span></Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    article: getCurrentArticle(state),
    color: getCurrentColor(state),
    allArticles: getArticlesBySelectedCategories(state),
    isForwardDirection: isForwardDirection(state),
    beginTransition: getBeginTransition(state)
});

const mapDispatchToProps = (dispatch) => ({
    nextArticle: () => dispatch(Creators.requestNextArticle()),
    completeTransition: () => dispatch(Creators.completeTransition()),
    changeTheme: (color) => dispatch(Creators.changeTheme(color)),
    resetNextRotation: (color) => dispatch(Creators.resetNextRotation(color)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Slideshow);