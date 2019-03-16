const got = require('got');
// const { CookieJar } = require('tough-cookie');
const FormData = require('form-data');
// const verifyCodeParser = require('./verifyCodeParser');
const RSA = require('./rsa-loader');
const { site } = require('../config.json');
// import accounts from '../config.json';

/**
 *
 * @param {Object} form
 */
const getForm = form =>
    Object.keys(form)
        .map(key => `${key}=${form[key]}`)
        .join('&');

const encrypt = password =>
    RSA.encryptedString(
        RSA.RSAKeyPair(site.eportal.publicKey[0], site.eportal.publicKey[1]),
        password
    );

class CampusNet {
    async connection() {
        const result = await got('https://www.baidu.com');
        // console.log(result.body);
        return result.body.includes('baidu');
    }
    /**
     *
     * @param {{username,password}} userInfo
     */
    async login(userInfo) {
        // Get so-called queryString
        const qsResult = await got('http://123.123.123.123');
        const queryString = qsResult.body.split('?')[1].split(`'`)[0];

        const form = {
            userId: userInfo.username,
            password: encrypt(userInfo.password),
            queryString: queryString,
            operatorPwd: '',
            validcode: '',
            passwordEncrypt: 'true'
        };

        const loginResult = await got.post(
            'http://192.168.50.3:8080/eportal/InterFace.do?method=login',
            { form: true, body: form }
        );
        // console.log(loginResult.body);
        const userIndex = JSON.parse(loginResult.body).userIndex;
        if (!userIndex) {
            return false;
        }
        // console.log(userIndex);
        return (await this.connection()) ? JSON.parse(loginResult.body) : false;
    }
    /**
     *
     * @param {string} userIndex
     * @description TODO: store userIndex
     */
    async logout(userIndex) {
        const form = { userIndex: userIndex };
        await got(
            'http://192.168.50.3:8080/eportal/InterFace.do?method=logout',
            { form: true, body: form }
        );
        return !(await this.connection());
    }
}

module.exports = new CampusNet();
