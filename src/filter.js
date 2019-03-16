const accounts = require('../data/accounts.json');
const results = require('./result.json');
const fs = require('fs');

// console.log(results);

const filtered = accounts.filter(account => {
    // console.log(account.XH);
    return results.includes(account.XH);
});

fs.writeFileSync('./availAccounts.json', JSON.stringify(filtered, null, 4));

console.log(filtered.length);
