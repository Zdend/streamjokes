import React from 'react';
import { connect } from 'react-redux';
import { getRate, Creators, getFocusModeActive } from '../ducks/slideshow';

const RateSlider = ({ changeRate, rate, isFocusModeActive }) => {
    if (isFocusModeActive) {
        return null;
    }
    return (
        <div className="my-5">
            <div className="mb-2"><h3 className="d-inline-block mr-4">Rate of change</h3> <span className="text-uppercase"><span id="changeRateValue">{rate}</span> seconds</span></div>
            <div className="slidecontainer">
                <input type="range" min="5" max="180" value={rate} className="slider" aria-label="Rate of change"
                    onChange={changeRate} />
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    rate: getRate(state),
    isFocusModeActive: getFocusModeActive(state)
});

const mapDispatchToProps = dispatch => ({
    changeRate: (e) => dispatch(Creators.changeRate(e.target.value))
});

export default connect(mapStateToProps, mapDispatchToProps)(RateSlider);