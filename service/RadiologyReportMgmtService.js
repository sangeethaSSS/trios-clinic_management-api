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

//List Radiology Price jwt 
module.exports.listRadiologyReportJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "listRadiologyReportJwt");
        throw new Error(error);
    }
}
//List Radiology Price service
module.exports.listRadiologyReport = async (req) => {
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

            var response_Array = {}
            if (decoded) {
                const list_report = await client.query(`select a.transaction_id,a.ref_no,b.employee_id,b.patient_id,d.employee_name,a.created_date as created_date,coalesce((report_id),0) as report_id,c.patient_name,e.city_name,a.cash_rate,c.uhid,g.module_name from tbl_cash_transaction as a inner join tbl_transaction as b on a.transaction_id=b.transaction_id inner join tbl_patient as c on c.patient_id=b.patient_id inner join tbl_employee_master as d on d.employee_id=b.employee_id inner join tbl_def_city as e on e.city_id = c.city_id inner join tbl_def_modules as g on g.module_id = a.module_id left outer join tbl_radiology_report as f on f.transaction_id=a.transaction_id where a.module_id = 6 AND a.created_date BETWEEN ` + created_date + ` AND ` + end_date + `or a.module_id = 3 AND a.created_date BETWEEN ` + created_date + ` AND ` + end_date)
                var list_reportarray = list_report && list_report.rows ? list_report.rows : [];
                response_Array = {
                    "listRadiologyArray": list_reportarray
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "listRadiologyReport");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//List Radiology Price service
module.exports.CreateRadiologyReport = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {

        const { report_id, deleteArray, imageArray, patient_id, employee_id, transaction_id, radiology_test_id, user_id, active_status ,uhid} = req;
        var temp_report_id = report_id;

        const count = await client.query(`select report_id FROM tbl_radiology_report where radiology_test_id = $1`, [radiology_test_id])
        if (count.rows.length > 0) {
            temp_report_id = count && count.rows[0].report_id;
        }
        else {
            temp_report_id = 0;
        }
        var createupdate_date = new Date().setHours(0, 0, 0, 0);

        if (temp_report_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert radiology report_id");

            const max = await client.query(`select coalesce (max(report_id),0) + 1 as mr FROM tbl_radiology_report`)
            var maxreportId = max && max.rows[0].mr;
            await client.query(`INSERT INTO tbl_radiology_report(report_id, transaction_id, "radiology_test_id", employee_id, patient_id,  user_id, maker_id, created_date, updated_date, active_status)
                VALUES ($9,$1,$2,$3,$4,$5,$6,$7,$7,$8) `, [ transaction_id, radiology_test_id, employee_id, patient_id, user_id, makerid, createupdate_date, active_status,maxreportId]);
            temp_report_id = maxreportId;
        }
        else {
            await client.query(`UPDATE "tbl_radiology_report" set "updated_date"=$1 where "report_id" = $2 `, [createupdate_date, report_id]);
        }

        var fs = require('fs');
        var direction = './images/Radiology/' + uhid;

        if (!fs.existsSync(direction)) {
            fs.mkdirSync(direction);
        }
        else {
            if (deleteArray && deleteArray.length > 0) {
                for (let i = 0; i < deleteArray.length; i++) {
                    await this.remove_file(direction, temp_report_id, deleteArray[i]);
                }
            }
        }
        if (imageArray && imageArray.length > 0) {
            for (let i = 0; i < imageArray.length; i++) {
                await this.insert_image(direction, i, imageArray[i], temp_report_id, transaction_id, user_id)
            }
        }
        if (client) {
            client.end();
        }
        return { message: constants.userMessage.USER_UPLOAD, report_id: temp_report_id };
        // }
        // else
        // {
        //     if (client) { client.end(); }
        //         throw new Error(constants.userMessage.TOKEN_MISSING);
        // }
    }
    catch (error) {
        if (client) { client.end(); }
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "CreateRadiologyReport");
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.remove_file = async function (direction, report_id, deleteArray) {
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
        var res = await client.query(`DELETE FROM tbl_radiology_report_details where report_details_id = $1`, [deleteArray.report_details_id])
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "remove_file");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.insert_image = async function (direction, i, imageArray, report_id, transaction_id) {
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
        var fileName = 'Radiology' + '_' + report_id + '_' + [i + 1] + imageArray.fileName + '.' + type[1];
        await fs.writeFile(direction + '/' + fileName, response.data, function (err) {
            console.log("The file was saved!");
        })
        await client.query(`INSERT INTO "tbl_radiology_report_details"("report_details_id","report_id","radiology_id","radiology_part_id","image_name","created_time","transaction_id","value") values ((select coalesce (max(report_details_id),0) + 1 as mr FROM tbl_radiology_report_details),$1,$2,$3,$4,$5,$6,$7) `, [report_id, imageArray.radiology_id, imageArray.radiology_part_id, fileName, createupdate_date, transaction_id, imageArray.value]);
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "insert_image");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Radiology Edit load Jwt
module.exports.editLoadRadiologyImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "editLoadRadiologyImagesJwt");
        throw new Error(error);
    }
}

//Radiology Edit load service
module.exports.editLoadRadiologyImages = async (req) => {
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
                const image_result = await client.query(`SELECT a.report_id,a.patient_id,b.created_time,b.image_name,b.radiology_id,b.radiology_part_id,c.radiology_name,d.radiology_part_name, b.report_details_id,e.uhid,e.patient_name from tbl_radiology_report as a inner join tbl_radiology_report_details as b on a.report_id = b.report_id inner join tbl_def_radiology_type as c on c.radiology_id = b.radiology_id inner join tbl_def_radiology_parts as d on d.radiology_part_id = b.radiology_part_id inner join tbl_patient as 
                e on e.patient_id = a.patient_id where b.transaction_id = $1 `, [transaction_id]);
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "editLoadRadiologyImages");
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Prescription Upload Jwt
module.exports.ListRadiologyImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "ListRadiologyImagesJwt");
        throw new Error(error);
    }
}

//Prescription Upload service
module.exports.ListRadiologyImages = async (req) => {
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
                const image_result = await client.query(`SELECT a.report_id,a.patient_id,b.report_details_id,b.radiology_id,b.radiology_part_id,b.value,e.uhid,
                b.created_time,a.updated_date as created_date,b.image_name,a.transaction_id,c.radiology_name,d.radiology_part_name 
                from tbl_radiology_report as a inner join tbl_radiology_report_details as b on a.transaction_id = b.transaction_id 
                inner join tbl_def_radiology_type as c on c.radiology_id = b.radiology_id inner join tbl_def_radiology_parts as d 
                on d.radiology_part_id = b.radiology_part_id inner join tbl_patient as e on e.patient_id=a.patient_id
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "RadiologyReport", error, "ListRadiologyImages");
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}