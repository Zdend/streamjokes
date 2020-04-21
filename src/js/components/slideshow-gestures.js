import React from 'react';
import { connect } from 'react-redux';
import { Creators, getCurrentArticle } from '../ducks/slideshow';
import { Creators as LayoutCreators, getSidebarOpen } from '../ducks/layout';

class SlideshowGestures extends React.Component {
	handleArticleSwipeLeft = () => {
		this.props.nextArticle();
	};
	
	handleArticleSwipeRight = () => {
		this.props.previousArticle();
	};

	handleSidebarSwipeLeft = () => {
		this.props.toggleSidebar(false);
	};

	registerListeners = () => {
		if ((!this.props.sidebarOpen || window.outerWidth > 800) && this.articlePageHammer) {
			this.articlePageHammer.on('swipeleft', this.handleArticleSwipeLeft);
			this.articlePageHammer.on('swiperight', this.handleArticleSwipeRight);
		} 
		if (this.sidebarHammer && window.outerWidth < 800) {
			this.sidebarHammer.on('swipeleft', this.handleSidebarSwipeLeft);
		}
	};

	unregisterListeners = () => {
		if (this.articlePageHammer && this.articlePage) {
			this.articlePageHammer.off('swipeleft', this.handleArticleSwipeLeft);
			this.articlePageHammer.off('swiperight', this.handleArticleSwipeRight);
		}
		if (this.sidebarHammer) {
			this.sidebarHammer.off('swipeleft', this.handleSidebarSwipeLeft);
		}
	};

	updateElements = async () => {
		const HammerModule = await import(/* webpackChunkName: 'hammerjs' */ 'hammerjs');
		const Hammer = HammerModule.default;
		const articlePage = document.querySelector('.article-page');
		const articlePageHammer = articlePage ? Hammer(articlePage) : null;

		const sidebar = document.getElementById('sidebar-wrapper');
		const sidebarHammer = sidebar ? Hammer(sidebar) : null;

		this.articlePageHammer = articlePageHammer;
		this.articlePage = articlePage;
		this.sidebarHammer = sidebarHammer;
		this.sidebar = sidebar;

		return { articlePageHammer, sidebarHammer, articlePage, sidebar };
	};

	async componentDidUpdate() {
		this.unregisterListeners();
		await this.updateElements();
		this.registerListeners();
	}

	async componentWillUnmount() {
		this.unregisterListeners();
	}

	render () {
		return null;
	}
}

const mapStateToProps = state => ({
	article: getCurrentArticle(state),
	sidebarOpen: getSidebarOpen(state)
});

const mapDispatchToProps = dispatch => ({
	nextArticle: () => dispatch(Creators.requestNextArticle()),
	previousArticle: () => dispatch(Creators.requestPreviousArticle()),
	toggleSidebar: (state = false) => dispatch(LayoutCreators.toggleSidebar(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideshowGestures);