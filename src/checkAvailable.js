const fs = require('fs');
const got = require('got');
const { CookieJar } = require('tough-cookie');
const FormData = require('form-data');
const verifyCodeParser = require('./verifyCodeParser');

/**
 *
 * @param {{
    realname,
    username,
    password
    }} userInfo
 * @param {number} timestamp
 */
const generateFilename = (userInfo, timestamp) => {
    return `./tmp/${userInfo.username}_${timestamp}.gif`;
};

/**
 * 
 * @param {{
    realname,
    username,
    password
    }} userInfo
 * @param {*} config 
 */
const checkAvailable = async (userInfo, config) => {
    // Set CookieJar
    const cookieJar = new CookieJar();

    // Get JSESSION_ID
    const sidResult = await got('http://myself.hust.edu.cn:8080/selfservice/', {
        cookieJar
    });

    // Get Verify Code
    const timestamp = Date.now();
    const query = new URLSearchParams([['timestamp', timestamp]]);
    const filename = generateFilename(userInfo, timestamp);
    got.stream(
        'http://myself.hust.edu.cn:8080/selfservice/common/web/verifycode.jsp',
        {
            query,
            cookieJar
        }
    ).pipe(fs.createWriteStream(filename));
    const verifyCode = await verifyCodeParser(filename);

    // Login
    const form = new FormData();
    form.append('name', userInfo.username);
    form.append('password', userInfo.password);
    form.append('verify', verifyCode);
    form.append('verifyMsg', null);
    form.append('errorCount', null);
    const loginResult = await got.post(
        'http://myself.hust.edu.cn:8080/selfservice/module/scgroup/web/login_judge.jsf',
        { body: form, cookieJar }
    );

    // remove temporary file
    fs.unlinkSync(filename);

    return loginResult.body.includes(userInfo.realname);
};

module.exports = checkAvailable;
