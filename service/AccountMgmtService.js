const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create Account jwt 
module.exports.createAccountJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "createAccountJwt");
        throw new Error(error);
    }
}
//create Account service
module.exports.createAccount = async (req) => {
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
            const { account_id, city_id, state_id, company_code, company_name, email_id, area_name, street_name, gstin_number, mobile_number, whatsapp_number, telephone_number1, telephone_number2, pincode, reg_number, website, user_id, active_status, city_name, moduleArray } = decoded.data;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            if (decoded) {
                var maxCity_Check = 0;
                const maxcity = await client.query(`select coalesce(max(city_id),0) + 1 as mr FROM tbl_def_city`)
                maxCity_Check = maxcity && maxcity.rows[0].mr;
                if (city_id == 0) {
                    await client.query(`INSERT INTO "tbl_def_city"("city_id","city_name","active_status") values ($1,Upper($2),$3) `, [maxCity_Check, city_name, 1]);
                }
                else { maxCity_Check = city_id }
                if (account_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Account");
                    const max = await client.query(`select coalesce(max(account_id),0) + 1 as mr FROM tbl_account_master`)
                    var maxaccount = max && max.rows[0].mr;
                    const result = await client.query(`INSERT INTO tbl_account_master ("account_id","city_id", "state_id", "company_code","company_name","email_id","area_name","street_name","gstin_number", "mobile_number", "whatsapp_number","telephone_number1","telephone_number2","pincode","reg_number","website","user_id","maker_id","created_date","active_status") values ($1, $2, $3,Upper($4),Upper($5),$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) `, [maxaccount, maxCity_Check, state_id, company_code, company_name, email_id, area_name, street_name, gstin_number, mobile_number, whatsapp_number, telephone_number1, telephone_number2, pincode, reg_number, website, user_id, makerid, createupdate_date, active_status]);
                    if (moduleArray && moduleArray.length > 0) {
                        for (let i = 0; i < moduleArray.length; i++) {
                            const accountmodule_max = await client.query(`select coalesce (max(account_module_id),0) + 1 as mr FROM tbl_account_module`)
                            var accountmax = accountmodule_max && accountmodule_max.rows[0].mr;
                            const accountmoduleresult = await client.query(`INSERT INTO "tbl_account_module"("account_module_id","account_id","module_id","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6) `, [accountmax, maxaccount, moduleArray[i].module_id, makerid, user_id, createupdate_date]);
                            let accountmodule_code = accountmoduleresult && accountmoduleresult.rowCount ? accountmoduleresult.rowCount : 0;
                        }
                    }
                    if (client) {
                        client.end();
                    }
                    let create_code = result && result.rowCount ? result.rowCount : 0;
                    if (create_code == 1) {
                        return constants.userMessage.USER_CREATED;
                    }
                    else { return '' }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Account");
                    const count = await client.query(`select count(*) as count FROM tbl_account_master where account_id =` + account_id)
                    var count_Check = count && count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_account_master" set "company_name"= Upper($1), "city_id"=$2,"state_id"=$3,"company_code"=Upper($4),"email_id"=$5,"area_name"=$6,"street_name"=$7,"gstin_number"=$8,
                        "mobile_number"=$9,"whatsapp_number"=$10,"telephone_number1"=$11,"telephone_number2"=$12,"pincode"=$13,"reg_number"=$14,"website"=$15,"user_id"=$16,"maker_id"=$17,"updated_date"=$18,"active_status"=$19
                         where "account_id" = $20 `, [company_name, maxCity_Check, state_id, company_code, email_id, area_name, street_name, gstin_number, mobile_number, whatsapp_number, telephone_number1, telephone_number2, pincode, reg_number, website, user_id, makerid, createupdate_date, active_status, account_id]);
                        if (moduleArray && moduleArray.length > 0) {
                            await client.query(`DELETE FROM tbl_account_module where account_id = ` + account_id)
                            for (let i = 0; i < moduleArray.length; i++) {
                                const accountmodule_max = await client.query(`select coalesce (max(account_module_id),0) + 1 as mr FROM tbl_account_module`)
                                var accountmax = accountmodule_max && accountmodule_max.rows[0].mr;
                                const accountmoduleresult = await client.query(`INSERT INTO "tbl_account_module"("account_module_id","account_id","module_id","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6) `, [accountmax, account_id, moduleArray[i].module_id, makerid, user_id, createupdate_date]);
                                let accountmodule_code = accountmoduleresult && accountmoduleresult.rowCount ? accountmoduleresult.rowCount : 0;
                            }
                        }
                        if (client) {
                            client.end();
                        }
                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (update_code == 1) {
                            return constants.userMessage.USER_UPDATED;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "createAccount");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//List Account jwt 
module.exports.listAccountJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "listAccountJwt");
        throw new Error(error);
    }
}
//List AccountList
module.exports.listAccount = async (req) => {
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
                const list_Account = await client.query(`select a.account_id,a.company_code,a.company_name,a.city_id,a.state_id,a.mobile_number,a.whatsapp_number,a.reg_number,a.telephone_number1,a.telephone_number2,a.website,a.gstin_number,a.active_status,b.city_name,c.state_name,STRING_AGG (e.module_name, ',') module_name, STRING_AGG (cast(e.module_id as text), ',' ) module_id from tbl_account_master as a inner join tbl_account_module as d on d.account_id=a.account_id left join tbl_def_modules as e on e.module_id=d.module_id inner join  tbl_def_city as b  on b.city_id=a.city_id inner join tbl_def_state as c on c.state_id=a.state_id where a.active_status != -1 group by a.account_id,b.city_name,c.state_name ORDER BY a.account_id DESC`);
                if (client) {
                    client.end();
                }
                let list_Accountarray = list_Account && list_Account.rows ? list_Account.rows : [];
                if (list_Accountarray) {
                    return list_Accountarray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "listAccount");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Editload Account jwt 
module.exports.editloadAccountJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "editloadAccountJwt");
        throw new Error(error);
    }
}
//Editload Account
module.exports.editloadAccount = async (req) => {
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
            const { account_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const edit_Account = await client.query(`select a.account_id,a.city_id,a.state_id,a.company_code,a.company_name,a.email_id,a.area_name,a.street_name,a.gstin_number,a.mobile_number,a.whatsapp_number,a.telephone_number1,a.telephone_number2,a.pincode,a.reg_number,a.website,a.active_status,b.city_name,d.state_name from tbl_account_master as a inner join  tbl_def_city as b  on b.city_id=a.city_id inner join tbl_def_state as d on d.state_id=a.state_id where a.account_id = ` + account_id);
                const account_module = await client.query(`select a.account_id,a.account_module_id,a.module_id,b.module_name from tbl_account_module as a inner join tbl_def_modules as b on b.module_id=a.module_id where a.account_id = ` + account_id)
                if (client) {
                    client.end();
                }
                let edit_Accountarray = edit_Account && edit_Account.rows ? edit_Account.rows : [];
                let edit_Module_Array = account_module && account_module.rows ? account_module.rows : [];
                response_Array = {
                    "accountArray": edit_Accountarray, "moduleArray": edit_Module_Array
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "editloadAccount");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Delete Account jwt 
module.exports.deleteAccountJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "deleteAccountJwt");
        throw new Error(error);
    }
}
//Delete Account service
module.exports.deleteAccount = async (req) => {
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
            const { account_id, user_id } = decoded.data;
            if (decoded) {
                const patient_Count = await client.query(`select count(*) as count FROM tbl_patient `)
                var patient_Check = patient_Count && patient_Count.rows[0].count;
                if (patient_Check == 0 || patient_Check == '0') {
                await commonService.insertLogs(user_id, "Delete Account");
                const count = await client.query(`select count(*) as count FROM tbl_account_master where account_id =` + account_id)
                var count_Check = count && count.rows[0].count
                if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                    const result = await client.query(`UPDATE tbl_account_master SET active_status = $1 where account_id = $2 `, [-1, account_id]);
                    if (client) {
                        client.end();
                    }
                    let code = result && result.rowCount ? result.rowCount : 0;
                    if (code == 1) {
                        return response = { "message": constants.userMessage.USER_DELETED, "status": true }
                    }
                    else { return '' }
                }
              }
              else {
                return response = { "message": constants.userMessage.ALREADY_EXITS, "status": false }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "deleteAccount");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Get Account jwt 
module.exports.getAccountDetailsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "getAccountDetailsJwt");
        throw new Error(error);
    }
}
//Get Account  
module.exports.getAccountDetails = async (req) => {
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
            const { module_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const get_Account = await client.query(`select a.account_id,a.module_id,b.account_id,b.city_id,b.state_id,b.company_code,b.company_name,b.email_id,b.area_name,b.street_name,b.gstin_number,b.mobile_number,b.whatsapp_number,b.telephone_number1,b.telephone_number2,b.pincode,b.reg_number,b.website,c.city_name,d.state_name from tbl_account_module as a inner join tbl_account_master as b on a.account_id = b.account_id inner join  tbl_def_city as c  on b.city_id=c.city_id inner join tbl_def_state as d on d.state_id=b.state_id where a.module_id = $1 ORDER BY a.module_id DESC limit 1`, [module_id]);
                if (client) {
                    client.end();
                }
                let edit_Accountarray = get_Account && get_Account.rows ? get_Account.rows : [];

                response_Array = {
                    "accountArray": edit_Accountarray,
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "getAccountDetails");
        if (client) { client.end(); }
        throw new Error(error);
    }
}

