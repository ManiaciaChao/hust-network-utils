const fs = require('fs');
const got = require('got');
const { CookieJar } = require('tough-cookie');
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
const generateFilename = userInfo => {
    return `./tmp/${userInfo.username}.gif`;
};
const processOnlineStr = str => {
    const tmp = str.split('<span class="big">')[2] || null;
    return tmp ? +tmp.split('</span>')[0].trim() : false;
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
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
    const url = ['http://myself.hust.edu.cn:8080/selfservice/', 'common/web/verifycode.jsp', 'module/scgroup/web/login_judge.jsf']
    // Set CookieJar
    const cookieJar = new CookieJar();

    // Get JSESSION_ID
    const sidResult = await got(url[0], {
        cookieJar
    });

    // Get Verify Code
    const timestamp = Date.now();
    const query = new URLSearchParams([['timestamp', timestamp]]);
    const filename = generateFilename(userInfo);
    let verifyCode;
    while (!verifyCode || verifyCode.length !== 4) {
        let stream = got.stream(
            'http://myself.hust.edu.cn:8080/selfservice/common/web/verifycode.jsp',
            {
                query,
                cookieJar
            }
        ).pipe(fs.createWriteStream(filename));
        // let end = new Promise(function(resolve, reject) {
        //     stream.on('end', () => resolve(hash.read()));
        //     stream.on('error', reject); // or something like that. might need to close `hash`
        // });
        // await end;
        await sleep(100)
        verifyCode = await verifyCodeParser(filename);

        // let verifyCodeStream = got.stream(
        //     'http://myself.hust.edu.cn:8080/selfservice/common/web/verifycode.jsp',
        //     {
        //         query,
        //         cookieJar
        //     })
        // verifyCode = await verifyCodeParser(verifyCodeStream);
    }

    // Login
    const form = {
        name: userInfo.username,
        password: userInfo.password,
        verify: verifyCode,
        verifyMsg: null,
        errorCount: null
    };
    const loginResult = await got.post(
        'http://myself.hust.edu.cn:8080/selfservice/module/scgroup/web/login_judge.jsf',
        { form: true, body: form, cookieJar }
    );

    // 
    const info = await got(
        'http://myself.hust.edu.cn:8080/selfservice/module/webcontent/web/index_self_hk.jsf',
        {
            headers: {
                'Content-Type': 'charset=utf-8'
            },
            cookieJar
        }
    );

    // remove temporary file
    fs.unlinkSync(filename);
    return processOnlineStr(info.body);
};

module.exports = checkAvailable;
