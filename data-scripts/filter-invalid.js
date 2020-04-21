import fs from 'fs';
import path from 'path';

const folder = '/Users/zdenekvecek/work/projects/streamjokes/public/categories';
fs.readdirSync(folder).forEach(file => {
    const rawdata = fs.readFileSync(path.resolve(folder, file));

    const data = JSON.parse(rawdata);

    console.log('==============', file);
    const newData = data.filter(article => {
        const { t, ...rest } = article;

        const isTextInvalid = /(&|>|<)/.test(t);

        if (isTextInvalid) {
            console.log(t, rest.id);
        }

        return !isTextInvalid;
    });

    fs.writeFileSync(path.resolve(folder, file), JSON.stringify(newData), err => {
        console.error(err);
    });
});

// console.log('TOTAL MARKED ', total);