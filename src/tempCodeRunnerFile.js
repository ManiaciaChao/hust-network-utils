const got = require('got');
const EventEmitter = require('events').EventEmitter;
const CampusNet = require('./CampusNet');
const getOnlineDeviceNum = require('./getOnlineDeviceNum')
const accounts = require('../data/availAccounts.json')

console.log(accounts.length);