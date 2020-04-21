import fs from 'fs';
import path from 'path';

const folder = '/Users/zdenekvecek/work/projects/streamjokes/public/categories';
const folderLong = '/Users/zdenekvecek/work/projects/streamjokes/public/categories-long';
let total = 0;
fs.readdirSync(folder).forEach(file => {
    const rawdata = fs.readFileSync(path.resolve(folder, file));  
    
    const data = JSON.parse(rawdata);

    console.log('==============', file);
    const filteredData = [];
    const newData = data.filter(i => {
        const { text, author, cat } = i;
        // text.length > 300
        const longer =  text.length > 300 || (author && author.length > 100);

        if (longer) {
            // console.log(`${text} ${author}`);
        } else {
            filteredData.push(i);
        }
        return !longer;
    });
    const removed = data.length - newData.length;
    total += removed;
    console.log(newData.length, `Removed: ${removed}`);
    
    // fs.writeFileSync(path.resolve(folderLong, file), JSON.stringify(filteredData), err => {
    //     console.error(err);
    // });
    // fs.writeFileSync(path.resolve(folder, file), JSON.stringify(newData), err => {
    //     console.error(err);
    // });

});

console.log('TOTAL MOVED ', total);