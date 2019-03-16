process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const fs = require('fs');

const CampusNet = require('./CampusNet');
const accounts = require('../data/accounts.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 *
 * @param {Array} accounts
 */
const test = async accounts => {
    const bools = [];
    const data = accounts.map(account => {
        return { username: account.XH, password: account.PW };
    });
    for (let i = 0; i < data.length; i++) {
        const index = i;
        const account = data[index];
        const loginResult = await CampusNet.login(account);
        console.log(
            `[${index + 1}/${accounts.length}] ${account.username} ${
                loginResult.result
            }`
        );
        if (!loginResult) {
            continue;
        }
        // await sleep(1000);
        fs.appendFileSync('./result.txt', account.username + ',\n');
        let logoutResult;
        while (!logoutResult) {
            logoutResult = await CampusNet.logout(loginResult.userIndex);
        }
        console.log('logout!');
        bools[i] = true;
    }
    // .forEach(async (account, index) => {
    //     const loginResult = await CampusNet.login(account);
    //     console.log(loginResult);
    //     if (!loginResult) {
    //         return false;
    //     }
    //     console.log(
    //         `[${index + 1}/${accounts.length}] ${account.username}`
    //     );
    //     await sleep(1000);
    //     fs.appendFileSync('./result.txt', account.username + ',\n');
    //     const logoutResult = await CampusNet.logout(loginResult.userIndex);
    //     if (!logoutResult) {
    //         throw new Error('fuck!');
    //     }
    //     console.log('logout!');
    //     bools[index] = true;
    // });
    return bools;
};

test(accounts);
