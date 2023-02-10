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
const fs = require('fs');
const moment = require('moment');
//Connect Postgres
const { Client } = require('pg');

//Create radiology jwt  
module.exports.createRadiologyJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "createRadiologyJwt");
    throw new Error(error);
  }
}

//Create radiology Module
module.exports.createRadiology = async (req) => {
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
      const { radiology_test_id, employee_id, appointment_id, patient_id, module_id, radiology_rate, paymentstatus_id, active_status, user_id, radiology_Array } = decoded.data;
      var createupdate_date = new Date().setHours(0, 0, 0, 0);
      var create_date = new Date().getTime();
      if (decoded) {
        var message = {}
        var getAccountId = await commonService.getAccountId(module_id);
        var account_id = getAccountId.account_id;
        var account_status = getAccountId.status
        var account_message = getAccountId.message
        var voucherid = await commonService.getVoucherId(module_id);
        var voucher_id = voucherid.voucher_id;
        var voucher_status = voucherid.status;
        var voucher_message = voucherid.message;
        var financial_year_id = voucherid.financial_year_id
        const maxtransaction = await client.query(`select coalesce(max(transaction_id),0) + 1 as transaction FROM tbl_transaction`)
        var maxtransaction_id = maxtransaction && maxtransaction.rows[0].transaction;
        if (account_status == true) {
          if (voucher_status == true) {
            if (radiology_test_id == 0) {
              var makerid = await commonService.insertLogs(user_id, "Insert Radiology Lab");
              const max = await client.query(`select coalesce(max(radiology_test_id),0) + 1 as mr FROM tbl_patient_radiology`)
              var maxradiology_id = max && max.rows[0].mr;
              const create_result = await client.query(`INSERT INTO "tbl_patient_radiology"("radiology_test_id","employee_id","patient_id","appointment_id","radiology_rate","paymentstatus_id","active_status","maker_id","user_id","created_date","module_id") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) `, [maxradiology_id, employee_id, patient_id, appointment_id, radiology_rate, paymentstatus_id, active_status, makerid, user_id, createupdate_date, module_id]);
              if (radiology_Array && radiology_Array.length > 0) {
                for (let i = 0; i < radiology_Array.length; i++) {
                  const radiology_max = await client.query(`select coalesce (max(patient_radiology_id),0) + 1 as mr FROM tbl_patient_radiology_details`)
                  var maxradiology_Test_id = radiology_max && radiology_max.rows[0].mr;
                  const radiology_result = await client.query(`INSERT INTO "tbl_patient_radiology_details"("patient_radiology_id","employee_id","patient_id","radiology_id","radiology_part_id","rate","radiology_test_id") values ($1, $2, $3, $4, $5,$6,$7) `, [maxradiology_Test_id, employee_id, patient_id, radiology_Array[i].radiology_id, radiology_Array[i].radiology_part_id, radiology_Array[i].rate, maxradiology_id]);
                  let radiology_code = radiology_result && radiology_result.rowCount ? radiology_result.rowCount : 0;
                  console.log(radiology_code)
                }
              }
              await client.query(`INSERT INTO "tbl_transaction"("transaction_id","employee_id","patient_id","module_id","paymentstatus_id","total_amount","active_status","maker_id","user_id","created_date",ref_no,created_time,"account_id","voucher_no","financial_year_id","updated_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`, [maxtransaction_id, employee_id, patient_id, module_id, paymentstatus_id, radiology_rate, 1, makerid, user_id, createupdate_date, maxradiology_id, create_date, account_id, voucher_id, financial_year_id,createupdate_date]);

              if (client) {
                client.end();
              }
              let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
              if (create_usercode == 1) {
                // this.getPrintDetails(patient_id, module_id, maxradiology_id, radiology_rate, voucher_id)
                message = { "message": constants.userMessage.USER_CREATED, "status": true,"voucher_no":voucher_id }
                return message
              }
              else { return '' }
            }
            else {
              var makerid = await commonService.insertLogs(user_id, "Update Transaction");
              const radiology_Count = await client.query(`select count(*) as count FROM tbl_patient_radiology where radiology_test_id =` + radiology_test_id)
              var count_Check = radiology_Count && radiology_Count.rows[0].count
              if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {

                const update_result = await client.query(`UPDATE "tbl_patient_radiology" set "employee_id"= $1,"patient_id"=$2,"appointment_id"=$3,"paymentstatus_id"= $4,"radiology_rate"=$5,"active_status"=$6,"maker_id"=$7,"user_id"=$8,"updated_date"=$9,"module_id"=$10 where "radiology_test_id" = $11 `, [employee_id, patient_id, appointment_id, paymentstatus_id, radiology_rate, active_status, makerid, user_id, createupdate_date, module_id, radiology_test_id]);
                if (radiology_Array && radiology_Array.length > 0) {
                  await client.query(`DELETE FROM tbl_patient_radiology_details where radiology_test_id=$1`,
                    [radiology_test_id])
                  for (let i = 0; i < radiology_Array.length; i++) {
                    const radiology_max = await client.query(`select coalesce (max(patient_radiology_id),0) + 1 as mr FROM tbl_patient_radiology_details`)
                    var maxradiology_Test_id = radiology_max && radiology_max.rows[0].mr;
                    const radiology_result = await client.query(`INSERT INTO "tbl_patient_radiology_details"("patient_radiology_id","employee_id","patient_id","radiology_id","radiology_part_id","rate","radiology_test_id") values ($1, $2, $3, $4, $5,$6,$7) `, [maxradiology_Test_id, employee_id, patient_id, radiology_Array[i].radiology_id, radiology_Array[i].radiology_part_id, radiology_Array[i].rate, radiology_test_id]);
                    let radiology_code = radiology_result && radiology_result.rowCount ? radiology_result.rowCount : 0;
                    console.log(radiology_code)
                  }
                }

                await client.query(`UPDATE "tbl_transaction" set "updated_date"=$5,"paymentstatus_id"=$1,"total_amount"=$2 where "ref_no" = $3 and module_id=$4`, [paymentstatus_id, radiology_rate, radiology_test_id,module_id,createupdate_date]);
                if (client) {
                  client.end();
                }
                let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                if (update_code == 1) {
                  // this.getPrintDetails(patient_id, module_id, radiology_test_id, radiology_rate, voucher_id)
                  message = { "message": constants.userMessage.USER_UPDATED, "status": true,"voucher_no":voucher_id }
                  return message
                }
                else { return '' }
              }
            }
          }
          else {
            return message = { "message": voucher_message, "status": voucher_status }
          }
        }
        else {
          return message = { "message": account_message, "status": account_status }
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "createRadiology");
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }// always close the resource
  }
}

