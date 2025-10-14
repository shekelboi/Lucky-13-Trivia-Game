import data from './db.json' with { type: 'json' };
import * as fs from 'fs';


const filteredData = data.filter(x => x.type == 'boolean')
const jsonString = JSON.stringify(filteredData, null, 4);
fs.writeFile('true_false_questions.json', jsonString, 'utf8', () => { });
console.log(filteredData);
