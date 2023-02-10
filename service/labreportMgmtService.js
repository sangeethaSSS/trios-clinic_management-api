const commonService = require('./commonService');
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

//List Lab Report jwt 
module.exports.listLabReportJwt = async (req) => {

  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "LabReport", error, "listLabReportJwt");
    throw new Error(error);
  }
}
//List Lab Report
module.exports.listLabReport = async (req) => {
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
      const { created_date, end_date } = decoded.data;

      if (decoded) {
        const list_labreport = await client.query(`select a.transaction_id,a.ref_no,b.employee_id,b.patient_id,d.employee_name,a.created_time as created_date,c.dob_type,g.gender_name,c.gender_id,c.age_year,c.age_month,c.age_day
          ,coalesce((report_id),0) as report_id
                    ,c.patient_name,e.city_name,a.cash_rate,c.date_of_birth,c.uhid from tbl_cash_transaction as a inner join tbl_transaction as b 
                    on a.transaction_id=b.transaction_id inner join tbl_patient as c on c.patient_id=b.patient_id 
                    inner join tbl_employee_master as d on d.employee_id=b.employee_id
                    inner join tbl_def_city as e on e.city_id = c.city_id inner join tbl_def_gender as g on g.gender_id=c.gender_id
                left outer join tbl_lab_report as f on
                f.transaction_id=a.transaction_id where a.module_id=4 AND a.created_date BETWEEN 
          `+ created_date + ` and ` + end_date);
        if (client) {
          client.end();
        }
        let list_labreportarray = list_labreport && list_labreport.rows ? list_labreport.rows : [];
        if (list_labreportarray) {
          return list_labreportarray;
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "LabReport", error, "listLabReport");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Edit Lab Report jwt 
module.exports.editloadLabReportgroupJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "LabReport", error, "editloadLabReportgroupJwt");
    throw new Error(error);
  }
}
//Edit User List
module.exports.editloadLabReportgroup = async (req) => {
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
      const { transaction_id } = decoded.data;

      if (decoded) {
        const ref_no = await client.query(`select ref_no from tbl_transaction where transaction_id=` + transaction_id);

        let refno = ref_no.rows[0].ref_no;
        const edit_User = await client.query(`select b.test_id,a.lab_patient_id,b.test_name,b.unit_name,a.group_id,c.group_name,a.patient_id,d.patient_name,
        d.uhid,a.employee_id,e.employee_name,
        coalesce((select  e.value from tbl_lab_report as d inner join tbl_lab_report_details as e on 
        d.report_id = e.report_id where d.lab_test_id=$1 and e.test_id=b.test_id and e.group_id=a.group_id),'0') as value1
        ,coalesce((select  d.report_id from tbl_lab_report as d  where 
           d.lab_test_id=$1 ),'0') as report_id
       ,coalesce((select  d.reported_date from tbl_lab_report as d  where 
           d.lab_test_id=$1  ),'0') as reported_date
        from tbl_employee_lab_test as a 
        inner join tbl_lab_test_master as b on b.test_id = a.test_id 
        inner join tbl_lab_test_group_master as c on c.group_id =a.group_id
        inner join tbl_patient as  d on d.patient_id=a.patient_id inner join 
        tbl_employee_master as e on e.employee_id = a.employee_id
        where a.lab_patient_id = $1`, [refno]);

        if (client) {
          client.end();
        }
        //let edit_Userarra = edit_User && search_User_test.rows[0].count
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "LabReport", error, "editloadLabReportgroup");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}


