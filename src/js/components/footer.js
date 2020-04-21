import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getFocusModeActive } from '../ducks/slideshow';
import SocialButtons from './social-btns';

const Separator = () => <div className="mx-4 d-inline-block">|</div>;
const Footer = ({ isFocusModeActive }) => {
    if (isFocusModeActive) {
        return null;
    }
    return (
        <footer className="text-center">
            <SocialButtons />
            <div className="mb-4">
                <Link to="/get-started/">Get Started</Link><Separator />
                <Link to="/categories/">Categories</Link><Separator />
                <Link to="/terms/">Terms &amp; Conditions</Link><Separator />
                <Link to="/privacy/">Privacy</Link>
            </div>
            <div>© <Link to="/">streamjokes.com</Link>, All rights reserved.</div>
        </footer>
    );
};

const mapStateToProps = state => ({
    isFocusModeActive: getFocusModeActive(state)
});


export default connect(mapStateToProps)(Footer);