//Edit Load radiology jwt 
module.exports.editloadRadiologyJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "editloadRadiologyJwt");
    throw new Error(error);
  }
}
//Edit Load radiology service
module.exports.editloadRadiology = async (req) => {
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
      const { radiology_test_id } = decoded.data;
      var response_Array = {}
      if (decoded) {
        const editload_radiology = await client.query(`select a.radiology_test_id,a.employee_id,a.patient_id,a.appointment_id,a.module_id,
        a.radiology_rate,b.radiology_id,b.radiology_part_id,b.rate,b.patient_radiology_id,c.radiology_name,
        c.dependency,d.radiology_part_name,e.voucher_no from tbl_patient_radiology as a inner join tbl_patient_radiology_details as
        b on a.radiology_test_id = b.radiology_test_id inner join tbl_def_radiology_type as c on b.radiology_id = 
        c.radiology_id inner join tbl_def_radiology_parts as d on b.radiology_part_id = d.radiology_part_id inner join
        tbl_transaction as e on a.radiology_test_id = e.ref_no
        and a.module_id =e.module_id
        where a.radiology_test_id= $1`, [radiology_test_id])
        var editload_RadiologyArray = editload_radiology && editload_radiology.rows ? editload_radiology.rows : [];
        response_Array = {
          "radiologyArray": editload_RadiologyArray
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "editloadRadiology");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

//Get Radiology PaymentStatus jwt 
module.exports.getRadiologyPaymentStatusJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "getRadiologyPaymentStatusJwt");
    throw new Error(error);
  }
}
//Get Radiology PaymentStatus 
module.exports.getRadiologyPaymentStatus = async (req) => {
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
      const { appointment_id } = decoded.data;
      if (decoded) {
        var response_Array = {}
        const get_Status = await client.query(`select a.paymentstatus_id,b.paymentstatus_name,a.radiology_test_id,a.module_id FROM tbl_patient_radiology as a inner join tbl_def_payment_status as b on a.paymentstatus_id = b.paymentstatus_id where a.appointment_id = $1 `, [appointment_id]);
        if (client) {
          client.end();
        }
        let get_Statusarray = get_Status && get_Status.rows ? get_Status.rows : [];
        response_Array = { "paymentStatus": get_Statusarray }
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "getRadiologyPaymentStatus");
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }// always close the resource
  }
}

