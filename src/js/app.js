import React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'react-router-redux';
import ScrollToTop from './components/scroll-to-top';
import IndexPage from './pages';
import GetStartedPage from './pages/get-started';
import CategoriesPage from './pages/categories';
import TermsPage from './pages/terms';
import CategoryPage from './pages/category';
import PrivacyPage from './pages/privacy';
setConfig({ pureSFC: true });

const App = ({ store, persistor, history }) => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <ScrollToTop>
                    <Switch>
                        <Route path="/get-started" component={GetStartedPage} />
                        <Route exact path="/categories" component={CategoriesPage} />
                        <Route path="/terms" component={TermsPage} />
                        <Route exact path="/categories/:category/:page" component={CategoryPage} />
                        <Route exact path="/privacy" component={PrivacyPage} />
                        <Route component={IndexPage} />
                    </Switch>
                </ScrollToTop>
            </ConnectedRouter>
        </PersistGate>
    </Provider>
);

export default hot(module)(App);