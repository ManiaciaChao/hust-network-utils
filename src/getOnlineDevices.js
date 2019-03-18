const fs = require("fs");
const checkAvailable = require("./checkAvailable");

const getOnlineDeviceNum = async userInfo => {
  let num = false;
  while (num === false) {
    num = await checkAvailable(userInfo);
  }
  return num;
};

module.exports = getOnlineDeviceNum;