//Load radiology Details jwt 
module.exports.loadRadiologyDetailsJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "loadRadiologyDetailsJwt");
    throw new Error(error);
  }
}
//Load radiology Details service data
module.exports.loadRadiologyDetails = async (req) => {
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
      const { radiology_test_id } = decoded.data;
      var response_Array = {}
      if (decoded) {
        const load_radiologyDeatils = await client.query(`select a.radiology_test_id,a.employee_id,a.patient_id,a.appointment_id,a.module_id,a.radiology_rate,b.radiology_id,b.radiology_part_id,b.rate,b.patient_radiology_id,c.radiology_name,c.dependency,d.radiology_part_name from tbl_patient_radiology as a inner join tbl_patient_radiology_details as b on a.radiology_test_id = b.radiology_test_id inner join tbl_def_radiology_type as c on b.radiology_id = c.radiology_id inner join tbl_def_radiology_parts as d on b.radiology_part_id = d.radiology_part_id  where a.radiology_test_id = $1`, [radiology_test_id])
        var load_RadiologyArray = load_radiologyDeatils && load_radiologyDeatils.rows ? load_radiologyDeatils.rows : [];
        response_Array = {
          "radiologyArray": load_RadiologyArray
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "loadRadiologyDetails");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Get Print Details Module
module.exports.getPrintDetails = async (patient_id, module_id, radiology_test_id, radiology_rate, voucher_id) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    // print Details
    const get_Print = await client.query(`select print_folder_name from tbl_print_setting `);
    const get_Account = await client.query(`select a.account_id,a.module_id,b.account_id,b.city_id,b.state_id,b.company_code,b.company_name,b.email_id,b.area_name,b.street_name,b.mobile_number,b.pincode,b.website,c.city_name,d.state_name from tbl_account_module as a inner join tbl_account_master as b on a.account_id = b.account_id inner join  tbl_def_city as c  on b.city_id=c.city_id inner join tbl_def_state as d on d.state_id=b.state_id where a.module_id = $1 ORDER BY a.module_id DESC limit 1`, [module_id]);

    const get_Patient = await client.query(`select a.patient_id,a.patient_name,a.guardian_name,a.gender_id,a.date_of_birth,a.blood_group_id,a.age_day,a.age_month,a.age_year,a.dob_type,a.city_id,a.mobile_number,a.uhid,b.gender_name,c.blood_group_name,e.city_name from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_blood_group as c on a.blood_group_id=c.blood_group_id inner join tbl_def_city as e on a.city_id = e.city_id where patient_id = $1`, [patient_id]);

    const getradiology_test = await client.query(`select a.radiology_test_id,b.radiology_id,b.radiology_part_id,b.rate,b.patient_radiology_id,c.radiology_name,c.dependency,d.radiology_part_name from tbl_patient_radiology as a inner join tbl_patient_radiology_details as b on a.radiology_test_id = b.radiology_test_id inner join tbl_def_radiology_type as c on b.radiology_id = c.radiology_id inner join tbl_def_radiology_parts as d on b.radiology_part_id = d.radiology_part_id  where a.radiology_test_id = $1 `, [radiology_test_id]);

    let get_PrintArray = get_Print && get_Print.rows ? get_Print.rows : [];
    let get_radiologyArray = getradiology_test && getradiology_test.rows ? getradiology_test.rows : [];

    let get_Accountarray = get_Account && get_Account.rows ? get_Account.rows : [];
    let getPatientArray = get_Patient && get_Patient.rows ? get_Patient.rows : [];
    response_array = {
      "getAccountarray": get_Accountarray, "getPatientArray": getPatientArray, "getradiologyArray": get_radiologyArray
    }
    var age = await commonService.agecalucation(getPatientArray[0]['age_day'], getPatientArray[0]['age_month'], getPatientArray[0]['age_year'], getPatientArray[0]['dob_type'], getPatientArray[0]['date_of_birth']);
    // return response_array
    var radiologytest_rate = 0, total_rate = radiology_rate.toFixed(2);
    radiologytest_rate = get_radiologyArray[0]['rate'].toFixed(2)
    var directory = get_PrintArray[0]['print_folder_name'];
    var foldername = 'labtestreport';
    var filepath = '';
    if (fs.existsSync(directory)) {
      // fs.mkdirSync(directory + foldername);
      filepath = directory + '/print.txt';
    }
    if (filepath) {
      var logger = fs.createWriteStream(filepath, {
      })
      var date = moment(new Date()).format('DD/MM/YYYY');
      var time = moment(new Date()).format('h:mm:ss a');
      var address = "";
      if (get_Accountarray[0]['street_name'] && get_Accountarray[0]['street_name'] != "") {
        address = get_Accountarray[0]['street_name']
      }
      if (get_Accountarray[0]['area_name'] && get_Accountarray[0]['area_name'] != "") {
        address = get_Accountarray[0]['area_name']
      }
      if (get_Accountarray[0]['street_name'] && get_Accountarray[0]['street_name'] != "" && get_Accountarray[0]['area_name'] && get_Accountarray[0]['area_name'] != "") {
        address = get_Accountarray[0]['street_name'] + "," + get_Accountarray[0]['area_name']
      }
      logger.write(formattextCenter(get_Accountarray[0]['company_name'], 45, "center") + "\r\n") // append string to your file
      logger.write(formattextCenter(address, 45, "center") + "\r\n")
      logger.write(formattextCenter(get_Accountarray[0]['city_name'], 45, "center") + "\r\n")

      logger.write(formattextCenter('Phone No.:' + get_Accountarray[0]['mobile_number'], 45, "center") + "\r\n")
      logger.write('----------------------------------------------' + "\r\n")
      logger.write(formattextLeftRight(getPatientArray[0]['patient_name'], 'Bill No.:' + voucher_id, 45) + "\r\n")
      logger.write(formattextLeftRight("#" + getPatientArray[0]['uhid'], 'Date:' + date, 45) + "\r\n")
      logger.write(formattextLeftRight(age + ',' + getPatientArray[0]['gender_name'], 'Time:' + time, 45) + "\r\n")
      logger.write(getPatientArray[0]['mobile_number'] + "\r\n")
      logger.write(getPatientArray[0]['city_name'] + "\r\n")
      logger.write('----------------------------------------------' + "\r\n")
      logger.write(formattextLeftRight(get_radiologyArray[0].radiology_name, 'Rs.' + radiologytest_rate.toString(), 45) + "\r\n")
      logger.write('----------------------------------------------' + "\r\n")
      logger.write(formattextLeftRight('Total ', 'Rs.' + (total_rate).toString(), 45) + "\r\n")
      logger.write('----------------------------------------------' + "\r\n")
      logger.write(formattextCenter('Greatest wealth is Health !!...', 45, "center") + "\r\n")
      logger.end();
    }

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Radiology", error, "getPrintDetails");
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
function formattextCenter(textval, length, align) {
  try {
    var remaining_Emptyspace = length - textval.length;
    var equal_Spaces = 0, spaces = "", r = "", i = 0;
    if (align == "center") {
      equal_Spaces = remaining_Emptyspace / 2;
      while (equal_Spaces > i) {
        spaces = spaces + " ";
        i++;
      }
      r = spaces + textval + spaces;
      return r.substring(0, 51);
    }
  } catch (err) {
    console.log(err, 'error');
  }

}
function formattextLeftRight(textval, textval2, length) {
  try {
    var remaining_Emptyspace = length - textval.length;
    var equal_Spaces = 0, spaces = "", i = 0, r = "";
    if (remaining_Emptyspace > (textval2.length + 2)) {
      equal_Spaces = remaining_Emptyspace - textval2.length;
      while (equal_Spaces > i) {
        spaces = spaces + " ";
        i++;
      }
      r = textval + spaces + textval2;
      return r;
    }
    else {
      textval2 = textval2.substring(0, remaining_Emptyspace);
      r = textval + "  " + textval2;
      return r;
    }
  } catch (err) {
    console.log(err, 'error');
  }
}
