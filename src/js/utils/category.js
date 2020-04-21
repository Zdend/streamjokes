import { JOKE_CATEGORIES, FAVOURITE_CATEGORY, ALL_CATEGORIES } from '../constants/global';

export const isJoke = (category) => JOKE_CATEGORIES.includes(category);
export const isFavouriteCategory = (category) => FAVOURITE_CATEGORY === category;
export const getIconByCategory = (category) => isJoke(category) ? 'far fa-grin-squint' : 'fas fa-quote-left';
export const mapIndexToCategory =  (indexes) => Array.isArray(indexes) && indexes.length ? indexes.map(index => ALL_CATEGORIES[index]) : null;
export const strigifyCategories = (selectedCategories) => selectedCategories.map(c => ALL_CATEGORIES.indexOf(c)).join(',');
export const filterNonFavouriteCategories = (categories) => categories.filter(c => !isFavouriteCategory(c));
