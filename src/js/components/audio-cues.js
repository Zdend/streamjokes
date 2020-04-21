import React from 'react';

const AudioCues = () => (
    <>
        <audio src="/audio/success.mp3" id="audio-success" autostart="false"></audio>
        <audio src="/audio/fail.mp3" id="audio-fail" autostart="false"></audio>
    </>
);

export default AudioCues;