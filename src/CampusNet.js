const got = require('got');
// const { CookieJar } = require('tough-cookie');
const FormData = require('form-data');
// const verifyCodeParser = require('./verifyCodeParser');
const RSA = require('./rsa-loader');
const { site } = require('../config.json');
// import accounts from '../config.json';

const encrypt = password =>
    RSA.encryptedString(
        RSA.RSAKeyPair(site.eportal.publicKey[0], site.eportal.publicKey[1]),
        password
    );

class CampusNet {
    async connection() {
        const result = await got('https://www.baidu.com');
        return result.body.includes('refresh');
    }
    /**
     *
     * @param {{username,password}} userInfo
     */
    async login(userInfo) {
        const form = new FormData();
        // operatorPwd=&validcode=&passwordEncrypt=true
        form.append('userId', userInfo.username);
        form.append('password', encrypt(userInfo.password));
        form.append('operatorPwd', '');
        form.append('validcode', '');
        form.append('passwordEncrypt', true);
        const loginResult = await got.post(
            'http://192.168.50.3:8080/eportal/InterFace.do?method=login',
            { body: form }
        );
        return await this.connection();
    }
    /**
     *
     * @param {number} userIndex
     * @description TODO: store userIndex
     */
    async logout(userIndex) {
        const form = `userIndex=${userIndex}`;
        await got(
            'http://192.168.50.3:8080/eportal/InterFace.do?method=logout',
            { body: form }
        );
        return await !this.connection();
    }
}

module.exports = CampusNet;
