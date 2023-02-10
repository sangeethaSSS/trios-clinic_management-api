const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService');
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create Unitofmeasure jwt 
module.exports.createUnitmeasureJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"UnitofMeasure", error, "createUnitmeasureJwt");
        throw new Error(error);
    }
}
//create Unitofmeasure service
module.exports.createUnitmeasure = async (req) => {
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
            const { unit_id, unit_name, active_status, user_id } = decoded.data;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            if (decoded) {
                if (unit_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Unitmeasure");
                    const max = await client.query(`select coalesce(max(unit_id),0) + 1 as mr FROM tbl_unit_master`)
                    var maxunit = max && max.rows[0].mr;
                    const result = await client.query(`INSERT INTO tbl_unit_master ("unit_id","unit_name","active_status","user_id","maker_id","created_date") values ($1, $2, $3,$4,$5,$6) `, [maxunit, unit_name, active_status, user_id, makerid, createupdate_date]);
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
                    var makerid = await commonService.insertLogs(user_id, "Update Unitmeasure");
                    const count = await client.query(`select count(*) as count FROM tbl_unit_master where unit_id =` + unit_id)
                    var count_Check = count && count.rows[0].count

                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_unit_master" set "unit_name"=$1,"active_status"=$2,"user_id"=$3,"maker_id"=$4,"updated_date"=$5
                         where "unit_id" = $6 `, [unit_name, active_status, user_id, makerid, createupdate_date, unit_id]);

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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"UnitofMeasure", error, "createUnitmeasure");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//List Unit of measure List
module.exports.listUnitmeasureJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"UnitofMeasure", error, "listUnitmeasureJwt");
        throw new Error(error);
    }
}
//List Unit of measure List
module.exports.listUnitmeasure = async (req) => {
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
                const list_Unitmeasure = await client.query(`
                select a.unit_id,a.unit_name,a.user_id,a.active_status,b.status_name from tbl_unit_master as a 
 inner join tbl_def_status as b on a.active_status=b.status_id ORDER BY unit_id DESC`);
                if (client) {
                    client.end();
                }
                let list_Unitmeasurearray = list_Unitmeasure && list_Unitmeasure.rows ? list_Unitmeasure.rows : [];
                if (list_Unitmeasurearray) {
                    return list_Unitmeasurearray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"UnitofMeasure", error, "listUnitmeasure");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Edit Unitmeasure  jwt 
module.exports.editloadUnitmeasureJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"UnitofMeasure", error, "editloadUnitmeasureJwt");
        throw new Error(error);
    }
}
//Edit Unitmeasure 
module.exports.editloadUnitmeasure = async (req) => {
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
            const { unit_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const edit_Unitmeasure = await client.query(`select a.unit_id,a.user_id,a.unit_name,a.active_status,b.status_name from tbl_unit_master as a 
                inner join tbl_def_status as b on a.active_status=b.status_id where unit_id= ` + unit_id);
                if (client) {
                    client.end();
                }
                let edit_Unitmeasurearray = edit_Unitmeasure && edit_Unitmeasure.rows ? edit_Unitmeasure.rows : [];
                response_Array = {
                    "unitmeasureArray": edit_Unitmeasurearray,
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"UnitofMeasure", error, "editloadUnitmeasure");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Delete Unitmeasure jwt 
module.exports.deleteUnitmeasureJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"UnitofMeasure", error, "deleteUnitmeasureJwt");
        throw new Error(error);
    }
}
//Delete Unitmeasure service
module.exports.deleteUnitmeasure = async (req) => {
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
            const { unit_id, user_id } = decoded.data;
            if (decoded) {
                await commonService.insertLogs(user_id, "Delete Unitmeasure");
                const count = await client.query(`select count(*) as count FROM tbl_unit_master where unit_id =` + unit_id)
                var count_Check = count && count.rows[0].count
                if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                    const result = await client.query(`DELETE FROM tbl_unit_master where unit_id=$1 `, [unit_id]);
                    if (client) {
                        client.end();
                    }
                    let code = result && result.rowCount ? result.rowCount : 0;
                    if (code == 1) {
                        return constants.userMessage.USER_DELETED
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"UnitofMeasure", error, "deleteUnitmeasure");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}