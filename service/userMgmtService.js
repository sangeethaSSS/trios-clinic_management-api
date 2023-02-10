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


//create User jwt 
module.exports.createUserJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "createUserJwt");
    throw new Error(error);
  }
}
//create User service
module.exports.createUser = async (req) => {
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
      const { employee_id, username, user_code, password, userrole_id, user_id, active_status,pincode,devices_id,access_flag } = decoded.data;
      var createupdate_date = new Date().setHours(0, 0, 0, 0);
      var condition = '';
      const newpwsd_en = await commonService.encryptpassword({ pwd: password });
      const newpincode_en = await commonService.encryptpassword({ pwd: pincode });
      var user_password = newpwsd_en
      var user_pincode = newpincode_en
      if (decoded) {
        if (user_code == 0) {
          if(access_flag == -1){
            condition = (`LOWER ("username") =  LOWER (` + "'" + username + "')" + ` and ("device_id") =  LOWER (` + "'" + devices_id + "')")
          }
          if(access_flag == 1){
            condition = `LOWER ("username") = LOWER (` + "'" + username + "')"
          }

          if(access_flag == 2){
            condition = `LOWER ("device_id") = LOWER (` + "'" + devices_id + "')"
          }
        }
        else {
          if(access_flag == -1){
            condition = (`LOWER ("username") =  LOWER (` + "'" + username + "')" + ` and ("device_id") =  LOWER (` + "'" + devices_id + "')" + `and user_code !=` + user_code)
          }
          if(access_flag == 1){
            condition = `LOWER ("username") = LOWER (` + "'" + username + "')" + `and user_code !=` + user_code
          }

          if(access_flag == 2){
            condition = `LOWER ("device_id") = LOWER (` + "'" + devices_id + "')" + `and user_code !=` + user_code
          }
        }
        if(user_code != 0) {
          var count_user = await client.query(`select password,pincode FROM tbl_user_master where user_code = $1`, [user_code])
          var olduser_password = count_user && count_user.rows[0].password;
          var olduser_pincode = count_user && count_user.rows[0].pincode;
          if(!password) {
            user_password = olduser_password
          }
          if(!pincode) {
            user_pincode = olduser_pincode
          }
        }
       
        var count = await client.query(`select count(*) as count FROM tbl_user_master where ` + condition)
        var usercount_Check = count && count.rows[0].count;
        if (usercount_Check > 0) {
          if(access_flag == 1){
            return response = { "message": constants.userMessage.USER_NAME_CHECK, "status": false };
          }
          if(access_flag == 2){
            return response = { "message": constants.userMessage.DEVICE_NAME_CHECK, "status": false };
          }
          if(access_flag == -1){
            return response = { "message": constants.userMessage.BOTH_NAME_CHECK, "status": false };
          }
        }
        else {
          if (user_code == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert User");
            const max = await client.query(`select coalesce(max(user_code),0) + 1 as mr FROM tbl_user_master`)
            var maxuser = max && max.rows[0].mr;
            const create_result = await client.query(`INSERT INTO "tbl_user_master"("employee_id","user_code","username","password","userrole_id","active_status","maker_id","user_id","created_date","pincode","device_id") values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11) `, [employee_id, maxuser, username, user_password, userrole_id, active_status, makerid, user_id, createupdate_date,user_pincode,devices_id]);
            if (client) {
              client.end();
            }
            let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
            if (create_usercode == 1) {
              return response = { "message": constants.userMessage.USER_CREATED, "status": true };
            }
            else { return '' }
          }
          else {
            var makerid = await commonService.insertLogs(user_id, "Update User");
            const user_Count = await client.query(`select count(*) as count FROM tbl_user_master where user_code =` + user_code)
            var count_Check = user_Count && user_Count.rows[0].count
            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
              const update_result = await client.query(`UPDATE "tbl_user_master" set "username"=$1, "employee_id"=$2,"userrole_id"=$3,"active_status"=$4,"maker_id"=$5,"user_id"=$6,"updated_date"=$7,"device_id"= $8,"password"= $9,"pincode" = $10 where "user_code" = $11 `, [username, employee_id, userrole_id, active_status, makerid, user_id, createupdate_date,devices_id,user_password,user_pincode,user_code]);
              if (client) {
                client.end();
              }
              let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
              if (update_code == 1) {
                return response = { "message": constants.userMessage.USER_UPDATED, "status": true };
              }
              else { return '' }
            }
          }
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "createUser");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Delete User jwt 
module.exports.deleteUserJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "deleteUserJwt");
    throw new Error(error);
  }
}
//Delete User service
module.exports.deleteUser = async (req) => {
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
      const { user_code, user_id } = decoded.data;
      if (decoded) {
        const employee_count = await client.query(`select count(*) from tbl_appointment where employee_id = (select employee_id from tbl_user_master where user_code = $1)` ,[user_code]);
        var employee_Check = employee_count && employee_count.rows[0].count;
        if(employee_Check == 0){
          await commonService.insertLogs(user_id, "Delete User");
          const user_Count = await client.query(`select count(*) as count FROM tbl_user_master where user_code =` + user_code)
          var count_Check = user_Count && user_Count.rows[0].count;
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            const create_result = await client.query(`DELETE FROM tbl_user_master where user_code = $1 `,
              [user_code]);
            if (client) {
              client.end();
            }
            let usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
            if (usercode == 1) {
              return response = { "message": constants.userMessage.USER_DELETED, "status": true }
            }
            else { return '' }
          }
        } else {
          return response = { "message": constants.userMessage.DUPLICATION_USER, "status": false }
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "deleteUser");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//List User jwt 
module.exports.listUserJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "listUserJwt");
    throw new Error(error);
  }
}
//List User List
module.exports.listUser = async (req) => {
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
      const { user_category, active_status } = decoded.data;
            if (decoded) {
                var usercategory = '',status = '';
                if(user_category == -1){
                  usercategory = '1=1'
                } 
                else {
                  usercategory = `a.userrole_id = ` + user_category
                }
                if(active_status == -1){
                    status = '1=1'
                } 
                else {
                    status = `a.active_status = ` + active_status
                }
        const list_User = await client.query(`select a.employee_id,a.username,a.user_code,a.userrole_id,a.user_id,a.active_status,b.employee_name,c.userrole_name,d.status_name,e.employee_category_id from tbl_user_master as a inner join tbl_employee_master as b on a.employee_id = b.employee_id inner join tbl_userrole_master as c on a.userrole_id=c.userrole_id inner join tbl_def_status as d on a.active_status = d.status_id inner join tbl_def_employee_category as e
        on e.employee_category_id = b.employee_category_id where `+ usercategory +`and `+ status +` ORDER BY a.user_id DESC`);
        if (client) {
          client.end();
        }
        let list_Userarray = list_User && list_User.rows ? list_User.rows : [];
        if (list_Userarray) {
          return list_Userarray;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "listUser");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Edit User jwt 
module.exports.editloadUserJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "editloadUserJwt");
    throw new Error(error);
  }
}
//Edit User List
module.exports.editloadUser = async (req) => {
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
      const { user_code } = decoded.data;
      if (decoded) {
        const edit_User = await client.query(`select a.employee_id,a.username,a.user_code,a.userrole_id,a.user_id,a.active_status,b.employee_name,c.userrole_name,d.status_name,a.pincode,a.device_id from tbl_user_master as a inner join tbl_employee_master as b on a.employee_id = b.employee_id inner join tbl_userrole_master as c on a.userrole_id=c.userrole_id inner join tbl_def_status as d on a.active_status = d.status_id where a.user_code = $1 `, [user_code]);
        if (client) {
          client.end();
        }
        let edit_Userarray = edit_User && edit_User.rows ? edit_User.rows : [];
        if (edit_Userarray) {
          return edit_Userarray;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "editloadUser");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Search User jwt 
module.exports.searchUserJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "searchUserJwt");
    throw new Error(error);
  }
}
//Search User List
module.exports.searchUser = async (req) => {
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
      const { search_Value } = decoded.data;
      if (decoded) {
        const search_User = await client.query(`select a.employee_id,a.employee_name,a.employee_category_id,a.gender_id,a.city_id,a.mobile_number,a.qualification,b.gender_name,c.city_name,a.reg_number,d.employee_category_name from tbl_employee_master as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_city as c on a.city_id=c.city_id inner join tbl_def_employee_category as d on a.employee_category_id = d.employee_category_id where a.employee_id NOT IN (select employee_id from tbl_user_master) and (a.employee_id::text like '%'||$1||'%' or Lower(a.employee_name) like '%'||$1||'%' or a.reg_number::text like '%'||$1||'%')`, [search_Value]);
        if (client) {
          client.end();
        }
        let search_Userarray = search_User && search_User.rows ? search_User.rows : [];
        if (search_Userarray) {
          return search_Userarray;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "searchUser");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}


//reset Password Jwt
module.exports.resetPasswordJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "resetPasswordJwt");
    throw new Error(error);
  }
}
//reset Password service
module.exports.resetPassword = async (req) => {
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
      const { new_password, user_code } = decoded.data;
      var createupdate_date = new Date().setHours(0, 0, 0, 0);
      var response = {}
      const newpwsd_en = await commonService.encryptpassword({ pwd: new_password });
      if (decoded) {
        const user_Count = await client.query(`select count(*) as count FROM tbl_user_master where user_code =` + user_code)
        var count_Check = user_Count && user_Count.rows[0].count
        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
          const update_password = await client.query(`UPDATE "tbl_user_master" set "password" = $1,"updated_date"=$2 where "user_code" = $3 `, [newpwsd_en, createupdate_date, user_code]);
          if (client) {
            client.end();
          }
          let update_code = update_password && update_password.rowCount ? update_password.rowCount : 0;
          if (update_code == 1) {
            return response = { "message": constants.userMessage.RESET_PASWD, "status": true };
          }
          else { return '' }
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "resetPassword");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

//reset Pin Jwt
module.exports.resetPinJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "resetPinJwt");
    throw new Error(error);
  }
}
//reset Pin service
module.exports.resetPin = async (req) => {
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
      const { new_password, user_code } = decoded.data;
      var createupdate_date = new Date().setHours(0, 0, 0, 0);
      var response = {}
      const newpwsd_en = await commonService.encryptpassword({ pwd: new_password });
      if (decoded) {
        const user_Count = await client.query(`select count(*) as count FROM tbl_user_master where user_code =` + user_code)
        var count_Check = user_Count && user_Count.rows[0].count
        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
          const update_password = await client.query(`UPDATE "tbl_user_master" set "pincode" = $1,"updated_date"=$2 where "user_code" = $3 `, [newpwsd_en, createupdate_date, user_code]);
          if (client) {
            client.end();
          }
          let update_code = update_password && update_password.rowCount ? update_password.rowCount : 0;
          if (update_code == 1) {
            return response = { "message": constants.userMessage.RESET_PASWD, "status": true };
          }
          else { return '' }
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "resetPin");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

//Old Password check Jwt
module.exports.oldPasswordCheckJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "oldPasswordCheckJwt");
    throw new Error(error);
  }
}
//Old Password check service
module.exports.oldPasswordCheck = async (req) => {
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
      const { old_password, user_code } = decoded.data;
      var response = {}
      const oldpwsd_en = await commonService.encryptpassword({ pwd: old_password });
      if (decoded) {
        const user_Count = await client.query(`select count(*) as count FROM tbl_user_master where user_code =` + user_code)
        var count_Check = user_Count && user_Count.rows[0].count
        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
          const check_password = await client.query(`select password FROM tbl_user_master where user_code =` + user_code);
          
          if (client) {
            client.end();
          }

          var count_Check = check_password && check_password.rows
          let Check_code = check_password && check_password['rows'][0] ? check_password['rows'][0] : '';
          if (count_Check.length > 0) {
            if(Check_code['password'] == oldpwsd_en)
              return response = { "status": true };
            else
              return response = { "message": constants.userMessage.OLD_PASWD_CHECK, "status": false };
          }
          else { return '' }
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"User_Master", error, "oldPasswordCheck");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}