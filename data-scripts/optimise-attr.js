import fs from 'fs';
import path from 'path';
import shortid from 'shortid';

const folder = '/Users/zdenekvecek/work/projects/streamjokes/public/categories';
fs.readdirSync(folder).forEach(file => {
    const rawdata = fs.readFileSync(path.resolve(folder, file));  
    
    const data = JSON.parse(rawdata);

    console.log('==============', file);
    const newData = data.map(article => {
        const { text, cat, author, exp } = article;

        return {
            id: shortid.generate(),
            t: text,
            c: cat,
            a: author,
            e: exp
        };
    });
    
    fs.writeFileSync(path.resolve(folder, file), JSON.stringify(newData), err => {
        console.error(err);
    });
});

// console.log('TOTAL MARKED ', total);