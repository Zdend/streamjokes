import React from 'react';
import Layout from '../../components/layout';
import { ALL_STATIC_CATEGORIES } from '../../constants/global';
import { Link } from 'react-router-dom';
import { dashify } from '../../utils/functions';
import { words } from 'capitalize';

const letter_groups = ALL_STATIC_CATEGORIES.reduce((r, c) => {
    const firstLetter = c.substring(0, 1);
    return {
        ...r, 
        [firstLetter]: [...(r[firstLetter] || []), c] 
    };
},{});

const CategoriesPage = () => {
    return (
        <Layout title="Categories" description={`Read jokes and quotes from ${ALL_STATIC_CATEGORIES.length} categories.`}>
            {Object.entries(letter_groups).map(([letter, categories]) => (
                <div key={letter} className="categories-page__group">
                    <h2 className="categories-page__group-title">{letter}</h2>
                    <ul className="categories-page__group-list">
                        {categories.map(cat => (
                            <li key={cat} className="categories-page__item">
                                <Link to={`/categories/${dashify(cat)}/0/`} className="categories-page__link  btn btn-link">{words(cat)}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </Layout>
    );
};

export default CategoriesPage;