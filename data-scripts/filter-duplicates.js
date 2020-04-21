import fs from 'fs';
import path from 'path';
import stringSimilarity from 'string-similarity';

const folder = '/Users/zdenekvecek/work/projects/streamjokes/public/categories';

fs.readdirSync(folder).forEach(file => {
    const rawdata = fs.readFileSync(path.resolve(folder, file));  
    
    const data = JSON.parse(rawdata);

    console.log('==============', file);
    const filteredData = [];
    const newData = data.filter(i => {
        const { text } = i;
        const exists = filteredData.some(a => {
            const sim = stringSimilarity.compareTwoStrings(a.text, text);
            return sim > 0.95;
        });

        if (exists) {
            console.log(`${text}`);
        } else {
            filteredData.push(i);
        }
        return !exists;
    });
    
    console.log(newData.length, `Removed: ${data.length - newData.length}`);
    
    fs.writeFileSync(path.resolve(folder, file), JSON.stringify(newData), err => {
        console.error(err);
    });

});