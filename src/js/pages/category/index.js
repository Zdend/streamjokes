import React, { useEffect } from 'react';
import Layout from '../../components/layout';
import Spinner from '../../components/spinner';
import { dashRevert } from '../../utils/functions';
import { isJoke, strigifyCategories } from '../../utils/category';
import { connect } from 'react-redux';
import { Creators, getCategorisedArticles, getArticlesLoading, getTotalCounts } from '../../ducks/articles';
import { words } from 'capitalize';
import { Link } from 'react-router-dom';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import CategoryPageKeys from '../../components/category-page-keys';
import LikeButton from '../../components/like-button';
import AudioCues from '../../components/audio-cues';
import SimpleTooltip from '../../components/simple-tooltip';

const CategoryPage = ({ category, articles, loadCategoryRequest, isLoading, page, originalCategory, hasNext, totalArticles, hasAllData }) => {
    useEffect(() => {
        if (!hasAllData) {
            loadCategoryRequest(category);
        }
    }, [category]);
    const prevPath = `/categories/${originalCategory}/${page - 1}/`;
    const nextPath = `/categories/${originalCategory}/${page + 1}/`;
    const capCategory = words(category);
    const typeName = isJoke(category) ? 'jokes' : 'quotes';
    const title = `${capCategory} ${!/joke/i.test(capCategory) ? typeName : ''}`;
    const isLoadingNoData = isLoading && !articles.length;
    const pageDescription = !isLoadingNoData ? articles.map(a => a.text).reduce((p, c) => {
        const prevLength = p?.length;
        const curLength = c?.length;
        return prevLength > curLength ? c : p;
    }, articles[0]?.text) : `Dive in and start reading our ${totalArticles} on a topic of ${typeName}.`;
    return (
        <Layout title={<>{title} <span className="category__page-title">Page {page}</span></>} headTitle={`${title} - Page ${page}`}
            description={`${pageDescription}. Discover ${totalArticles} ${typeName} like this. Category: ${capCategory}.`}
            canonicalPath={`/categories/${originalCategory}/${page}/`}>
            <Link to="/categories" className="mb-5 d-inline-block"><i className="fa fa-chevron-left mr-2"></i> Back</Link>
            {isLoadingNoData && <h2>Loading <Spinner className="ml-2" /></h2>}
            {!isLoadingNoData && <ul className="category-page__list">
                {Array.isArray(articles) && articles.map(article => (
                    <li key={article.text} className="category-page__row">
                        {!article.author && <LikeButton iconBaseClassName="fa-1x" hideKeyHint article={article} btnBaseClassName="btn" wrapperClassName="ml-2 float-right" />}
                        <Link to={`/?categories=${strigifyCategories([category])}&id=${article.id}`}>{article.text}</Link>

                        {article.author && (
                            <div className="text-right">
                                <LikeButton iconBaseClassName="fa-1x" hideKeyHint article={article} btnBaseClassName="btn" wrapperClassName="ml-2 float-right" />
                                {article.author}
                            </div>
                        )}
                        
                    </li>
                ))}
            </ul>}
            {!isLoadingNoData && (
                <Pagination className="mt-5 mx-auto">
                        <PaginationItem disabled={page < 1} className="w-50">
                            <SimpleTooltip content="Previous page [←]" wrapperClassName="w-100">
                                <PaginationLink previous tag={Link} to={prevPath} className="btn-transparent text-left">Previous</PaginationLink>
                            </SimpleTooltip>
                        </PaginationItem>
                    <PaginationItem disabled={!hasNext} className="w-50">
                        <SimpleTooltip content="Next page [→]" wrapperClassName="w-100">
                            <PaginationLink next tag={Link} to={nextPath} className="btn-transparent text-right">Next</PaginationLink>
                        </SimpleTooltip>
                    </PaginationItem>
                    <CategoryPageKeys prevPath={page < 1 ? null : prevPath} nextPath={!hasNext ? null : nextPath} />
                </Pagination>
            )}
            <AudioCues />
        </Layout>
    );
};

const mapStateToProps = (state, { match: { params: { category, page } }}) => {
    const targetPageSize = 10;
    const p = parseInt(page, 10) || 0;
    const categorisedArticles = getCategorisedArticles(state);
    const totalCounts = getTotalCounts(state);
    const revertedCategory = dashRevert(category);
    const categoryAsKey = revertedCategory.toLowerCase();
    const articles = (categorisedArticles[categoryAsKey] || []);
    const totalArticles = totalCounts[categoryAsKey];
    const hasNext = ((p + 1) * targetPageSize) < totalArticles;
    const hasAllData = articles.length >= totalArticles;

    const articleSubset = hasAllData ? articles.slice((p * targetPageSize), (p + 1) * targetPageSize) : articles;

    return {
        articles: articleSubset,
        totalArticles,
        hasAllData,
        category: revertedCategory,
        isLoading: getArticlesLoading(state),
        originalCategory: category,
        page: p,
        hasNext,
        pageSize: targetPageSize
    };
};

const mapDispatchToProps = dispatch => ({
    loadCategoryRequest: cat => dispatch(Creators.loadCategoryRequest(cat))
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage);