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


//create Test Group jwt 
module.exports.createLabtestgroupJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "createLabtestgroupJwt");
    throw new Error(error);
  }
}
//create Test Group service
module.exports.createLabtestgroup = async (req) => {
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
      const { group_id, group_name, rate, active_status, user_id, grouptest_Array } = decoded.data;
      var createupdate_date = new Date().setHours(0, 0, 0, 0);
      if (decoded) {
        if (group_id == 0) {
          var makerid = await commonService.insertLogs(user_id, "Insert TestGroup");
          const max = await client.query(`select coalesce(max(group_id),0) + 1 as mr FROM tbl_lab_test_group_master`)
          var maxgroup_id = max && max.rows[0].mr;
          const create_result = await client.query(`INSERT INTO "tbl_lab_test_group_master"("group_id","group_name","rate","active_status","maker_id","user_id","created_date") values ($1,Upper($2), $3,$4,$5,$6,$7) `, [maxgroup_id, group_name, rate, active_status, makerid, user_id, createupdate_date]);
          if (grouptest_Array && grouptest_Array.length > 0) {
            for (let i = 0; i < grouptest_Array.length; i++) {
              const group_test_max = await client.query(`select coalesce (max(group_test_id),0) + 1 as mr FROM tbl_lab_group_test`)
              var maxgroup_test_id = group_test_max && group_test_max.rows[0].mr;
              const grouptestresult = await client.query(`INSERT INTO "tbl_lab_group_test"("group_test_id","group_id","test_id") values ($1, $2, $3) `, [maxgroup_test_id, maxgroup_id, grouptest_Array[i].test_id]);
              let grouptest_code = grouptestresult && grouptestresult.rowCount ? grouptestresult.rowCount : 0;
              console.log(grouptest_code)
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
          var makerid = await commonService.insertLogs(user_id, "Update TestGroup");
          const group_Count = await client.query(`select count(*) as count FROM tbl_lab_test_group_master where group_id =` + group_id)
          var count_Check = group_Count && group_Count.rows[0].count
          if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
            const update_result = await client.query(`UPDATE "tbl_lab_test_group_master" set "group_name"= Upper($1), "rate"=$2,"active_status"=$3,"maker_id"=$4,"user_id"=$5,"updated_date"=$6 where "group_id" = $7 `, [group_name, rate, active_status, makerid, user_id, createupdate_date, group_id]);
            if (grouptest_Array && grouptest_Array.length > 0) {
              await client.query(`DELETE FROM tbl_lab_group_test where group_id=$1`, [group_id])
              for (let i = 0; i < grouptest_Array.length; i++) {
                const group_test_max = await client.query(`select coalesce (max(group_test_id),0) + 1 as mr FROM tbl_lab_group_test`)
                var maxgroup_test_id = group_test_max && group_test_max.rows[0].mr;
                const grouptestresult = await client.query(`INSERT INTO "tbl_lab_group_test"("group_test_id","group_id","test_id") values ($1, $2, $3) `, [maxgroup_test_id, group_id, grouptest_Array[i].test_id]);
                let grouptest_code = grouptestresult && grouptestresult.rowCount ? grouptestresult.rowCount : 0;
                console.log(grouptest_code, "grouptest_code")
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "createLabtestgroup");
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Delete Test Group jwt 
module.exports.deleteLabtestgroupJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "deleteLabtestgroupJwt");
    throw new Error(error);
  }
}
//Delete Test Group service
module.exports.deleteLabtestgroup = async (req) => {
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
      const { group_id, user_id } = decoded.data;
      if (decoded) {
        await commonService.insertLogs(user_id, "Delete Test Group");
        const group_Count = await client.query(`select count(*) as count FROM tbl_lab_test_group_master where group_id =` + group_id)
        var count_Check = group_Count && group_Count.rows[0].count;
        if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
          await client.query(`DELETE FROM tbl_lab_group_test where group_id=$1`,
            [group_id])
          const create_result = await client.query(`DELETE FROM tbl_lab_test_group_master where group_id = $1 `,
            [group_id]);
          if (client) {
            client.end();
          }
          let usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
          if (usercode == 1) {
            return constants.userMessage.USER_DELETED;
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "deleteLabtestgroup");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//List Test Group jwt 
module.exports.listLabtestgroupJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "listLabtestgroupJwt");
    throw new Error(error);
  }
}
//List Test Group List
module.exports.listLabtestgroup = async (req) => {
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
        const list_group = await client.query(`select a.group_id,a.group_name,a.rate,a.active_status,b.status_name,
        (SELECT COUNT(test_id) as test_count from tbl_lab_group_test where group_id=a.group_id)
         from tbl_lab_test_group_master as a inner join tbl_def_status as b on a.active_status = b.status_id ORDER BY a.group_id DESC`);
        if (client) {
          client.end();
        }
        let list_grouparray = list_group && list_group.rows ? list_group.rows : [];
        if (list_grouparray) {
          return list_grouparray;
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "listLabtestgroup");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Edit Test Group jwt 
module.exports.editloadLabtestgroupJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "editloadLabtestgroupJwt");
    throw new Error(error);
  }
}

