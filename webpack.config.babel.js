/* global __dirname */
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import generateStatic from './generator';
import webpack from 'webpack';
import WorkboxPlugin from 'workbox-webpack-plugin';

const isProd = process.env.NODE_ENV === 'production';
const skipGenerating = !!process.env.skipGenerating;

const configFactory = async () => {
    if (!skipGenerating) {
        await generateStatic();
    }
    return {
        devtool: 'inline-source-map',
        optimization: {
            minimizer: [
                isProd && new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false
                }),
                isProd && new OptimizeCSSAssetsPlugin({})
            ].filter(Boolean),
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        chunks: 'initial',
                        name: 'vendor',
                        enforce: true
                    },
                }
            }
        },
        entry: {
            styles: [
                './src/scss/styles.scss'
            ],
            app: ['@babel/polyfill', './src/js/index.js']
        },
        output: {
            filename: '[name].js',
            path: __dirname + '/dist',
            publicPath: '/'
        },
        devServer: {
            contentBase: './dist'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: exts('jpeg', 'jpg', 'png', 'gif'),
                    loader: 'url-loader',
                    options: {
                        limit: 10240
                    }
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff'
                    }
                },
                {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader'
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        // fallback to style-loader in development
                        !isProd ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.PUBLIC_URL': JSON.stringify(''),
                BROWSER: JSON.stringify(true)
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new CopyWebpackPlugin([
                { from: 'public', to: '' },
                { from: 'build', to: '' }
            ]),
            isProd && new WorkboxPlugin.GenerateSW({
                swDest: 'sw.js',
                cacheId: 'sw-runtime',
                skipWaiting: true,
                clientsClaim: true,
                ignoreUrlParametersMatching: [/./],
                offlineGoogleAnalytics: true,
                exclude: [/.*\.json$/, /categories\/.+\/index.html$/, /_redirects/, /_headers/],
                runtimeCaching: [{
                    urlPattern: /\.(?:png|gif|jpg|jpeg|svg|ico)$/,
                    handler: 'cacheFirst',
                    options: {
                        cacheName: 'images',
                        expiration: {
                            maxEntries: 30,
                            maxAgeSeconds: 60 * 60 * 30,
                        },
                    }
                }, {
                    urlPattern: /.*\.json$/,
                    handler: 'staleWhileRevalidate',
                    options: {
                        matchOptions: {
                            ignoreSearch: true
                        }
                    }
                }, {
                    urlPattern: new RegExp('^https://fonts.gstatic.com/'),
                    handler: 'cacheFirst',
                    options: {
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        cacheName: 'fonts',
                        expiration: {
                            maxEntries: 30,
                            maxAgeSeconds: 60 * 60 * 30,
                        },
                    }
                }]
            })
        ].filter(Boolean)
    };
};

function exts(...extensions) {
    const extRegexString = '\\.(' + extensions.join('|') + ')$';
    return new RegExp(extRegexString);
}

export default configFactory;