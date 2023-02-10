const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService')
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

//list CashModule jwt 
module.exports.listCashModuleJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
      await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Cashier", error, "listCashModuleJwt");
        throw new Error(error);
    }
}
//list CashModule List
module.exports.listCashModule = async (req) => {
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
        const { created_date, end_date, module_id } = decoded.data;
        if (decoded) {
             var taken_module_id= (module_id == -1) ? '1=1' : 'd.module_id='+module_id;
          const list_cash = await client.query(`select a.transaction_id,a.employee_id,a.patient_id,a.module_id,a.total_amount,a.paymentstatus_id,a.ref_no,a.voucher_no,a.account_id,a.created_time,a.updated_date as created_date,b.patient_name,b.uhid,b.mobile_number,c.company_name,c.company_code,d.module_name,e.paymentstatus_name,g.narration,h.city_name,b.date_of_birth,b.drug_allergy,j.blood_group_name, b.age_day,b.age_month,b.age_year,b.dob_type,i.gender_name from tbl_transaction as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_account_master as c on a.account_id = c.account_id inner join tbl_def_modules as d on a.module_id = d.module_id inner join tbl_def_payment_status as e on a.paymentstatus_id = e.paymentstatus_id  left outer join tbl_cash_transaction as g on a.transaction_id = g. transaction_id inner join tbl_def_city as  h on b.city_id = h.city_id inner join tbl_def_gender as i on b.gender_id = i.gender_id inner join tbl_def_blood_group as j on j.blood_group_id =b.blood_group_id where 
          a.total_amount > 0 and a.active_status = 1 and a.updated_date BETWEEN 
          `+created_date+` and `+end_date+ ` and ` +taken_module_id);
          const medical_condition = await client.query(`select a.patient_id,string_agg(distinct  c.clinical_history_details, ',') as medical_condition from tbl_patient as a inner join tblmedicine_clinicalhistory as b on a.patient_id = b.patient_id inner join tbl_def_clinical_history as c on b.clinical_history_id = c.clinical_history_id group by a.patient_id`);
          if (client) {
            client.end();
          }
          let list_casharray = list_cash && list_cash.rows ? list_cash.rows : [];
          let medical_conditions = medical_condition && medical_condition.rows ? medical_condition.rows : [];
          response_Array = {
            "list_casharray": list_casharray,"medical_conditions":medical_conditions,
        }
          if (response_Array) {
            return response_Array;
          }
          else {
            return '';
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
      await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Cashier", error, "listCashModule");
      if (client) { client.end(); }
      throw new Error(error);
    }
  finally {
    if (client) { client.end(); }// always close the resource
}
}