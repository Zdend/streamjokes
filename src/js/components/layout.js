import React from 'react';
import Header from './header';
import Footer from './footer';
import Sidebar from './sidebar';
import { connect } from 'react-redux';
import { Creators, getLayout } from '../ducks/layout';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { PUBLIC_URL } from '../constants/global';

const defaultTitle = 'Stream Jokes and Quotes';
const defaultDescription = 'Stream and rotate famous jokes and quotes. Choose from over 90,000+ quotes from many categories like computers, finance, fun jokes and others.';

const Layout = ({ children, title, headTitle, toggleSidebar, sidebarOpen, description, canonicalPath }) => {
    const targetTitle = headTitle || title || defaultTitle;
    const targetDescription = description || defaultDescription;
    const imageLocation = `${window.location.protocol}//${window.location.hostname}/images/logo-512x512.png`;
    return (
        <div id="wrapper" className={classnames({ toggled: sidebarOpen })}>
            <Helmet title={targetTitle} meta={[
                { name: 'description', content: targetDescription },
                { property: 'og:url', content: window.location.href },
                { property: 'og:type', content: 'website' },
                { property: 'og:title', content: targetTitle },
                { property: 'og:description', content: targetDescription },
                { property: 'og:image', content: imageLocation },
                { property: 'twitter:title', content: targetTitle },
                { property: 'twitter:description', content: targetDescription },
                { property: 'twitter:card', content: 'summary' },
                { property: 'twitter:image', content: imageLocation }
            ]}
            link={[
                canonicalPath && { rel: 'canonical', href: `${PUBLIC_URL}${canonicalPath}` }
            ].filter(Boolean)} />
            <Sidebar toggleSidebar={toggleSidebar} />
            <div id="page-content-wrapper">
                <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
                <div className="container page-content">
                    {title && <h1 className="my-4">{title}</h1>}
                    {children}
                </div>
                <Footer />
            </div>
        </div>);
};

const mapStateToProps = (state) => ({
    sidebarOpen: getLayout(state).sidebarOpen
});

const mapDispatchToProps = (dispatch) => ({
    toggleSidebar: () => dispatch(Creators.toggleSidebar())
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);