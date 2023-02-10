const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService');
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//Get Consolidated Report Jwt
module.exports.getConsolidatedReportJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"ConsolidatedCashReport", error, "getConsolidatedReportJwt");
        throw new Error(error);
    }
}

//Get Consolidated Report 
module.exports.getConsolidatedReport = async (req) => {
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
            const { created_date, end_date} = decoded.data;
            if (decoded) {
                const ConsolidatedReport = await client.query(`select  a.employee_id,b.employee_name as doctor_name,
                COALESCE((select sum(cash_rate) from tbl_cash_transaction where module_id=2 and employee_id=a.employee_id and 
                          created_date >=$1 and  created_date <=$2 ),0) as consultant, 
                COALESCE((select sum(cash_rate) from tbl_cash_transaction where module_id=4 and employee_id=a.employee_id and
                          created_date >=$1 and  created_date <=$2),0) as Lab,  
                COALESCE((select sum(cash_rate) from tbl_cash_transaction where module_id=6 and employee_id=a.employee_id and
                          created_date >=$1 and  created_date <=$2),0) as EEG, 
                COALESCE((select sum(cash_rate) from tbl_cash_transaction where module_id=3 and employee_id=a.employee_id and
                          created_date >=$1 and  created_date <=$2),0) as ECG, 
               (select COALESCE(SUM(cash_rate),0) as total from tbl_cash_transaction where employee_id=a.employee_id and
                created_date >=$1 and  created_date <=$2) 
                from tbl_cash_transaction  as a 
                inner join tbl_employee_master as b on a.employee_id =b.employee_id 
                where a.created_date >=$1 and  a.created_date <=$2
                group by a.employee_id,b.employee_name`,[created_date,end_date]);
                if (client) {
                    client.end();
                }
                let ConsolidatedReportarray = ConsolidatedReport && ConsolidatedReport.rows ? ConsolidatedReport.rows : [];
                if (ConsolidatedReportarray) {
                    return ConsolidatedReportarray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"ConsolidatedCashReport", error, "getConsolidatedReport");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Detailed cash Report jwt Module 
module.exports.DetailedCashReportJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"DetailedCashReport", error, "DetailedCashReportJwt");
        throw new Error(error);
    }
}

//Detailed cash Report Module
module.exports.DetailedCashReport = async (req) => {
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
            const { created_date, end_date, module_id } = decoded.data;
            let DetailedCashReport =[],DetailedCashRegistration =[];
            if (decoded) {
                if(module_id == 9){
                    const DetailedRegistration = await client.query(`select d.patient_name,d.uhid,e.city_name,a.cash_rate as amount,a.created_date from tbl_cash_transaction as a inner join tbl_transaction as b on a.transaction_id=b.transaction_id inner join tbl_patient as d on b.patient_id=d.patient_id inner join tbl_def_city as e  on d.city_id=e.city_id  where a.created_date >=$1 and a.created_date <=$2 and a.module_id=$3`,[created_date,end_date,module_id]);
                    DetailedCashRegistration = DetailedRegistration && DetailedRegistration.rows ? DetailedRegistration.rows : [];
                   
                }
                else{
                    const DetailedReport = await client.query(`select d.patient_name,d.uhid,e.city_name,a.cash_rate as amount,c.employee_name as doctor_name,a.created_date from tbl_cash_transaction 
                    as a inner join tbl_transaction as b on a.transaction_id=b.transaction_id inner join tbl_employee_master as 
                    c on a.employee_id = c.employee_id inner join tbl_patient as d on b.patient_id=d.patient_id inner join tbl_def_city as e 
                    on d.city_id=e.city_id where a.created_date >=$1 and a.created_date <=$2 and a.module_id=$3`,[created_date,end_date,module_id]);
                    DetailedCashReport = DetailedReport && DetailedReport.rows ? DetailedReport.rows : [];
                }

                if (client) {
                    client.end();
                }
                if(module_id == 9){
                    if (DetailedCashRegistration) {
                        return DetailedCashRegistration;
                    }
                    else {
                        return '';
                    }
                }
                else{
                    if (DetailedCashReport) {
                        return DetailedCashReport;
                    }
                    else {
                        return '';
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"DetailedCashReport", error, "DetailedCashReport");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}