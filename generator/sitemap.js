import walk from './walker';
import path from 'path';
import { promises as fs } from 'fs';
import { PUBLIC_URL } from '../src/js/constants/global';
import mkdirp from 'make-dir';

const sitemapBody = (links) => `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${links}
</urlset>`;
const urlTemplate = (url) => `<url><loc>${PUBLIC_URL}${url}</loc></url>`;

const generateSitemap = async () => {
    const paths = await walk(path.resolve('./build'));
    const sitemap = sitemapBody(paths.map(p => urlTemplate(p.replace('index.html', ''))).join('\n'));
    await mkdirp('./dist');
    return fs.writeFile('./dist/sitemap.xml', sitemap);
};

export default generateSitemap;