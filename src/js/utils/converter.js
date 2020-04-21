export const expandArticle = ({ id, t, a, c, e }) => ({
    id,
    text: t,
    author: a,
    cat: c,
    exp: e
});

export const expandArticles = (articles) => articles.map(expandArticle);