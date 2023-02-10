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

//create setting jwt 
module.exports.createSettingJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"ControlPanel-Setting", error, "createSettingJwt");
    throw new Error(error);
  }
}
//create setting service
module.exports.createSetting = async (req) => {
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
      const { setting_id, fees_type_id, fees_collector_id, fees_collection_id, user_id } = decoded.data;
      var createupdate_date = new Date().setHours(0, 0, 0, 0);
      var response = {}
      if (decoded) {
        if (setting_id == 0) {
          var makerid = await commonService.insertLogs(user_id, "Insert Setting");
          const max = await client.query(`select coalesce(max(setting_id),0) + 1 as mr FROM tbl_control_panel_setting`)
          var maxsetting = max && max.rows[0].mr;
          const create_result = await client.query(`INSERT INTO "tbl_control_panel_setting"("setting_id","fees_type_id","fees_collector_id","fees_collection_id","user_id","maker_id","created_date") values ($1, $2, $3,$4,$5,$6,$7) `, [maxsetting, fees_type_id, fees_collector_id, fees_collection_id, user_id, makerid, createupdate_date]);
          if (client) {
            client.end();
          }
          let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
          if (create_usercode == 1) {
            return response = { "message": constants.userMessage.USER_CREATED, "setting_id": maxsetting }
          }
          else { return '' }
        }
        else {
          var makerid = await commonService.insertLogs(user_id, "Update Setting");
          const setting_Count = await client.query(`select count(*) as count FROM tbl_control_panel_setting where setting_id =` + setting_id)
          var count_Check = setting_Count && setting_Count.rows[0].count
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            const update_result = await client.query(`UPDATE "tbl_control_panel_setting" set "fees_type_id"=$1, "fees_collector_id"=$2,"fees_collection_id"=$3,"maker_id"=$4,"user_id"=$5,"updated_date"=$6 where "setting_id" = $7 `, [fees_type_id, fees_collector_id, fees_collection_id, makerid, user_id, createupdate_date, setting_id]);
            if (client) {
              client.end();
            }
            let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
            if (update_code == 1) {
              return response = { "message": constants.userMessage.USER_UPDATED, "setting_id": setting_id }
            }
            else { return '' }
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"ControlPanel-Setting", error, "createSetting");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Editload setting jwt 
module.exports.editloadSettingJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"ControlPanel-Setting", error, "editloadSettingJwt");
    throw new Error(error);
  }
}
//Editload setting service
module.exports.editloadSetting = async (req) => {
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
      var response_Array = {}
      if (decoded) {
        const editload_Setting = await client.query(`select a.setting_id,a.fees_type_id,a.fees_collector_id,a.fees_collection_id,b.fees_type_name,c.fees_collector_name,d.fees_collection_name from tbl_control_panel_setting as a inner join tbl_def_fees_type as b on a.fees_type_id = b.fees_type_id inner join tbl_def_fees_collector as c on a.fees_collector_id = c.fees_collector_id inner join tbl_def_fees_collection as d on a.fees_collection_id=d.fees_collection_id `)
        var list_settingarray = editload_Setting && editload_Setting.rows ? editload_Setting.rows : [];
        response_Array = {
          "SettingArray": list_settingarray
        }
        if (response_Array) {
          return response_Array;
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"ControlPanel-Setting", error, "editloadSetting");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}