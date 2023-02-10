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


//login service
module.exports.schedule = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
        var val;
        var response = {}
        var response_Data = {}
        //const current_date = "06-12-2022";
        const current_date = req.current_date;
        // const count_check = await client.query(`select a.employee_id,a.username,a.password,a.userrole_id,a.active_status,a.user_id  from tbl_user_master as a inner join tbl_employee_master as b on a.employee_id = b.employee_id  where a.username = $1 and a.password = $2`, [username, newpwsd_en])

       // const count_check = await client.query('SELECT * FROM  tbl_user_master WHERE user_code = $1 AND pincode =$2 LIMIT 1', [user_code,newpincode_en])
    
       const schedule_Details = await client.query("SELECT a.*,(SELECT COUNT(b.schedule_id) as count FROM tbl_appointment_booking AS b WHERE b.schedule_id = a.schedule_id AND to_date(to_char(b.booking_date,'YYYY-MM-DD'),'YYYY-MM-DD') =  to_date( $1,'DD-MM-YYYY')) FROM (SELECT * FROM tbl_def_schedule) as a", [current_date])
       
       if(client){
          client.end();
         }
        if (schedule_Details && schedule_Details.rows.length > 0) {
            let schedule_array = schedule_Details && schedule_Details.rows ? schedule_Details.rows : [];

            response_Data = {
                "Schedule_Array": schedule_array
            }
            if (response_Data) {
                return response_Data;
            }
        }
        else {
    
          return response_Data;
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
