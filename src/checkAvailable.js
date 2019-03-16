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
    return `./${userInfo.username}.gif`;
};
const processOnlineStr = str => {
    const tmp = str.split('<span class="big">')[2] || null;
    return tmp ? tmp.split('</span>')[0] : false;
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
    // Set CookieJar
    const cookieJar = new CookieJar();

    // Get JSESSION_ID
    const sidResult = await got('http://myself.hust.edu.cn:8080/selfservice/', {
        cookieJar
    });
    await got('http://myself.hust.edu.cn:8080/selfservice/entry.jsp', {
        cookieJar
    });
    // console.log(sidResult.rawHeaders[13].split(';')[0]);

    // Get Verify Code
    const timestamp = Date.now();
    const query = new URLSearchParams([['timestamp', timestamp]]);
    const filename = generateFilename(userInfo);

    // got.get(
    //     'http://myself.hust.edu.cn:8080/selfservice/common/web/verifycode.jsp',
    //     {
    //         query,
    //         cookieJar
    //     }
    // ).then(d => console.log(d.body));
    // return;
    let verifyCode;
    // console.log = () => {};
    while (!verifyCode || verifyCode.length !== 4) {
        got.stream(
            'http://myself.hust.edu.cn:8080/selfservice/common/web/verifycode.jsp',
            {
                query,
                cookieJar
            }
        ).pipe(fs.createWriteStream(filename));
        await sleep(100);
        verifyCode = await verifyCodeParser(filename);
    }

    // console.log(verifyCode);
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
    // console.log(loginResult.request.gotOptions.body);
    // console.log(cookieJar);
    const info = await got(
        'http://myself.hust.edu.cn:8080/selfservice/module/webcontent/web/index_self_hk.jsf?',
        {
            headers: {
                'Content-Type': 'charset=utf-8'
            },
            cookieJar
        }
    );
    // console.log(processOnlineStr(info.body));
    // console.log(info.rawHeaders);
    // fs.writeFileSync('show.html', info.body);

    // remove temporary file
    fs.unlinkSync(filename);
    return processOnlineStr(info.body);
    // return loginResult.body.includes(userInfo.realname);
};

module.exports = checkAvailable;
