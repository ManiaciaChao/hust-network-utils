const fs = require('fs');
const checkAvailable = require('./checkAvailable');

const getOnlineDeviceNum = async (userInfo) => {
    let num = false;
    while (num === false) {
        num = await checkAvailable(userInfo);
    };
    // console.log(userInfo.username + ' ' + num)
    return num
}

module.exports = getOnlineDeviceNum;