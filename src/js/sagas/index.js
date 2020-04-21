import slideshowSagas from './slideshow';

export default function runSagas (sagaMiddleware) {
    sagaMiddleware.run(slideshowSagas);
}