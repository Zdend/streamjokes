import fs from 'fs';
import path from 'path';
import explicitWords from './explicit-words.json';

const folder = '/Users/zdenekvecek/work/projects/streamjokes/public/categories';
let total = 0;
fs.readdirSync(folder).forEach(file => {
    const rawdata = fs.readFileSync(path.resolve(folder, file));  
    
    const data = JSON.parse(rawdata);

    console.log('==============', file);
    const filteredData = [];
    const newData = data.map(i => {
        const { text } = i;

        const isExp = explicitWords.some(filterWord => {
            const expression = new RegExp('^(.*?)(\\b' + filterWord + '\\b)(.*)$', 'i');
            return expression.test(text);

        });

        if (isExp) {
            // console.log(`${text}`);
            filteredData.push(i);
            return { ...i, exp: true };
        } else {
            return i;
            
        }
        // return !;
    });
    
    const removed = filteredData.length;
    total += removed;
    console.log(newData.length, `Removed: ${removed}`);
    
    fs.writeFileSync(path.resolve(folder, file), JSON.stringify(newData), err => {
        console.error(err);
    });

});

console.log('TOTAL MARKED ', total);