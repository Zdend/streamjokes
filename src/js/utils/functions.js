/* global DocumentTouch */
import { words } from 'capitalize';

export function isExplicit(phrase, filterWords) {
    return filterWords.some(filterWord => {
        const expression = new RegExp('^(.*?)(\\b' + filterWord + '\\b)(.*)$', 'i');
        return expression.test(phrase);
    });
}
export function escapeRegExp(str) {
    return str.replace(/[-[\]/{}()*\\+?.^$|]/g, '\\$&');
}

export function matchesSearch(article, searchExpression) {
    if (!searchExpression) {
        return true;
    }
    const expression = new RegExp(escapeRegExp(searchExpression), 'i');
    return expression.test(article.text) || expression.test(article.author);
}

export function matchesAny(source, target) {
    return target.some(el => source.includes(el));
}

export function stripQuotes(str) {
    str = str.trim();
    if (['“', '"'].includes(str.charAt(0)) && ['”', '"'].includes(str.charAt(str.length - 1))) {
        return str.substr(1, str.length - 2);
    }
    return str;
}

export function getContrastYIQ(inputHexcolor) {
    const strippedHexcolor = inputHexcolor.replace('#', '').trim();
    const hexcolor = strippedHexcolor.length === 3 ? strippedHexcolor + strippedHexcolor : strippedHexcolor;
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 160) ? 'black' : 'white'; // Original Value was 128
}

export function isTouchDevice() {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const mq = function(query) {
      return window.matchMedia(query).matches;
    };
  
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      return true;
    }
  
    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}

export function randomElement(arr) {
    const numRand = Math.floor((Math.random() * arr.length));
    return arr[numRand];
}

export const dashify = expression => `${expression || ''}`.toLowerCase().trim().replace(/[^a-z\- \d]/g, '').replace(/[\s|-]+/g, '-');
export const dashRevert = url => url.replace(/-/g, ' ');
export const dashRevertCapitalised = url => words(url.replace(/-/g, ' '));
export const unique = arr => Array.isArray(arr) ? Array.from(new Set(arr)) : arr;

export const playAudio = (id, volume) => {
    const audio = document.querySelector(`#${id}`);
    audio.volume = volume || 1;
    audio.play();
};