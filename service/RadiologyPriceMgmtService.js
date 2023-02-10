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

//Create radiology price jwt
module.exports.createRadiologyPriceJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"RadiologyPrice", error, "createRadiologyPriceJwt");
        throw new Error(error);
    }
}
//Create radiology price service
module.exports.createRadiologyPrice = async (req) => {
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
            const { radiology_price_id, radiology_id, radiology_part_id, price, user_id, active_status } = decoded.data;
            if (decoded) {
                var response = {}
                var createupdate_date = new Date().setHours(0, 0, 0, 0);
                const count_check = await client.query(`select count(*) from tbl_radiology_price where radiology_id =$1 and  radiology_part_id = $2`, [radiology_id, radiology_part_id])
                var count = count_check && count_check.rows[0].count
                if (count && count == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Radiology Price");
                    const maxprice = await client.query(`select coalesce(max(radiology_price_id),0) + 1 as priceid FROM tbl_radiology_price`)
                    var maxprice_id = maxprice && maxprice.rows[0].priceid;
                    const create_result = await client.query(`Insert into "tbl_radiology_price" ("radiology_price_id","radiology_id","radiology_part_id","price","user_id","maker_id","active_status","created_date") Values ($1,$2,$3,$4,$5,$6,$7,$8)`, [maxprice_id, radiology_id, radiology_part_id, price, user_id, makerid, active_status, createupdate_date])
                    if (client) {
                        client.end();
                    }
                    let create_radiology = create_result && create_result.rowCount ? create_result.rowCount : 0;
                    if (create_radiology == 1) {
                        response = { "message": constants.userMessage.USER_CREATED }
                        return response;
                    }
                    else { return '' }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Radiology Price");
                    const count = await client.query(`select count(*) as count FROM tbl_radiology_price where radiology_price_id =` + radiology_price_id)
                    var count_Check = count && count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`Update "tbl_radiology_price" set "radiology_id"=$1,"radiology_part_id"=$2,"price"=$3,"user_id"=$4,"maker_id"=$5,"active_status"=$6,"updated_date"=$7 Where "radiology_price_id" = $8`, [radiology_id, radiology_part_id, price, user_id, makerid, active_status, createupdate_date, radiology_price_id])
                        if (client) {
                            client.end();
                        }
                        let update_radiology = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (update_radiology == 1) {
                            response = { "message": constants.userMessage.USER_UPDATED }
                            return response;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"RadiologyPrice", error, "createRadiologyPrice");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Editload Radiology Price jwt 
module.exports.editloadRadiologyPriceJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"RadiologyPrice", error, "editloadRadiologyPriceJwt");
        throw new Error(error);
    }
}
//Editload Radiology Price service
module.exports.editloadRadiologyPrice = async (req) => {
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
            const { radiology_price_id } = decoded.data;
            var response_Array = {}
            if (decoded) {
                const editload_price = await client.query(`select a.radiology_price_id,a.radiology_id,a.radiology_part_id,a.price,a.active_status,b.radiology_name,b.dependency,c.radiology_part_name from tbl_radiology_price as a inner join tbl_def_radiology_type as b on a.radiology_id = b.radiology_id inner join tbl_def_radiology_parts as c on a.radiology_part_id = c.radiology_part_id where a.radiology_price_id =$1`, [radiology_price_id])
                var list_pricearray = editload_price && editload_price.rows ? editload_price.rows : [];
                response_Array = {
                    "RadiologyPrice": list_pricearray
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"RadiologyPrice", error, "editloadRadiologyPrice");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}


//List Radiology Price jwt 
module.exports.listRadiologyPriceJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"RadiologyPrice", error, "listRadiologyPriceJwt");
        throw new Error(error);
    }
}
//List Radiology Price service
module.exports.listRadiologyPrice = async (req) => {
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
            if (decoded) {
                const list_price = await client.query(`select a.radiology_price_id,a.radiology_id,a.radiology_part_id,a.price,a.active_status,b.radiology_name,b.dependency,c.radiology_part_name,d.status_name from tbl_radiology_price as a inner join tbl_def_radiology_type as b on a.radiology_id = b.radiology_id inner join tbl_def_radiology_parts as c on a.radiology_part_id = c.radiology_part_id inner join tbl_def_status as d on a.active_status = d.status_id `)
                var list_pricearray = list_price && list_price.rows ? list_price.rows : [];
                response_Array = {
                    "listRadiologyArray": list_pricearray
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"RadiologyPrice", error, "listRadiologyPrice");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
