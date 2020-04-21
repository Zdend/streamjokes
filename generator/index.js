import React from 'react';
import ReactDOM from 'react-dom/server';
import { promises as fs } from 'fs';
import path from 'path';
import walk from './walker';
import mkdirp from 'make-dir';
import makeTemplate from '../src/js/template/index';
import del from 'del';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import createStore from '../src/js/store';
import generateCategoryPages from './category';
import { minify } from 'html-minifier';
import minifierConfig from '../html-minifier.config.json';
import generateSitemap from './sitemap';
import { PUBLIC_URL } from '../src/js/constants/global';

global.window = {
    location: {
        protocol: 'https:',
        hostname: 'www.streamjokes.com',
        href: PUBLIC_URL,
    }
};

const buildFolder = './build';
const pagesLocation = './src/js/pages';

const context = {};

const RootComponent = (Component, store, pagePath, props) => (
    <Provider store={store}>
        <StaticRouter location={pagePath} context={context}>
            <Component {...props} />
        </StaticRouter>
    </Provider>
);

export const generatePage = async (pagePath, Component, state, props) => {
    const { store } = createStore(state, true);

    const componentHtml = ReactDOM.renderToString(
        RootComponent(Component, store, pagePath, props)
    );

    const helmet = Helmet.renderStatic();
    const html = makeTemplate(componentHtml, helmet, state);
    const resolvedPath = path.join(buildFolder, pagePath + '.html');
    const dir = resolvedPath.substring(0, resolvedPath.lastIndexOf('/'));

    store.close();

    try {
        await mkdirp(dir);
    } catch (e) {
        //
    }

    const finalHtml = process.env.NODE_ENV === 'production' ? minify(html, minifierConfig) : html;
    console.log(resolvedPath);
    return fs.writeFile(resolvedPath, finalHtml);
};

const loadAndGenerate = async (componentPath, pagePath) => {
    const promise = await import(componentPath);
    if (pagePath === '/category/index') {
        return generateCategoryPages(promise.default);
    } else {
        return generatePage(pagePath, promise.default);
    }
};

const generateAll = async () => {
    await del(buildFolder);
    await mkdirp(buildFolder);
    const paths = await walk(path.resolve(pagesLocation));

    const promises = paths.map(pagePath => {
        const pathname = pagePath.replace('.js', '');
        return loadAndGenerate(path.resolve(pagesLocation + pagePath), pathname);
    });

    try {
        await Promise.all(promises);
        await generateSitemap();
    } catch (e) {
        console.error(e);
    }
};

export default generateAll;