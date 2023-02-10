const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService');
const constants = require('../constants');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';
var setting = { ...constants.defaultSettings };
var loginStatus = { ...constants.loginStatus };
const logStreamName = 'userMgmtService';
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');


//create Medical jwt 
module.exports.creatMedicalJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Medical", error, "creatMedicalJwt");
    throw new Error(error);
  }
}
//create Medical service
module.exports.creatMedical = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req.jwtToken) {
      const decoded = await commonService.jwtVerify(req.jwtToken);
      const {certificate_id,patient_id,patient_name,mobile_number,template_id,custom_template_content,medical_startdate,medical_enddate, employee_id,user_id,active_status} = decoded.data;
      var createupdate_date = new Date().setHours(0, 0, 0,0);
      if (decoded) {
        // if (user_code == 0) {
        //   var makerid = await commonService.insertLogs(user_id, "Insert User");
        //   const max = await client.query(`select coalesce(max(user_code),0) + 1 as mr FROM tbl_user_master`)
        //   var maxuser = max && max.rows[0].mr;
        //   const create_result = await client.query(`INSERT INTO "tbl_user_master"("employee_id","user_code","username","password","userrole_id","active_status","maker_id","user_id","created_date") values ($1, $2, $3,$4,$5,$6,$7,$8,$9) `, [employee_id, maxuser,username,newpwsd_en,userrole_id, active_status, makerid, user_id, createupdate_date]);
        //   let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
        //   if (create_usercode == 1) {
        //     return constants.userMessage.USER_CREATED;
        //   }
        //   else { return '' }
        // }
        // else {
        //   var makerid = await commonService.insertLogs(user_id, "Update User");
        //   const user_Count = await client.query(`select count(*) as count FROM tbl_user_master where user_code =` + user_code)
        //   var count_Check = user_Count && user_Count.rows[0].count
        //   if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
        //     const update_result = await client.query(`UPDATE "tbl_user_master" set "username"=$1, "employee_id"=$2,"password"=$3,"userrole_id"=$4,"active_status"=$5,"maker_id"=$6,"user_id"=$7,"updated_date"=$8 where "user_code" = $9 `, [username, employee_id, newpwsd_en, userrole_id, active_status, makerid, user_id, createupdate_date,user_code]);
        //     let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
        //     if (update_code == 1) {
        //       return constants.userMessage.USER_UPDATED;
        //     }
        //     else { return '' }
        //   }
        // }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Medical", error, "creatMedical");
    if (client) { client.end(); }
    throw new Error(error);
  }
}