const got = require('got');
const EventEmitter = require('events').EventEmitter;
const Limiter = require('async-limiter')

const CampusNet = require('./CampusNet');
const getOnlineDeviceNum = require('./getOnlineDevices')
const accounts = require('../data/availAccounts.json')

let connecting;

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
        console.log(this.userInfo.username + ' ' + num)
        this.online=(num===0)?false:true;
        return num > 0;
    }
    scanOnline() {
        return getOnlineDeviceNum(this.userInfo);
        // console.log(this.userInfo.username + ' ' + num)
    }
}

const concurrencyJobs = new Limiter({ concurrency: 100 });

const Connections = accounts.map(account => new Connection({ username: account.XH, password: account.PW }));
// console.log(Connections.length);

Connections.forEach(Connection=>Connection.checkOnline())

// Connections.forEach(Connection=>{
//     if (Connection.online !== false){
//         login();
//         connecting = Connection;
//         break;
//     }
// })


// Connections[2].checkOnline()

    // for (let i = 0; i < 2; i++) {
    //     Connections[i].checkOnline();
    //     // console.log("!")
    // }

// class Connectivity extends EventEmitter {
//     constructor(){
//         this.user = null;
//         this.addListener('connect',()=>{})
//         this.addListener('disconnect',()=>{})
//         this.addListener('scan',()=>{})
//     }

// }
