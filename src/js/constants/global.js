export const FAVOURITE_CATEGORY = 'favourites';
export const ALL_CATEGORIES = ['age', 'alone', 'amazing', 'anger', 'anniversary', 'architecture', 'art', 'attitude', 'beauty', 'best', 'birthday', 'business', 'car', 'celebrity', 'change', 'christmas', 'communication', 'computer science', 'computers', 'cool', 'courage', 'dad', 'dating', 'death', 'design', 'diet', 'dreams', 'easter', 'education', 'environmental', 'equality', 'experience', 'failure', 'faith', 'family', 'famous', 'fathersday', FAVOURITE_CATEGORY, 'fear', 'finance', 'fitness', 'food', 'forgiveness', 'freedom', 'friendship', 'fun jokes', 'funny', 'future', 'gardening', 'geek joke', 'god', 'good', 'government', 'graduation', 'great', 'happiness', 'health', 'history', 'home', 'hope', 'humor', 'imagination', 'inspirational', 'intelligence', 'jealousy', 'knowledge', 'leadership', 'learning', 'legal', 'life', 'love', 'marriage', 'medical', 'memorialday', 'men', 'mom', 'money', 'morning', 'mothersday', 'motivational', 'movies', 'movingon', 'music', 'nature', 'newyears', 'parenting', 'patience', 'patriotism', 'peace', 'pet', 'poetry', 'politics', 'positive', 'programming', 'power', 'reddit jokes', 'relationship', 'religion', 'respect', 'romantic', 'sad', 'saintpatricksday', 'science', 'short jokes', 'smile', 'society', 'sports', 'strength', 'success', 'sympathy', 'teacher', 'technology', 'teen', 'thankful', 'thanksgiving', 'time', 'travel', 'trust', 'truth', 'valentinesday', 'war', 'wedding', 'wisdom', 'women', 'work'];
export const JOKE_CATEGORIES = ['reddit jokes', 'geek joke', 'fun jokes', 'short jokes'];
export const POPULAR_CATEGORIES = [FAVOURITE_CATEGORY, 'famous', 'computer science', 'programming', 'reddit jokes', 'geek joke', 'fun jokes', 'short jokes'];
export const ALL_STATIC_CATEGORIES = ALL_CATEGORIES.filter(c => c !== FAVOURITE_CATEGORY);
export const BACKGROUND_COLORS = [
    '#bf8d3f', '#bd3e85', '#182657', '#121f40', '#8d541e',
    '#DF5B66', '#23345C', '#F1BA48', '#BD8A44', '#BFAFA0',
    '#003D73', '#0878A4', '#1Ecfd6', '#EDD170', '#c05640', 
    '#C0334D', '#D6618F', '#F1931B', '#8F715B', '#f3d4a0',
    '#A3586D', '#5C4A72', '#f3b05a', '#f4874b', '#f46ar3', 
    '#192e5b', '#1D65a6', '#72a2c0', '#00743f', '#f2a104', 
    '#253f5b', '#4f728e', '#be8260', '#d7b095', '#74412b', 
    '#000d29', '#118c8b', '#bca18d', '#f2746b', '#f14d49', 
    '#5aa382', '#78d6ac', '#bda728', '#704307', '#f78178'
];
export const DEFAULT_CHANGE_RATE = 20;

export const EXPLICIT = {
    OFF: 'OFF',
    ALLOW: 'ALLOW',
    ONLY: 'ONLY'
};

export const PUBLIC_URL = 'https://www.streamjokes.com';

export const MAX_HISTORY = 100;