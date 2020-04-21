import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { getFocusModeActive } from '../ducks/slideshow';

const Header = ({ toggleSidebar, sidebarOpen, isFocusModeActive }) => (
    <header id="header">
        {(!isFocusModeActive || sidebarOpen) &&
            <button type="button"
                onClick={toggleSidebar}
                className="btn btn-lg btn-transparent mr-3"
                id="menu-toggle"
                aria-label="Open Menu">
                <i className={classnames('fa', 'fa-2x', { 'fa-bars': !sidebarOpen, 'fa-times': sidebarOpen })}></i>
            </button>
        }
        <div className="container">
            <Link to="/">
                <img src="/images/logo.svg" alt="Logo Short Jokes" className="brand-logo" />
                <h1 className="brand-title">StreamJokes</h1>
            </Link>
        </div>
    </header>
);
const mapStateToProps = state => ({
    isFocusModeActive: getFocusModeActive(state)
});


export default connect(mapStateToProps)(Header);