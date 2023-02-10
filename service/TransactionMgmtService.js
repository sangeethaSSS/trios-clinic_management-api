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

//Create Transaction jwt 
module.exports.createTransactionJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Transaction", error, "createTransactionJwt");
        throw new Error(error);
    }
}
//Create Transaction service
module.exports.createTransaction = async (req) => {
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
            const { transaction_id, employee_id, appointment_id, patient_id, module_id, paymentstatus_id, total_amount, active_status, user_id, employee_testArray } = decoded.data;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            if (decoded) {
                if (transaction_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Transaction");
                    const max = await client.query(`select coalesce(max(transaction_id),0) + 1 as mr FROM tbl_transaction`)
                    var maxtransaction_id = max && max.rows[0].mr;

                    const create_result = await client.query(`INSERT INTO "tbl_transaction"("transaction_id","employee_id","patient_id","module_id","paymentstatus_id","total_amount","active_status","maker_id","user_id","created_date",appointment_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) `, [maxtransaction_id, employee_id, patient_id, module_id, paymentstatus_id, total_amount, active_status, makerid, user_id, createupdate_date, appointment_id]);
                    if (employee_testArray && employee_testArray.length > 0) {
                        for (let i = 0; i < employee_testArray.length; i++) {
                            const labtest_max = await client.query(`select coalesce (max(lab_test_id),0) + 1 as mr FROM tbl_employee_lab_test`)
                            var maxlab_test_id = labtest_max && labtest_max.rows[0].mr;
                            const Labtestresult = await client.query(`INSERT INTO "tbl_employee_lab_test"("lab_test_id","employee_id","patient_id","group_id","test_id","transaction_id","test_rate","group_rate") values ($1, $2, $3, $4, $5,$6,$7,$8) `, [maxlab_test_id, employee_id, patient_id, employee_testArray[i].group_id, employee_testArray[i].test_id, maxtransaction_id, employee_testArray[i].test_rate, employee_testArray[i].group_rate]);
                            let LabTest_code = Labtestresult && Labtestresult.rowCount ? Labtestresult.rowCount : 0;
                            console.log(LabTest_code)
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
                    var makerid = await commonService.insertLogs(user_id, "Update Transaction");
                    const transaction_Count = await client.query(`select count(*) as count FROM tbl_transaction where transaction_id =` + transaction_id)
                    var count_Check = transaction_Count && transaction_Count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_transaction" set "employee_id"= $1,"patient_id"=$2,"module_id"=$3,"paymentstatus_id"= $4,"total_amount"=$5,"active_status"=$6,"maker_id"=$7,"user_id"=$8,"updated_date"=$9,"appointment_id"=$10 where "transaction_id" = $11 `, [employee_id, patient_id, module_id, paymentstatus_id, total_amount, active_status, makerid, user_id, createupdate_date, appointment_id, transaction_id]);
                        if (employee_testArray && employee_testArray.length > 0) {
                            await client.query(`DELETE FROM tbl_employee_lab_test where transaction_id=$1`,
                                [transaction_id])
                            for (let i = 0; i < employee_testArray.length; i++) {
                                const labtest_max = await client.query(`select coalesce (max(lab_test_id),0) + 1 as mr FROM tbl_employee_lab_test`)
                                var maxlab_test_id = labtest_max && labtest_max.rows[0].mr;
                                const Labtestresult = await client.query(`INSERT INTO "tbl_employee_lab_test"("lab_test_id","employee_id","patient_id","group_id","test_id","transaction_id","test_rate","group_rate") values ($1, $2, $3, $4,$5,$6,$7,$8) `, [maxlab_test_id, employee_id, patient_id, employee_testArray[i].group_id, employee_testArray[i].test_id, transaction_id, employee_testArray[i].test_rate, employee_testArray[i].group_rate]);
                                let LabTest_code = Labtestresult && Labtestresult.rowCount ? Labtestresult.rowCount : 0;
                                console.log(LabTest_code)
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Transaction", error, "createTransaction");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}