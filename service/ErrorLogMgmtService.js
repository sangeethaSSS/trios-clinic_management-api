const commonService = require('../service/ErrorLogMgmtService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');


module.exports.errorlog = async function (platform, module, error, functionality) {
  try {
    var createupdate_date = new Date();
    var direction = './log/';

    var fs = require('fs');
    if (!fs.existsSync(direction)) {
      fs.mkdirSync(direction);
    }
    const dateTimeStr = new Date().toLocaleString();
    const ErrortimeMinutes = (dateTimeStr.split(", ")[1]).split(":").join(":")
    var FileName = createupdate_date.getFullYear() + '-' + createupdate_date.getMonth() + 1 + '-' + createupdate_date.getDate();
    var Format = '\n' + ErrortimeMinutes + ' Platform : ' + platform + ', Module : ' + module + ', Error : ' + error + ', Functionality : ' + functionality;

    fs.appendFile('./log/' + FileName + '_log.txt', Format, (err) => {
      if (err) throw err;
    });

    return true;
  } catch (err) {
    console.log(err, 'error');
  }
}

//Delete Employee service
module.exports.errorLog = async (req) => {
  try {
    const { platform, Module, error, functionality } = req;
    await commonService.errorlog(platform, Module, error, functionality);
    return { message: "Updated" }
  } catch (error) {
    throw new Error(constants.userMessage.TOKEN_MISSING);
  }
}