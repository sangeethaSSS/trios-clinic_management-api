const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService');
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create Drug jwt 
module.exports.createDrugJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug", error, "createDrugJwt");
        throw new Error(error);
    }
}
//create Drug service
module.exports.createDrug = async (req) => {
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
            const { DrugArray, user_id, active_status,display_flag } = decoded.data;
            if (DrugArray && DrugArray.length > 0) {

                var insert_array = DrugArray.filter(e => e.isaddflag == 1)
                if (insert_array && insert_array.length > 0) {

                    for (let i = 0; i < insert_array.length; i++) {
                        let company_name = insert_array[i].medicine_company_name.trim();
                        const count_check = await client.query(`select count(*) as max from tbl_medicine_company_master where lower(medicine_company_name) = lower($1)`, [company_name])
                        const company_count = count_check && count_check.rows[0].max

                        if (company_count == 0) {
                            const maxcompany = await client.query(`select coalesce(max(medicine_company_id),0) + 1 as mr FROM tbl_medicine_company_master`)
                            maxcompany_Check = maxcompany && maxcompany.rows[0].mr;

                            await client.query(`INSERT INTO "tbl_medicine_company_master" (medicine_company_id,medicine_company_name,active_status) values ($1,Upper($2),$3) `, [maxcompany_Check, insert_array[i].medicine_company_name, 1]);
                        }
                        else {
                            const count_check = await client.query(`select medicine_company_id from tbl_medicine_company_master where lower(medicine_company_name) = lower($1)`, [company_name])
                            const company_id = count_check && count_check.rows[0].medicine_company_id
                            maxcompany_Check = company_id
                        }
                        var makerid = await commonService.insertLogs(user_id, "Insert Drug");
                        const max = await client.query(`select coalesce(max(drug_id),0) + 1 as max from tbl_drug_master`)
                        const max_id = max && max.rows[0].max


                        const Create_Drug = await client.query(`Insert into tbl_drug_master (drug_id,drug_name,salt_name,medicine_company_id,user_id,maker_id,active_status,display_flag,created_date) values ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)`, [max_id, insert_array[i].drug_name, insert_array[i].salt_name, maxcompany_Check, user_id, makerid, active_status,display_flag])

                        const create_code = Create_Drug && Create_Drug.rowCount ? this.createDrug.rowCount : 0
                        console.log(create_code, "create_code")
                    }
                }

                var update_array = DrugArray.filter(e => e.isaddflag == 2)
                if (update_array && update_array.length > 0) {
                    var update_code = 0
                    for (let i = 0; i < update_array.length; i++) {
                        let company_name = update_array[i].medicine_company_name.trim();
                        const count_check = await client.query(`select count(*) as max from tbl_medicine_company_master where lower(medicine_company_name) = lower($1)`, [company_name])
                        const company_count = count_check && count_check.rows[0].max

                        if (company_count == 0) {
                            const maxcompany = await client.query(`select coalesce(max(medicine_company_id),0) + 1 as mr FROM tbl_medicine_company_master`)
                            maxcompany_Check = maxcompany && maxcompany.rows[0].mr;

                            await client.query(`INSERT INTO "tbl_medicine_company_master" (medicine_company_id,medicine_company_name,active_status) values ($1,Upper($2),$3) `, [maxcompany_Check, update_array[i].medicine_company_name, 1]);
                        }
                        else {
                            const count_check = await client.query(`select medicine_company_id from tbl_medicine_company_master where lower(medicine_company_name) = lower($1)`, [company_name])
                            const company_id = count_check && count_check.rows[0].medicine_company_id
                            maxcompany_Check = company_id
                        }
                        var makerid = await commonService.insertLogs(user_id, "Update Drug");

                        const update_drug = await client.query(`update tbl_drug_master set drug_name=$1,salt_name=$2,active_status=$3,user_id=$4,maker_id=$5,medicine_company_id = $6,updated_date = CURRENT_TIMESTAMP WHERE drug_id = $7`, [update_array[i].drug_name, update_array[i].salt_name, active_status, user_id, makerid, maxcompany_Check, update_array[i].drug_id])

                        update_code = update_drug && update_drug.rowCount ? update_drug.rowCount : 0;
                        console.log(update_code, "update_code")
                    }
                }

                var delete_array = DrugArray.filter(e => e.isaddflag == 3)
                if (delete_array && delete_array.length > 0) {
                    for (let i = 0; i < delete_array.length; i++) {
                        const Delete_drug = await client.query(`DELETE FROM tbl_drug_master where drug_id=` + delete_array[i].drug_id)
                        let Delete_code = Delete_drug && Delete_drug.rowCount ? Delete_drug.rowCount : 0;
                        console.log(Delete_code, 'Delete_code')
                    }
                }

                if (update_code === 1) {
                    return response = { "message": constants.userMessage.USER_UPDATED, "status": true }
                }
                else {
                    return response = { "message": constants.userMessage.USER_CREATED, "status": true }
                }
            }
        }
        else {
            if (client) { client.end(); }
        }
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug", error, "createDrug");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//List Drug Jwt
module.exports.listDrugJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug", error, "listDrugJwt");
        throw new Error(error);
    }
}
//List Drug
module.exports.listDrug = async (req) => {
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
            const { offset, pagesize, search_value, active_status } = decoded.data;
            if (decoded) {
                var search = (search_value != '') ? (`Lower(a.drug_name) like '%` + search_value + `%' OR Lower(a.salt_name) like '%` + search_value + `%'  OR  Lower(b.medicine_company_name) like '%` + search_value + `%'`) : '1=1'

                var taken_active_status= (active_status == -1) ? '1=1' : 'a.active_status=' + active_status;

                const list_drug = await client.query(`select a.drug_id,a.drug_name,a.salt_name,a.medicine_company_id,b.medicine_company_name,a.active_status,c.status_name from tbl_drug_master as a inner join tbl_medicine_company_master as b on a.medicine_company_id = b.medicine_company_id inner join tbl_def_status as c on a.active_status = c.status_id WHERE ` + taken_active_status +` AND `+ search +`  order by a.drug_id desc OFFSET $1 LIMIT $2`, [offset, pagesize])

                const counts = await client.query(`select count(*) from (select a.drug_id,a.drug_name,a.salt_name,a.medicine_company_id,b.medicine_company_name,a.active_status,c.status_name from tbl_drug_master as a inner join tbl_medicine_company_master as b on a.medicine_company_id = b.medicine_company_id inner join tbl_def_status as c on a.active_status = c.status_id WHERE ` + taken_active_status +` AND `+ search +`  order by a.drug_id desc)  total_count`)

                const totalvalue = await client.query('select count(*) as count from tbl_drug_master');
                var total_Count = totalvalue && totalvalue.rows[0].count ? totalvalue.rows[0].count : 0
                var Count = counts && counts.rows[0].count ? counts.rows[0].count : 0
                if (client) {
                    client.end();
                }

                const Drug_List = list_drug && list_drug.rows ? list_drug.rows : []
                if (Drug_List) {
                    return response_Array={"DrugList":Drug_List,"TotalCount":total_Count,"Counts":Count};
                }
                else {
                    return '';
                }
            }
            else {
                if (client) { client.end(); }
            }
        }
        else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug_Master", error, "listDrug");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//edit Drug Jwt
