
import { generatePage } from './';
import { ALL_STATIC_CATEGORIES, PUBLIC_URL } from '../src/js/constants/global';
import { dashify } from '../src/js/utils/functions';
import { expandArticles } from '../src/js/utils/converter';

export default async (CategoryPage) => {
       
    return Promise.all(ALL_STATIC_CATEGORIES.map(async (cat) => {
        const category = dashify(cat);
        const data = await import(`../public/categories/${cat}.json`);
        const articles = expandArticles(data.default);
        
        const getPreloadedState = (articleSubset) => ({
            articleContainer: {
                categorisedArticles: {
                    [cat]: articleSubset
                },
                totalCounts: {
                    [cat]: articles.length
                }
            }
        });
        const pageSize = 10;
        const targetPagesAmount = Array(Math.ceil(articles.length / pageSize)).fill(pageSize).map((el, i) => i);
        return Promise.all(targetPagesAmount.map(async (pageNum) => {
            const pagePath = `/categories/${category}/${pageNum}/`;
            const url = `${PUBLIC_URL}${pagePath}`;
            const targetPath = `${pagePath}index`;
            const props = { match: { params: { category: category, page: pageNum }}};
            global.window.location.href = url;
            const offset = pageNum * pageSize;
            const articleSubset = articles.slice(offset, offset + pageSize);

            return generatePage(targetPath, CategoryPage, getPreloadedState(articleSubset), props);
        }));

    }));
};