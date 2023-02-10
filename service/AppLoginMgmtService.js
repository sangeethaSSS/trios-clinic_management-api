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

//Login jwt 
module.exports.loginJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Login", error, "loginJwt");
    throw new Error(error);
  }
}

//login service
module.exports.login = async (req) => {
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
      const { user_code,username,pincode} = decoded.data;
      const newpincode_en = await commonService.encryptpassword({ pwd: pincode });
      if (decoded) {
        var response = {}
        // const count_check = await client.query(`select a.employee_id,a.username,a.password,a.userrole_id,a.active_status,a.user_id  from tbl_user_master as a inner join tbl_employee_master as b on a.employee_id = b.employee_id  where a.username = $1 and a.password = $2`, [username, newpwsd_en])

       // const count_check = await client.query('SELECT * FROM  tbl_user_master WHERE user_code = $1 AND pincode =$2 LIMIT 1', [user_code,newpincode_en])
       

       const count_check = await client.query('SELECT a.employee_id,a.username,a.userrole_id,a.active_status,b.employee_id as user_id,b.employee_name,a.user_code,c.employee_category_name ,c.employee_category_id FROM  tbl_user_master as  a inner join tbl_employee_master as b on a.employee_id = b.employee_id inner join tbl_def_employee_category as c on c.employee_category_id = b.employee_category_id WHERE a.user_code = $1 AND a.pincode =$2 LIMIT 1', [user_code,newpincode_en])
       
       if(client){
          client.end();
         }
        if (count_check && count_check.rows.length > 0) {
          var Loginarray = count_check.rows[0]
          if (Loginarray.active_status == 1) {
            response = { "UserInfo": Loginarray, "message": constants.userMessage.LOGIN_SUCCESS }
            return response
          }
          else {
            response = { "UserInfo": constants.userMessage.INACTIVE_USER, "message": "unsuccess" }
            return response;

          }
        }
        else {
        
          response = { "UserInfo": constants.userMessage.INVALID_PASSWORD, "message": "unsuccess" }
          return response;
        }
      }
      else{
        if (client) {client.end();}
    }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Login", error, "login");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
}
}

//login service
module.exports.deviceCheck = async (req) => {
    const client = new Client({
      user: connectionString.user,
      host: connectionString.host,
      database: connectionString.database,
      password: connectionString.password,
      port: connectionString.port,
    });
    await client.connect();
    try {
      if (req.device_id) {
       
        const device_id = req.device_id;
  
         var response = {}
         const count_check = await client.query(`SELECT a.user_code,a.username,a.userrole_id,a.employee_id,a.active_status,a.user_id,(CASE WHEN b.employee_category_id ='1' THEN CONCAT('Dr.',Upper(b.employee_name)) ELSE Upper(b.employee_name) END ) as employee_name FROM  tbl_user_master as a left join tbl_employee_master as b on b.employee_id = a.employee_id  WHERE a.device_id = $1 LIMIT 1`, [device_id])

         if(client){
            client.end();
           }
           if (count_check && count_check.rows.length > 0) {
            var Loginarray = count_check.rows[0]
            if (Loginarray.active_status == 1) {
              response = { "UserInfo": Loginarray, "message": "success" }
              return response
            }
            else {
            //Your account is inactive
             response = { "UserInfo": Loginarray, "message": "unsuccess" }
              return response;
            }
          }
          else {
            response = { "UserInfo": "", "message": "Invalid device id" }
            return response;
          }
         //response = { "Device ID ": req.device_id, "message": "success" }
         return response
            
      }
    } catch (error) {
      await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Login", error, "login");
      if (client) { client.end(); }
      throw new Error(error);
    }
    finally {
      if (client) { client.end(); }// always close the resource
  }
  }