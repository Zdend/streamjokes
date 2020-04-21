import { headerGTM, bodyGTM } from './gtm';

export default (content, helmet, preloadedState = {}) => `<!DOCTYPE html>
<html lang="en">
<head ${helmet.htmlAttributes.toString()}>
    <meta charset="UTF-8">
    ${helmet.title.toString()}
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="keywords" content="infinite jokes, quotes, jokes, stream quotes, stream quotes, stream jokes, background quotes, wallpaper quotes" />
    
    <meta name="robots" content="index,follow" />
    <meta name="theme-color" content="Teal"/>
    ${helmet.meta.toString()}
    ${helmet.link.toString()}

    <link rel="manifest" href="/manifest.json">
    <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
    
    ${process.env.NODE_ENV === 'production' ? '<link href="/styles.css" rel="stylesheet">' : ''}
    ${headerGTM}

    
    ${helmet.link.toString()}
</head>

<body id="body" style="background-color: Teal;" class="light-theme" ${helmet.bodyAttributes.toString()}>
    ${bodyGTM}
    <div id="root">${content}</div>

    <script>
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    ${process.env.NODE_ENV !== 'production' ? '<script type="text/javascript" src="/styles.js"></script>' : ''}
    <script type="text/javascript" src="/vendor.js"></script>
    <script type="text/javascript" src="/app.js"></script>
</body>

</html>
`;