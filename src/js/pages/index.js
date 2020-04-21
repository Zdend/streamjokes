import React from 'react';
import Layout from '../components/layout';
import CategorySelector from '../components/category-selector';
import RateSlider from '../components/rate-slider';
import Slideshow from '../components/slideshow';
import Countdown from '../components/countdown';
import ActionButtons from '../components/action-buttons';
import SlideshowKeys from '../components/slideshow-keys';
import SlideshowGestures from '../components/slideshow-gestures';
import AudioCues from '../components/audio-cues';

class HomePage extends React.Component {
    render = () => (
        <Layout headTitle="Stream Jokes and Quotes">
            <Slideshow />
            <SlideshowKeys />
            <SlideshowGestures />
            <Countdown />
            <ActionButtons />
            <RateSlider />
            <CategorySelector />
            <AudioCues />
        </Layout>
    );
}

export default HomePage;