//Edit Test Group List
module.exports.editloadLabtestgroup = async (req) => {
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
      const { group_id } = decoded.data;
      var response = {}
      if (decoded) {
        const edit_group = await client.query(`select group_id,group_name,rate,active_status from tbl_lab_test_group_master where group_id = $1 `, [group_id]);
        const testGroup_test = await client.query(`select a.group_test_id,a.group_id,a.test_id,b.group_name,b.rate as group_rate,c.test_name,c.rate as test_rate from tbl_lab_group_test as a inner join tbl_lab_test_group_master as b on a.group_id = b.group_id inner join tbl_lab_test_master as c on a.test_id = c.test_id where a.group_id = $1 `, [group_id]);
        if (client) {
          client.end();
        }
        let edit_grouparray = edit_group && edit_group.rows ? edit_group.rows : [];
        let grouptest_array = testGroup_test && testGroup_test.rows ? testGroup_test.rows : [];
        response = { "groupArray": edit_grouparray, "testGroupArray": grouptest_array };
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "editloadLabtestgroup");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

//Get Test by Group Jwt
module.exports.getTestbygroupJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "getTestbygroupJwt");
    throw new Error(error);
  }
}

//Get Test by Group 
module.exports.getTestbygroup = async (req) => {
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
      const { group_id } = decoded.data;
      var response = {}
      if (decoded) {
        const testGroup_test = await client.query(`select a.group_id,a.test_id,b.group_name,b.rate as group_rate,c.test_name,c.rate as test_rate from tbl_lab_group_test as a inner join tbl_lab_test_group_master as b on a.group_id = b.group_id inner join tbl_lab_test_master as c on a.test_id = c.test_id where a.group_id = $1 `, [group_id]);
        if (client) {
          client.end();
        }
        let grouptest_array = testGroup_test && testGroup_test.rows ? testGroup_test.rows : [];
        response = { "testGroupArray": grouptest_array };
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "getTestbygroup");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Test GroupName Checking jwt 
module.exports.TestgroupnameJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "TestgroupnameJwt");
    throw new Error(error);
  }
}
//Test GroupName Checking List
module.exports.Testgroupname = async (req) => {
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
        const { group_name,group_id  } = decoded.data;
        console.log(decoded.data)
        if (decoded) {
          var groupname = `TRIM(lower("group_name")) = TRIM(lower ( ` + "'" + group_name + "'))"
        
            const search_User_testgroup = await client.query(`select count(*) as count from tbl_lab_test_group_master where `+ groupname  + `  and group_id != `  + group_id);
            console.log(search_User_testgroup)
            var user_Check = search_User_testgroup && search_User_testgroup.rows[0].count
            console.log(search_User_testgroup.rows[0])
            if (client) {
              client.end();
          }
            if (Number(user_Check) > 0) {
                return response = { "message": constants.userMessage.DUPLICATE_TESTGROUPNAME, "status": false }
            }
            
            return response = { "message": constants.userMessage.UNIQUE_TESTGROUPNAME, "status": true }
        }
        else {
            if (client) { client.end(); }
        }
    } else {
        if (client) { client.end(); }
        throw new Error(constants.userMessage.TOKEN_MISSING);
    }
}  catch (error) {
  await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"LabTestGroup", error, "Testgroupname");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}