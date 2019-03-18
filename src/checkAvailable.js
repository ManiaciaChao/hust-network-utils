const fs = require("fs");
const got = require("got");
const { CookieJar } = require("tough-cookie");
const verifyCodeParser = require("./verifyCodeParser");

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
  return `../tmp/${userInfo.username}.gif`;
};
const processOnlineStr = str => {
  const tmp = str.split('<span class="big">')[2] || null;
  return tmp ? +tmp.split("</span>")[0].trim() : false;
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
  const url = [
    "http://myself.hust.edu.cn:8080/selfservice/",
    "http://myself.hust.edu.cn:8080/selfservice/common/web/verifycode.jsp",
    "http://myself.hust.edu.cn:8080/selfservice/module/scgroup/web/login_judge.jsf",
    "http://myself.hust.edu.cn:8080/selfservice/module/webcontent/web/index_self_hk.jsf"
  ];
  // Set CookieJar
  const cookieJar = new CookieJar();

  // Get JSESSION_ID
  await got(url[0], { cookieJar });

  // Get Verify Code
  const timestamp = Date.now();
  const query = new URLSearchParams([["timestamp", timestamp]]);
  const filename = generateFilename(userInfo);
  let verifyCode;
  let stream;
  while (!verifyCode || verifyCode.length !== 4) {
    await new Promise((resolve, reject) => {
      stream = got
        .stream(url[1], {
          query,
          cookieJar
        })
        .pipe(fs.createWriteStream(filename));
      stream.on("finish", resolve);
    });
    verifyCode = await verifyCodeParser(filename);
  }

  // Login
  const form = {
    name: userInfo.username,
    password: userInfo.password,
    verify: verifyCode,
    verifyMsg: null,
    errorCount: null
  };
  const loginResult = await got.post(url[2], {
    form: true,
    body: form,
    cookieJar
  });

  //
  const info = await got(url[3], {
    cookieJar
  });

  // remove temporary file
  fs.unlinkSync(filename);

  return processOnlineStr(info.body);
};

module.exports = checkAvailable;
