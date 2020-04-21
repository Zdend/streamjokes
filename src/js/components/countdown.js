import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getNextRotationTime, getAutoRotate, Creators } from '../ducks/slideshow';

const calcPercentage = (nextRotationTime, baseline) => {
    const currentTimestamp = new Date().getTime() - baseline;
    const nextTimestamp = nextRotationTime - baseline;
    const percentage = 100 - 100 * currentTimestamp / nextTimestamp;
    return percentage <= 0 ? 0 : (percentage >= 100 ? 100 : percentage);
};

function Countdown ({ nextRotationTime, autoRotate, nextArticle }) {
    const [ currentPercentage, setPercentage ] = useState(100);
    
    useEffect(() => {
        if (!autoRotate) {
            return;
        }

        const baseline = new Date().getTime();
        const interval = setInterval(() => {
            const percentage = calcPercentage(nextRotationTime, baseline);
            if (percentage <= 0) {
                nextArticle();
                clearInterval(interval);
            } else {
                setPercentage(percentage);
            }
        }, 30);
        return () => {
            clearInterval(interval);
        };
    }, [ nextRotationTime, autoRotate ]);

    return (
        <div className="countdown-slider" >
            <div className="countdown-slider__bar" style={{ width: `${currentPercentage}%` }}></div>
        </div>
    );
}

const mapStateToProps = state => ({
    nextRotationTime: getNextRotationTime(state),
    autoRotate: getAutoRotate(state)
});


const mapDispatchToProps = dispatch => ({
    nextArticle: () => dispatch(Creators.requestNextArticle()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Countdown);