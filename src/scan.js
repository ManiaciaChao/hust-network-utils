const got = require("got");
// const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const exec = require("child_process").exec;
const pLimit = require("p-limit");
const Tesseract = require("tesseract.js");

const { clear } = require("./helper.js");
const CampusNet = require("./CampusNet");
const getOnlineDeviceNum = require("./getOnlineDevices");
const accounts = require("../data/availAccounts.json"); // Replace with yours

const scan_env = {
  time: Date.now(),
  doneNum: 0,
  totalNum: accounts.length,
  availNum: 0
};

class Connection {
  /**
   *
   * @param {{username,password}} userInfo
   * @param {string} userIndex
   */
  constructor(userInfo) {
    this.userInfo = userInfo;
    this.userIndex = null;
    this.online = null;
    this.logined = false;
  }
  async login() {
    if (!this.online) return false;
    this.userIndex = await CampusNet.login(userInfo);
    this.logined = true;
    return !!this.userIndex;
  }
  async logout() {
    this.logined = false;
    return CampusNet.logout(this.userIndex);
  }
  async checkOnline() {
    const num = await getOnlineDeviceNum(this.userInfo);
    this.online = num === 0 ? false : true;
    // console.log(this.userInfo.username + " " + num);
    scan_env.doneNum++;
    if (!this.online) {
      scan_env.availNum++;
    }
    fs.appendFile(
      `../scan_result_${scan_env.time}.csv`,
      `${this.userInfo.username},${this.userInfo.password}\n`,
      () => {}
    );
    clear();
    console.log(
      `[${scan_env.doneNum}/${scan_env.totalNum}] ${
        scan_env.availNum
      } availabe found`
    );
    return num > 0;
  }
}

const Connections = accounts.map(
  account => new Connection({ username: account.XH, password: account.PW })
);

const concurrencyJobs = [];
const limit = pLimit(20);
Connections.forEach(Connection =>
  concurrencyJobs.push(limit(() => Connection.checkOnline()))
);

clear();
exec("rm ../tmp/*.gif", (err, stdout) => console.log(stdout));

(async () => {
  // Only one promise is run at once
  const result = await Promise.all(concurrencyJobs);
  Tesseract.terminate();
  console.log(`Scan results in scan_result_${scan_env.time}.csv`);
  console.log("Happy Campus Network Surfing :)");
})();
