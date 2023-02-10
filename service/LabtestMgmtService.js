const commonService = require('./commonService')
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


//create Test jwt 
module.exports.createLabtestJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "createLabtestJwt");
    throw new Error(error);
  }
}
//create Test service
module.exports.createLabtest = async (req) => {
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
      const { test_id, test_name, rate, unit_name, active_status, user_id, test_Condition } = decoded.data;
      var createupdate_date = new Date().setHours(0, 0, 0, 0);
      if (decoded) {
        if (test_id == 0) {
          var makerid = await commonService.insertLogs(user_id, "Insert Test");
          const max = await client.query(`select coalesce(max(test_id),0) + 1 as mr FROM tbl_lab_test_master`)
          var maxtest_id = max && max.rows[0].mr;
          const create_result = await client.query(`INSERT INTO "tbl_lab_test_master"("test_id","test_name","rate","unit_name","active_status","maker_id","user_id","created_date") values ($1,Upper($2),$3,$4,$5,$6,$7,$8) `, [maxtest_id, test_name, rate, unit_name, active_status, makerid, user_id, createupdate_date]);

          if (test_Condition && test_Condition.length > 0) {
            for (let i = 0; i < test_Condition.length; i++) {
              const condition_max = await client.query(`select coalesce (max(lab_condition_id),0) + 1 as mr FROM tbl_lab_test_condition`)
              var maxcondition_id = condition_max && condition_max.rows[0].mr;
              const Conditionresult = await client.query(`INSERT INTO "tbl_lab_test_condition"("lab_condition_id","test_id","gender_id","age_from","age_to","age_from_type","age_to_type","condition_id","referencevalue_from","referencevalue_to") values ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10) `, [maxcondition_id, maxtest_id, test_Condition[i].gender_id, test_Condition[i].age_from, test_Condition[i].age_to, test_Condition[i].age_from_type, test_Condition[i].age_to_type, test_Condition[i].condition_id, test_Condition[i].referencevalue_from, test_Condition[i].referencevalue_to]);
              let Condition_code = Conditionresult && Conditionresult.rowCount ? Conditionresult.rowCount : 0;
            }
          }
          if (client) {
            client.end();
          }
          let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
          if (create_usercode == 1) {
            return constants.userMessage.USER_CREATED
          }
          else { return '' }
        }
        else {
          var makerid = await commonService.insertLogs(user_id, "Update Test");
          const test_Count = await client.query(`select count(*) as count FROM tbl_lab_test_master where test_id =` + test_id)
          var count_Check = test_Count && test_Count.rows[0].count
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            const update_result = await client.query(`UPDATE "tbl_lab_test_master" set "test_name"= Upper($1), "rate"=$2,"unit_name"=$3,"active_status"=$4,"maker_id"=$5,"user_id"=$6,"updated_date"=$7 where "test_id" = $8 `, [test_name, rate, unit_name, active_status, makerid, user_id, createupdate_date, test_id]);
            if (test_Condition && test_Condition.length > 0) {
              await client.query(`DELETE FROM tbl_lab_test_condition where test_id=$1`,
                [test_id])
              for (let i = 0; i < test_Condition.length; i++) {
                const condition_max = await client.query(`select coalesce (max(lab_condition_id),0) + 1 as mr FROM tbl_lab_test_condition`)
                var maxcondition_id = condition_max && condition_max.rows[0].mr;
                const Conditionresult = await client.query(`INSERT INTO "tbl_lab_test_condition"("lab_condition_id","test_id","gender_id","age_from","age_to","age_from_type","age_to_type","condition_id","referencevalue_from","referencevalue_to") values ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10) `, [maxcondition_id, test_id, test_Condition[i].gender_id, test_Condition[i].age_from, test_Condition[i].age_to, test_Condition[i].age_from_type, test_Condition[i].age_to_type, test_Condition[i].condition_id, test_Condition[i].referencevalue_from, test_Condition[i].referencevalue_to]);
                let Condition_code = Conditionresult && Conditionresult.rowCount ? Conditionresult.rowCount : 0;
              }
            }
            if (client) {
              client.end();
            }
            let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
            if (update_code == 1) {
              return constants.userMessage.USER_UPDATED
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "createLabtest");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Delete Test jwt 
module.exports.deleteLabtestJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "deleteLabtestJwt");
    throw new Error(error);
  }
}
//Delete Test service
module.exports.deleteLabtest = async (req) => {
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
      const { test_id, user_id } = decoded.data;
      if (decoded) {
        await commonService.insertLogs(user_id, "Delete Test");
        const test_Count = await client.query(`select count(*) as count FROM tbl_lab_test_master where test_id =` + test_id)
        var count_Check = test_Count && test_Count.rows[0].count;
        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
          
          //Check If Test exist in tbl_patient_lab_details (Forgine Key) 
          const test_idcount = await client.query(`select count(*) as test_idcount FROM tbl_lab_group_test where test_id =` + test_id)
          var test_id_Check = test_idcount && test_idcount.rows[0].test_idcount
          if (test_id_Check > 0) {
              return response = { "message": constants.docMang.TEST_EXIST, "status": false }
          }

          await client.query(`DELETE FROM tbl_lab_test_condition where test_id=$1`,
            [test_id])
          const create_result = await client.query(`DELETE FROM tbl_lab_test_master where test_id = $1 `,
            [test_id]);
          if (client) {
            client.end();
          }
          let usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
          if (usercode == 1) {
            return response = { "message": constants.userMessage.USER_DELETED, "status": true };
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "deleteLabtest");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//List Test jwt 
module.exports.listLabtestJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "listLabtestJwt");
    throw new Error(error);
  }
}
//List Test List
module.exports.listLabtest = async (req) => {
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
      if (decoded) {
        const list_test = await client.query(`select a.test_id,a.test_name,a.rate,a.unit_name,a.active_status,d.status_name from tbl_lab_test_master as a inner join 
        tbl_def_status as d on a.active_status = d.status_id ORDER BY a.test_id DESC`);
        if (client) {
          client.end();
        }
        let list_testarray = list_test && list_test.rows ? list_test.rows : [];
        if (list_testarray) {
          return list_testarray;
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "listLabtest");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Edit Test jwt 
module.exports.editloadLabtestJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "editloadLabtestJwt");
    throw new Error(error);
  }
}
//Edit Test List
module.exports.editloadLabtest = async (req) => {
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
      const { test_id } = decoded.data;
      var response = {}
      if (decoded) {
        const edit_test = await client.query(`select a.test_id,a.test_name,a.rate,a.unit_name,a.active_status,d.status_name from tbl_lab_test_master as a inner join 
        tbl_def_status as d on a.active_status = d.status_id where a.test_id = $1 `, [test_id]);

        const condition_test = await client.query(`select a.lab_condition_id,a.test_id,a.gender_id,a.age_from,a.age_to,a.age_from_type,a.age_to_type,a.condition_id,a.referencevalue_from,a.referencevalue_to,b.gender_name,c.age_type_name as age_from_name,d.condition_name,e.age_type_name as age_to_name from tbl_lab_test_condition as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_agetype as c on a.age_from_type = c.age_type_id inner join tbl_def_agetype as e on a.age_to_type = e.age_type_id inner join tbl_def_condition as d on a.condition_id = d.condition_id  where a.test_id = $1 `, [test_id]);
        if (client) {
          client.end();
        }
        let edit_testarray = edit_test && edit_test.rows ? edit_test.rows : [];
        let condition_array = condition_test && condition_test.rows ? condition_test.rows : [];
        response = { "testArray": edit_testarray, "conditionArray": condition_array };
        if (response) {
          return response
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "editloadLabtest");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Test Name Checking jwt 
module.exports.testnameCheckingJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "testnameCheckingJwt");
    throw new Error(error);
  }
}
//Test Name Checking List
module.exports.testnameChecking = async (req) => {
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
        const { test_name,test_id  } = decoded.data;
        if (decoded) {
          var condition = `TRIM(lower("test_name")) = TRIM(lower ( ` + "'" + test_name + "'))"
          
            const search_User_test = await client.query(`select count(*) as count from tbl_lab_test_master where ` + condition 
            +  ` and test_id != `  + test_id);
            
            var user_Check = search_User_test && search_User_test.rows[0].count
            
            if (client) {
              client.end();
          }
            if (Number(user_Check) > 0) {
                return response = { "message": constants.userMessage.DUPLICATE_TESTNAME, "status": false }
            }
            
            return response = { "message": constants.userMessage.UNIQUE_TESTNAME, "status": true }
        }
        else {
            if (client) { client.end(); }
        }
    } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.TOKEN_MISSING);
    }
}  catch (error) { 
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTest", error, "testnameChecking");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}