module.exports.editDrugJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Edit Drug", error, "editDrugJwt");
        throw new Error(error);
    }
}
//edit Drug
module.exports.editDrug = async (req) => {
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
                const { drug_id } = decoded.data;
                const edit_drug = await client.query(`select a.drug_id,a.drug_name,a.salt_name,a.medicine_company_id,b.medicine_company_name,a.active_status,c.status_name from tbl_drug_master as a inner join tbl_medicine_company_master as b on a.medicine_company_id = b.medicine_company_id inner join tbl_def_status as c on a.active_status = c.status_id where a.drug_id = $1`, [drug_id])

                if (client) {
                    client.end();
                }

                const editdrug_List = edit_drug && edit_drug.rows ? edit_drug.rows : []
                if (editdrug_List) {
                    return editdrug_List;
                }
                else {
                    return '';
                }
            }
            else {
                if (client) { client.end(); }
            }
        }
        else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug_Master", error, "listDrug");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Delete Drug jwt 
module.exports.deleteDrugJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug", error, "deleteDrugJwt");
        throw new Error(error);
    }
}
//Delete Drug service
module.exports.deleteDrug = async (req) => {
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
            const { drug_id, user_id } = decoded.data;
            if (decoded) {
                await commonService.insertLogs(user_id, "Delete Drug");
                const count = await client.query(`select count(*) as count FROM tbl_drug_master where drug_id =` + drug_id)
                var count_Check = count && count.rows[0].count
                if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                    const result = await client.query(`DELETE FROM tbl_drug_master where drug_id=$1 `, [drug_id]);
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
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug", error, "deleteDrugJwt");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//onchange List Jwt
module.exports.onchangeListJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug", error, "onchangeListJwt");
        throw new Error(error);
    }
}
//onchange List
module.exports.onchangeList = async (req) => {
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
                const medicine_companymaster = await client.query(`select medicine_company_id,medicine_company_name from tbl_medicine_company_master where active_status = 1`)

                const salt_array = await client.query(`select distinct salt_name from tbl_drug_master where active_status = 1`)

                if (client) {
                    client.end();
                }
                let medicine_company_Array = medicine_companymaster && medicine_companymaster.rows ? medicine_companymaster.rows : [];
                let salt_list = salt_array && salt_array.rows ? salt_array.rows : [];
                responseData = {
                    "Medicine_CompanyMaster": medicine_company_Array, "saltList": salt_list
                }
                if (responseData) {
                    return responseData;
                }
                else {
                    return '';
                }
            }
            else {
                if (client) { client.end(); }
            }
        }
        else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug_Master", error, "onchangeListJwt");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Import Drug jwt 