//create Test Group jwt 
module.exports.createLabreportgroupJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "LabReport", error, "createLabreportgroupJwt");
    throw new Error(error);
  }
}
//create Test Group service
module.exports.createLabreportgroup = async (req) => {
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
      const { report_id, lab_test_id, user_id, transaction_id, labreport_Array, reported_date } = decoded.data;

      var create_date = new Date().getTime();
      var temp_report_id = report_id;

      var grouptest_code;
      if (decoded) {
        if (report_id == 0) {
          var makerid = await commonService.insertLogs(user_id, "Insert Lab Report");
          const max = await client.query(`select coalesce(max(report_id),0) + 1 as mr FROM tbl_lab_report`)

          var maxgroup_id = max && max.rows[0].mr;

          const create_labreport = await client.query(`INSERT INTO "tbl_lab_report"("report_id","transaction_id","lab_test_id","maker_id","user_id","created_time","updated_time","reported_date") values ($1,$2, $3,$4,$5,$6,$7,$8) `, [maxgroup_id, transaction_id, lab_test_id, makerid, user_id, create_date, create_date, reported_date]);
          temp_report_id = max.rows[0].mr;

          let create_usercode = create_labreport && create_labreport.rowCount ? create_labreport.rowCount : 0;


        }
        else {
          await client.query(`UPDATE "tbl_lab_report" set "updated_time"=$1 where "report_id" = $2 `, [create_date, report_id]);
        }

        if (labreport_Array && labreport_Array.length > 0) {

          await client.query(`DELETE FROM tbl_lab_report_details where report_id=$1`, [temp_report_id])

          for (let i = 0; i < labreport_Array.length; i++) {

            const group_test_max = await client.query(`Select coalesce(max(report_detail_id),0) + 1 as mr FROM tbl_lab_report_details`)

            var maxgroup_test_id = group_test_max && group_test_max.rows[0].mr;

            const grouptestresult = await client.query(`INSERT INTO "tbl_lab_report_details"("report_id","report_detail_id","value","test_id","group_id") values ($1, $2,$3 ,$4,$5)`, [temp_report_id, maxgroup_test_id, labreport_Array[i].value1, labreport_Array[i].test_id, labreport_Array[i].group_id]);

            grouptest_code = grouptestresult && grouptestresult.rowCount ? grouptestresult.rowCount : 0;

          }
          if (client) {
            client.end();
          }
          if (grouptest_code == 1) {
            return constants.userMessage.USER_UPDATED
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "LabReport", error, "createLabreportgroup");
    if (client) { client.end(); }
    throw new Error(error);
  } finally {
    if (client) { client.end(); }// always close the resource
  }
}

//create Lab Report service
module.exports.createLabReport = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {

    const { report_id, deleteArray, imageArray, lab_test_id, transaction_id, amount, user_id ,patient_id,uhid} = req;
    var temp_report_id = report_id;

    const count = await client.query(`select report_id FROM tbl_lab_report where transaction_id = $1`, [transaction_id])
    if (count.rows.length > 0) {
      temp_report_id = count && count.rows[0].report_id;
    }
    else {
      temp_report_id = 0;
    }

    var createupdate_date = new Date().setHours(0, 0, 0, 0);

    if (temp_report_id == 0) {
      var makerid = await commonService.insertLogs(user_id, "Insert Lab Report");
      const report_max = await client.query(`select coalesce (max(report_id),0) + 1 as mr FROM tbl_lab_report`)
      const reportid = report_max && report_max.rows[0].mr;
      await client.query(`INSERT INTO tbl_lab_report(report_id, transaction_id, lab_test_id, amount, maker_id, user_id, created_time, updated_time, reported_date,patient_id)  VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$7,$8) `, [reportid, transaction_id, lab_test_id, amount, makerid, user_id, createupdate_date,patient_id]);
      temp_report_id = report_max.rows[0].mr;
    }
    else {
      await client.query(`UPDATE tbl_lab_report set "updated_time"=$1 where "report_id" = $2 `, [createupdate_date, report_id]);
    }

    var fs = require('fs');
    var direction = './images/Lab/' + uhid;

    if (!fs.existsSync(direction)) {
      fs.mkdirSync(direction);
    }
    else {
      if (deleteArray && deleteArray.length > 0) {
        for (let i = 0; i < deleteArray.length; i++) {
          await this.remove_file(direction, transaction_id, deleteArray[i]);
        }
      }
    }
    if (imageArray && imageArray.length > 0) {
      for (let i = 0; i < imageArray.length; i++) {
        await this.insert_image(direction, i, imageArray[i], temp_report_id, user_id)
      }
    }
    if (client) {
      client.end();
    }
    return { message: constants.userMessage.USER_UPLOAD, report_id: temp_report_id };
  }
  catch (error) {
    if (client) { client.end(); }
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Lab Report", error, "createLabReport");
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

module.exports.remove_file = async function (direction, appointment_id, deleteArray) {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  try {
    await client.connect();
    var fs = require('fs');
    const path = require('path');
    if (fs.existsSync(direction + '/' + deleteArray.fileName)) {
      fs.unlink(direction + '/' + deleteArray.fileName, async (err) => {
        if (err) throw err;
        // if no error, file has been deleted successfully
        else {
          console.log('File deleted!');
        }
      });
    } else {
      console.log("DOES NOT exist:");
    }
    var res = await client.query(`DELETE FROM tbl_lab_report_image_details where report_detail_id = $1`, [deleteArray.report_detail_id])
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Lab Report", error, "remove_file");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

module.exports.insert_image = async function (direction, i, imageArray, report_id, user_id) {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    var fs = require('fs');
    var createupdate_date = new Date().getTime();
    var dataString = imageArray.fileArray;
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    var type = response.type.split('/')
    var fileName = 'Lab' + '_' + report_id + '_' + imageArray.fileName + '_' + [i + 1] + '.' + type[1];
    await fs.writeFile(direction + '/' + fileName, response.data, function (err) {
      console.log("The file was saved!");
    })
    await client.query(`INSERT INTO "tbl_lab_report_image_details"(report_detail_id,report_id, image_name, created_time) values ((select coalesce (max(report_detail_id),0) + 1 as mr FROM tbl_lab_report_image_details),$1,$2,$3) `, [report_id, fileName, createupdate_date]);
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Lab Report", error, "insert_image");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

//Radiology Edit load Jwt
module.exports.editLoadLabReportImagesJwt = async (req) => {
  try {
      const token = await commonService.jwtCreate(req);
      return { token };
  } catch (error) {
      await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Lab Report", error, "editLoadLabReportImagesJwt");
      throw new Error(error);
  }
}

//Radiology Edit load service
module.exports.editLoadLabReportImages = async (req) => {
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
          const { transaction_id } = decoded.data;
          if (decoded) {
              const image_result = await client.query(`SELECT a.report_id,b.image_name,
              a.patient_id,c.patient_name,c.uhid,b.created_time,
              b.report_detail_id from tbl_lab_report as a inner join 
              tbl_lab_report_image_details as b on a.report_id = b.report_id inner join
			  tbl_patient as c on c.patient_id= a.patient_id
			  where a.transaction_id = $1 `, [transaction_id]);
              let list_imagearray = image_result && image_result.rows ? image_result.rows : [];

              if (client) {
                  client.end();
              }
              if (list_imagearray) {
                  return list_imagearray;
              }
              else { return '' }
          } else {
              if (client) { client.end(); }
          }

      } else {
          if (client) { client.end(); }
          throw new Error(constants.userMessage.TOKEN_MISSING);
      }
      if (client) {
          client.end();
      }
      return constants.userMessage.USER_UPLOAD;
  }
  catch (error) {
      if (client) { client.end(); }
      await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Lab Report", error, "editLoadLabReportImages");
      throw new Error(error);
  }
  finally {
      if (client) { client.end(); }// always close the resource
  }
}
//Image  load Jwt
module.exports.ListLabImagesJwt = async (req) => {
  try {
      const token = await commonService.jwtCreate(req);
      return { token };
  } catch (error) {
      await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, 
        "Lab Report", error, "ListlabImagesJwt");
      throw new Error(error);
  }
}
//Prescription Upload service
module.exports.ListLabImages = async (req) => {
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
          const { patient_id } = decoded.data;
          if (decoded) {
              const image_result = await client.query(`SELECT a.report_id,a.patient_id,b.report_detail_id,b.created_time,c.uhid,
              a.updated_time as created_date,b.image_name,a.transaction_id
              from tbl_lab_report as a inner join tbl_lab_report_image_details as b on 
              a.report_id = b.report_id  inner join tbl_patient as c on c.patient_id=a.patient_id
              where a.patient_id = $1 `, [patient_id]);
              let list_imagearray = image_result && image_result.rows ? image_result.rows : [];

              if (client) {
                  client.end();
              }
              if (list_imagearray) {
                  return list_imagearray;
              }
              else { return '' }
          } else {
              if (client) { client.end(); }
          }

      } else {
          if (client) { client.end(); }
          throw new Error(constants.userMessage.TOKEN_MISSING);
      }
      if (client) {
          client.end();
      }
      return constants.userMessage.USER_UPLOAD;
  }
  catch (error) {
      if (client) { client.end(); }
      await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Lab Report", error, "ListlabImages");
      throw new Error(error);
  }
  finally {
      if (client) { client.end(); }// always close the resource
  }
}