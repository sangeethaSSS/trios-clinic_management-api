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

//create Financial Jwt
module.exports.createFinancialJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "createFinancialJwt");
        throw new Error(error);
    }
}
//create Financial service
module.exports.createFinancial = async (req) => {
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
            const { financial_year_id, start_date, end_date, active_status, user_id, financialSettingArray } = decoded.data;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            var response = {}
            if (decoded) {
                if (financial_year_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Financial Year");
                    const max = await client.query(`select coalesce(max(financial_year_id),0) + 1 as mr FROM tbl_financial_year`)
                    var maxfinancial = max && max.rows[0].mr;
                    const create_result = await client.query(`INSERT INTO "tbl_financial_year"("financial_year_id","start_date","end_date","active_status","user_id","maker_id","created_date") values ($1, $2, $3,$4,$5,$6,$7) `, [maxfinancial, start_date, end_date, active_status, user_id, makerid, createupdate_date]);

                    if (financialSettingArray && financialSettingArray.length > 0) {
                        for (let i = 0; i < financialSettingArray.length; i++) {
                            const setting_max = await client.query(`select coalesce (max(setting_id),0) + 1 as mr FROM tbl_financial_setting`)
                            var settingmax = setting_max && setting_max.rows[0].mr;
                            const settingresult = await client.query(`INSERT INTO "tbl_financial_setting"("setting_id","financial_year_id","module_id","prefix","suffix","noofdigit") values ($1, $2, $3,Upper($4),Upper($5),$6) `, [settingmax, maxfinancial, financialSettingArray[i].module_id, financialSettingArray[i].prefix, financialSettingArray[i].suffix, financialSettingArray[i].noofdigit]);
                            let setting_code = settingresult && settingresult.rowCount ? settingresult.rowCount : 0;
                            console.log(setting_code)
                        }
                    }
                    if (client) {
                        client.end();
                    }
                    let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
                    if (create_usercode == 1) {
                        return response = { "message": constants.userMessage.USER_CREATED }
                    }
                    else { return '' }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Financial Year");
                    const setting_Count = await client.query(`select count(*) as count FROM tbl_financial_year where financial_year_id =` + financial_year_id)
                    var count_Check = setting_Count && setting_Count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_financial_year" set "start_date"=$1, "end_date"=$2,"active_status"=$3,"maker_id"=$4,"user_id"=$5,"updated_date"=$6 where "financial_year_id" = $7 `, [start_date, end_date, active_status, makerid, user_id, createupdate_date, financial_year_id]);

                        if (financialSettingArray && financialSettingArray.length > 0) {
                            await client.query(`DELETE FROM tbl_financial_setting where financial_year_id=$1`,
                                [financial_year_id])
                            for (let i = 0; i < financialSettingArray.length; i++) {
                                const setting_max = await client.query(`select coalesce (max(setting_id),0) + 1 as mr FROM tbl_financial_setting`)
                                var settingmax = setting_max && setting_max.rows[0].mr;
                                const settingresult = await client.query(`INSERT INTO "tbl_financial_setting"("setting_id","financial_year_id","module_id","prefix","suffix","noofdigit") values ($1, $2, $3, Upper($4), Upper($5),$6) `, [settingmax, financial_year_id, financialSettingArray[i].module_id, financialSettingArray[i].prefix, financialSettingArray[i].suffix, financialSettingArray[i].noofdigit]);
                                let setting_code = settingresult && settingresult.rowCount ? settingresult.rowCount : 0;
                                console.log(setting_code)
                            }
                        }
                        if (client) {
                            client.end();
                        }
                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (update_code == 1) {
                            return response = { "message": constants.userMessage.USER_UPDATED }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "createFinancial");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}

//EDitload Financial Jwt
module.exports.editloadFinancialJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "editloadFinancialJwt");
        throw new Error(error);
    }
}

//Editload Financial service
module.exports.editloadFinancial = async (req) => {
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
            const { financial_year_id } = decoded.data;
            if (decoded) {

                const editload_Financial = await client.query(`select a.financial_year_id,a.start_date,a.end_date,a.active_status,c.status_name FROM tbl_financial_year as a inner join tbl_def_status as c on c.status_id=a.active_status where a.financial_year_id = $1`, [financial_year_id])

                const editload_setting = await client.query(`select a.financial_year_id,a.setting_id,a.module_id,a.prefix,a.suffix,a.noofdigit,b.module_name FROM tbl_financial_setting as a inner join tbl_def_modules as b on b.module_id = a.module_id where a.financial_year_id = $1`, [financial_year_id])

                var editload_array = editload_Financial && editload_Financial.rows ? editload_Financial.rows : [];
                var setting = editload_setting && editload_setting.rows ? editload_setting.rows : [];
                response_Array = {
                    "FinancialArray": editload_array, "SettingArray": setting
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "editloadFinancial");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}

//list Financial Jwt
module.exports.listFinancialJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "listFinancialJwt");
        throw new Error(error);
    }
}


//List Financial service
module.exports.listFinancial = async (req) => {
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
                const list_Financial = await client.query(`select a.financial_year_id,a.start_date,a.end_date,a.active_status,c.status_name FROM tbl_financial_year as a inner join tbl_def_status as c on c.status_id=a.active_status`)
                var listFinancial_array = list_Financial && list_Financial.rows ? list_Financial.rows : [];
                if (listFinancial_array) {
                    return listFinancial_array;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "listFinancial");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Delete Financial jwt 
module.exports.deleteFinancialJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "deleteFinancialJwt");
        throw new Error(error);
    }
}

//Delete Financial service
module.exports.deleteFinancial = async (req) => {
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
            const { financial_year_id, user_id } = decoded.data;
            if (decoded) {
                var response = {}
                await commonService.insertLogs(user_id, "Delete Patient");
                const transactioncount = await client.query(`select count(*) as transactioncount FROM tbl_transaction where financial_year_id =` + financial_year_id)
                var transaction_Check = transactioncount && transactioncount.rows[0].transactioncount
                if (transaction_Check > 0) {
                    return response = { "message": constants.userMessage.FINANCIAL_CHECK, "status": false }
                }
                else {
                    const financialyear_Count = await client.query(`select count(*) as count FROM tbl_financial_year where financial_year_id =` + financial_year_id)
                    var count_Check = financialyear_Count && financialyear_Count.rows[0].count;
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        await client.query(`DELETE FROM tbl_financial_setting WHERE financial_year_id = $1` , [financial_year_id]);
                        const delete_result = await client.query(`DELETE FROM tbl_financial_year WHERE financial_year_id = $1 `,
                            [financial_year_id]);
                        if (client) {
                            client.end();
                        }
                        let financialcode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
                        if (financialcode == 1) {
                            return response = { "message": constants.userMessage.USER_DELETED, "status": true }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "deleteFinancial");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Delete module jwt 
module.exports.deleteModuleJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "deleteModuleJwt");
        throw new Error(error);
    }
}

//Delete module service
module.exports.deleteModule = async (req) => {
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
            const { financial_year_id,module_id } = decoded.data;
            if (decoded) {
                const transactioncount = await client.query(`select count(*) as transactioncount FROM tbl_transaction where financial_year_id =` + financial_year_id +`and module_id=`+module_id)
                var transaction_Check = transactioncount && transactioncount.rows[0].transactioncount
                if (transaction_Check > 0) {
                    return response = { "message": constants.userMessage.FINANCIAL_MODULE_CHECK, "status": false }
                }
                else{
                    return response = { "status": true }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Financial_year", error, "deleteModule");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}