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
const puppeteer = require('puppeteer'); //using headless mode
const hb = require('handlebars');
const fs = require('fs');
const path = require('path');
const utils = require('util');
const moment = require('moment');
const readFile = utils.promisify(fs.readFile);
//Connect Postgres
const { Client } = require('pg');

//Create Patient lab test jwt 
module.exports.createPatientLabtestJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "createPatientLabtestJwt");
        throw new Error(error);
    }
}
//Create Patient lab test service
module.exports.createPatientLabtest = async (req) => {
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
            const { lab_patient_id, employee_id, appointment_id, patient_id, module_id, lab_rate, paymentstatus_id, active_status, user_id, employee_testArray } = decoded.data;
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
                        if (lab_patient_id == 0) {
                            var makerid = await commonService.insertLogs(user_id, "Insert Patient Lab");
                            const max = await client.query(`select coalesce(max(lab_patient_id),0) + 1 as mr FROM tbl_patient_lab_details`)
                            var maxtab_id = max && max.rows[0].mr;
                            const create_result = await client.query(`INSERT INTO "tbl_patient_lab_details"("lab_patient_id","employee_id","patient_id","appointment_id","lab_rate","paymentstatus_id","active_status","maker_id","user_id","created_date","module_id") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) `, [maxtab_id, employee_id, patient_id, appointment_id, lab_rate, paymentstatus_id, active_status, makerid, user_id, createupdate_date, module_id]);
                            if (employee_testArray && employee_testArray.length > 0) {
                                for (let i = 0; i < employee_testArray.length; i++) {
                                    const labtest_max = await client.query(`select coalesce (max(lab_test_id),0) + 1 as mr FROM tbl_employee_lab_test`)
                                    var maxlab_test_id = labtest_max && labtest_max.rows[0].mr;
                                    const Labtestresult = await client.query(`INSERT INTO "tbl_employee_lab_test"("lab_test_id","employee_id","patient_id","group_id","test_id","lab_patient_id","test_rate","group_rate") values ($1, $2, $3, $4, $5,$6,$7,$8) `, [maxlab_test_id, employee_id, patient_id, employee_testArray[i].group_id, employee_testArray[i].test_id, maxtab_id, employee_testArray[i].test_rate, employee_testArray[i].group_rate]);
                                    let LabTest_code = Labtestresult && Labtestresult.rowCount ? Labtestresult.rowCount : 0;
                                }
                            }
                            await client.query(`INSERT INTO "tbl_transaction"("transaction_id","employee_id","patient_id","module_id","paymentstatus_id","total_amount","active_status","maker_id","user_id","created_date",ref_no,created_time,"account_id","voucher_no","financial_year_id","updated_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`, [maxtransaction_id, employee_id, patient_id, module_id, paymentstatus_id, lab_rate, 1, makerid, user_id, createupdate_date, maxtab_id, create_date, account_id, voucher_id, financial_year_id,createupdate_date]);

                            if (client) {
                                client.end();
                            }
                            let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
                            if (create_usercode == 1) {
                                // this.getPrintDetails(patient_id, module_id, lab_patient_id, voucher_id)
                                message = { "message": constants.userMessage.USER_CREATED, "status": true,"voucher_no":voucher_id}
                                return message
                            }
                            else { return '' }
                        }
                        else {
                            var makerid = await commonService.insertLogs(user_id, "Update Patient Lab");
                            const lab_Count = await client.query(`select count(*) as count FROM tbl_patient_lab_details where lab_patient_id =` + lab_patient_id)
                            var count_Check = lab_Count && lab_Count.rows[0].count
                            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                                const update_result = await client.query(`UPDATE "tbl_patient_lab_details" set "employee_id"= $1,"patient_id"=$2,"appointment_id"=$3,"paymentstatus_id"= $4,"lab_rate"=$5,"active_status"=$6,"maker_id"=$7,"user_id"=$8,"updated_date"=$9,"module_id"=$10 where "lab_patient_id" = $11 `, [employee_id, patient_id, appointment_id, paymentstatus_id, lab_rate, active_status, makerid, user_id, createupdate_date, module_id, lab_patient_id]);
                                if (employee_testArray && employee_testArray.length > 0) {
                                    await client.query(`DELETE FROM tbl_employee_lab_test where lab_patient_id=$1`,
                                        [lab_patient_id])
                                    for (let i = 0; i < employee_testArray.length; i++) {
                                        const labtest_max = await client.query(`select coalesce (max(lab_test_id),0) + 1 as mr FROM tbl_employee_lab_test`)
                                        var maxlab_test_id = labtest_max && labtest_max.rows[0].mr;
                                        const Labtestresult = await client.query(`INSERT INTO "tbl_employee_lab_test"("lab_test_id","employee_id","patient_id","group_id","test_id","lab_patient_id","test_rate","group_rate") values ($1, $2, $3, $4,$5,$6,$7,$8) `, [maxlab_test_id, employee_id, patient_id, employee_testArray[i].group_id, employee_testArray[i].test_id, lab_patient_id, employee_testArray[i].test_rate, employee_testArray[i].group_rate]);
                                        let LabTest_code = Labtestresult && Labtestresult.rowCount ? Labtestresult.rowCount : 0;
                                    }
                                }

                                await client.query(`UPDATE "tbl_transaction" set "updated_date"=$4,"paymentstatus_id"=$1,"total_amount"=$2 where "ref_no" = $3 and module_id=4`, [paymentstatus_id, lab_rate, lab_patient_id,createupdate_date]);
                               
                                
                                if (client) {
                                    client.end();
                                }
                                let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                                if (update_code == 1) {
                                    // this.getPrintDetails(patient_id, module_id, lab_patient_id, voucher_id)
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "createPatientLabtest");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Edit Patient lab test jwt 
module.exports.editloadPatientLabDetailsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "editloadPatientLabDetailsJwt");
        throw new Error(error);
    }
}
//Edit Patient lab test List
module.exports.editloadPatientLabDetails = async (req) => {
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
            const { lab_patient_id } = decoded.data;
            if (decoded) {
                const edit_Labtest = await client.query(`select a.lab_patient_id,a.employee_id,a.patient_id,a.appointment_id,a.lab_rate,a.paymentstatus_id,a.module_id,e.module_name,b.group_id,b.test_id,c.group_name,c.rate as group_rate,d.test_name,d.rate as test_rate from tbl_patient_lab_details as a inner join tbl_employee_lab_test as b on a.lab_patient_id = b.lab_patient_id inner join tbl_lab_test_group_master as c on b.group_id = c.group_id inner join tbl_lab_test_master as d on b.test_id = d.test_id inner join tbl_def_modules as e on a.module_id = e.module_id where a.lab_patient_id = $1 `, [lab_patient_id]);
                if (client) {
                    client.end();
                }
                let edit_Labtestarray = edit_Labtest && edit_Labtest.rows ? edit_Labtest.rows : [];
                if (edit_Labtestarray) {
                    return edit_Labtestarray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "editloadPatientLabDetails");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Get PaymentStatus jwt 
module.exports.getPaymentStatusJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "getPaymentStatusJwt");
        throw new Error(error);
    }
}
//Get PaymentStatus 
module.exports.getPaymentStatus = async (req) => {
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
                const get_Status = await client.query(`select a.paymentstatus_id,b.paymentstatus_name,a.lab_patient_id FROM tbl_patient_lab_details as a inner join tbl_def_payment_status as b on a.paymentstatus_id = b.paymentstatus_id where a.appointment_id = $1 `, [appointment_id]);
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "getPaymentStatus");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//load Test Details jwt 
module.exports.loadTestDetailsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "loadTestDetailsJwt");
        throw new Error(error);
    }
}
//load Test Details
module.exports.loadTestDetails = async (req) => {
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
            const { lab_patient_id } = decoded.data;
            if (decoded) {
                // const get_Labtest = await client.query(`select a.lab_patient_id,a.employee_id,a.patient_id,a.appointment_id,a.lab_rate,a.paymentstatus_id,a.module_id,e.module_name,b.group_id,b.group_rate as group_rate,b.test_rate as test_rate,b.test_id,c.group_name,d.test_name from tbl_patient_lab_details as a inner join tbl_employee_lab_test as b on a.lab_patient_id = b.lab_patient_id inner join tbl_lab_test_group_master as c on b.group_id = c.group_id inner join tbl_lab_test_master as d on b.test_id = d.test_id inner join tbl_def_modules as e on a.module_id = e.module_id  where a.lab_patient_id = $1`, [lab_patient_id]);

                const get_Labtest = await client.query(`select a.lab_patient_id,a.employee_id,a.patient_id,a.appointment_id,a.lab_rate,a.paymentstatus_id,
                a.module_id,e.module_name,b.group_id,b.group_rate as group_rate,b.test_rate as test_rate,b.test_id,
                c.group_name,d.test_name,f.voucher_no from tbl_patient_lab_details as a inner join tbl_employee_lab_test as b on 
                a.lab_patient_id = b.lab_patient_id inner join tbl_lab_test_group_master as c on b.group_id = c.group_id 
                inner join tbl_lab_test_master as d on b.test_id = d.test_id inner join tbl_def_modules as e 
                on a.module_id = e.module_id inner join tbl_transaction as f on f.ref_no = a.lab_patient_id and f.module_id = 4 
                where a.lab_patient_id = $1`, [lab_patient_id]);
                if (client) {
                    client.end();
                }
                let load_Labtestarray = get_Labtest && get_Labtest.rows ? get_Labtest.rows : [];
                if (load_Labtestarray) {
                    return load_Labtestarray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "loadTestDetails");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.getTemplateHtml = async () => {
    try {
        const invoicePath = path.resolve('./labtest.html');
        return await readFile(invoicePath, 'utf8');
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "getTemplateHtml");
        return Promise.reject("Could not load html template");
    }
}

//Get Print Details Module
module.exports.getPrintDetails = async (patient_id, module_id, lab_patient_id, voucher_id) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        const get_Print = await client.query(`select print_folder_name from tbl_print_setting `);
        const get_Account = await client.query(`select a.account_id,a.module_id,b.account_id,b.city_id,b.state_id,b.company_code,b.company_name,b.email_id,b.area_name,b.street_name,b.mobile_number,b.pincode,b.website,c.city_name,d.state_name from tbl_account_module as a inner join tbl_account_master as b on a.account_id = b.account_id inner join  tbl_def_city as c  on b.city_id=c.city_id inner join tbl_def_state as d on d.state_id=b.state_id where a.module_id = $1 ORDER BY a.module_id DESC limit 1`, [module_id]);
        const get_Patient = await client.query(`select a.patient_id,a.patient_name,a.guardian_name,a.gender_id,a.date_of_birth,a.blood_group_id,a.age_day,a.age_month,a.age_year,a.dob_type,a.city_id,a.mobile_number,a.uhid,b.gender_name,c.blood_group_name,e.city_name from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_blood_group as c on a.blood_group_id=c.blood_group_id inner join tbl_def_city as e on a.city_id = e.city_id where patient_id = $1`, [patient_id]);
        const gettestGroup_test = await client.query(`select a.lab_patient_id,a.lab_rate,d.group_id,d.test_id,b.group_name,b.rate as group_rate,c.test_name,c.rate::text as test_rate from tbl_patient_lab_details as a inner join tbl_employee_lab_test as d on a.lab_patient_id = d.lab_patient_id  inner join tbl_lab_test_group_master as b on d.group_id = b.group_id inner join tbl_lab_test_master as c on d.test_id = c.test_id where a.lab_patient_id = $1 `, [lab_patient_id]);

        let get_PrintArray = get_Print && get_Print.rows ? get_Print.rows : [];
        let get_grouptestArray = gettestGroup_test && gettestGroup_test.rows ? gettestGroup_test.rows : [];
        let get_Accountarray = get_Account && get_Account.rows ? get_Account.rows : [];
        let getPatientArray = get_Patient && get_Patient.rows ? get_Patient.rows : [];
        response_array = {
            "getAccountarray": get_Accountarray, "getPatientArray": getPatientArray, "getGrouptestArray": get_grouptestArray
        }
        var age = await commonService.agecalucation(getPatientArray[0]['age_day'], getPatientArray[0]['age_month'], getPatientArray[0]['age_year'], getPatientArray[0]['dob_type'], getPatientArray[0]['date_of_birth']);
        // return response_array
        var sum = 0, total_rate = 0;
        if (get_grouptestArray && get_grouptestArray.length > 0) {
            for (var i = 0; i < get_grouptestArray.length; i++) {
                sum += parseInt(get_grouptestArray[i].lab_rate)
                total_rate = sum.toFixed(2)
            }
        }
        var grouparray = formCartItems(get_grouptestArray)
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
            if (grouparray && grouparray.length > 0) {
                for (var i = 0; i < grouparray.length; i++) {
                    logger.write(grouparray[i].key + "\r\n")
                    var testarray = grouparray[i].value
                    for (var j = 0; j < testarray.length; j++) {
                        var rate = parseInt(testarray[j].test_rate).toFixed(2)
                        logger.write(formattextLeftRight(testarray[j].test_name, 'Rs.' + rate.toString(), 45) + "\r\n")
                    }
                }
            }
            logger.write('----------------------------------------------' + "\r\n")
            logger.write(formattextLeftRight('Total', 'Rs.' + total_rate.toString(), 45) + "\r\n")
            logger.write('----------------------------------------------' + "\r\n")
            logger.write(formattextCenter('Greatest wealth is Health !!...', 45, "center") + "\r\n")
            logger.end();
        }

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"PatientLabDetails", error, "getPrintDetails");
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
function formCartItems(selectedTests) {
    try {
        if (selectedTests && selectedTests.length > 0) {
            var groupName = selectedTests;
            result = groupName.reduce(function (r, a) {
                r[a.group_name] = r[a.group_name] || [];
                r[a.group_name].push(a);
                return r;
            }, Object.create(null));
            var jsonToBeUsed = [];
            for (var type in result) {
                var item = {};
                item['key'] = type;
                item['value'] = result[type];
                jsonToBeUsed.push(item);
            }
            return jsonToBeUsed;
        }
        else {
            return []
        }
    }
    catch (err) {
        console.log(err, 'error');
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