module.exports.importDrugJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug", error, "importDrugJwt");
        throw new Error(error);
    }
}
//Import Drug service
module.exports.importDrug = async (req) => {
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
            const { ImportDrugArray, user_id, active_status,display_flag } = decoded.data;
            var insert_array = ImportDrugArray
            if (insert_array && insert_array.length > 0) {

                await client.query(`DELETE FROM tbl_drug_master where display_flag = 1`)

                for (let i = 0; i < insert_array.length; i++) {
                    let company_name = insert_array[i].Company.trim();
                    const count_check = await client.query(`select count(*) as max from tbl_medicine_company_master where lower(medicine_company_name) = lower($1)`, [company_name])
                    const company_count = count_check && count_check.rows[0].max

                    if (company_count == 0) {
                        const maxcompany = await client.query(`select coalesce(max(medicine_company_id),0) + 1 as mr FROM tbl_medicine_company_master`)
                        maxcompany_Check = maxcompany && maxcompany.rows[0].mr;

                        await client.query(`INSERT INTO "tbl_medicine_company_master" (medicine_company_id,medicine_company_name,active_status) values ($1,Upper($2),$3) `, [maxcompany_Check, insert_array[i].Company, 1]);
                    }
                    else {
                        const count_check = await client.query(`select medicine_company_id from tbl_medicine_company_master where lower(medicine_company_name) = lower($1)`, [company_name])
                        const company_id = count_check && count_check.rows[0].medicine_company_id
                        maxcompany_Check = company_id
                    }
                    var makerid = await commonService.insertLogs(user_id, "Insert Drug");
                    const max = await client.query(`select coalesce(max(drug_id),0) + 1 as max from tbl_drug_master`)
                    const max_id = max && max.rows[0].max

                    const update_drug = await client.query(`Insert into tbl_drug_master (drug_id,drug_name,salt_name,medicine_company_id,user_id,maker_id,active_status,display_flag,created_date) values ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)`, [max_id, insert_array[i].Name, insert_array[i].Salt, maxcompany_Check, user_id, makerid, active_status,display_flag])

                    var update_code = update_drug && update_drug.rowCount ? update_drug.rowCount : 0;
                    console.log(update_code, "create_code")
                }

                if (update_code === 1) {
                    return response = { "message": constants.userMessage.USER_CREATED, "status": true }
                }
            }
        }
        else {
            if (client) { client.end(); }
        }
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Drug", error, "importDrugJwt");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}