//Get Account Module jwt 
module.exports.getAccountModuleJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "getAccountModuleJwt");
        throw new Error(error);
    }
}
//Get Account  Module 
module.exports.getAccountModule = async (req) => {
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
            const { account_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const count = await client.query(`select count(*) from tbl_account_module`);
                let max = count && count.rows[0].count
                if (max == 0) {
                    response_Array = await client.query(`select a.module_id,a.module_name from tbl_def_modules as a`);
                }
                else {
                    response_Array = await client.query(`select module_id,module_name from tbl_def_modules where module_id NOT IN (select a.module_id from tbl_account_module as a inner join tbl_account_master as b on a.account_id = b.account_id where a.account_id != $1 and b.active_status = 1 ) and active_status = 1 order by visibility_order `, [account_id]);
                }
                if (client) {
                    client.end();
                }
                let edit_modulearray = response_Array && response_Array.rows ? response_Array.rows : [];
                edit_modulearray = {
                    "getModuleArray": edit_modulearray,
                }
                if (edit_modulearray) {
                    return edit_modulearray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "getAccountModule");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Company Code checkJwt
module.exports.companyCodeCheckJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "companyCodeCheckJwt");
        throw new Error(error);
    }
}

module.exports.companyCodeCheck = async (req) => {
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
            const { account_id, company_code } = decoded.data;
            if (decoded) {
                var response_Array = {}
                var condition =` LOWER ("company_code") = LOWER ( ` + "'" + company_code + "')"
                const companycount = await client.query(`select count(*) as companycount FROM tbl_account_master where  account_id != ` + account_id + ` and ` + condition  )
                var companycount_Check = companycount && companycount.rows[0].companycount
               
                if (companycount_Check > 0 ) {
                    return response = { "message": constants.userMessage.DUPLICATE_CODE, "status": false }
                }
                if (client) {
                    client.end();
                }
                return response = { "message": constants.userMessage.UNIQUE_CODE, "status": true }
               
               
            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Account-Master", error, "companyCodeCheck");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}