const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService');
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create Patient jwt 
module.exports.createPatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "createPatientJwt");
        throw new Error(error);
    }
}
//create Patient service
module.exports.createPatient = async (req) => {
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
            var response = {}
            const decoded = await commonService.jwtVerify(req.jwtToken);
            const { patient_id, patient_name, patient_code, guardian_name, gender_id, date_of_birth, blood_group_id, street_name, area_name, city_id, pincode, state_id, mobile_number, aadhar_number, occupation, dob_type, clinical_photography, uhid, age_year, age_month, age_day, drug_allergy, user_id, active_status, disease_history, other_history, city_name, tag_id, refered_by, module_id,reason_visit,treatment_undergone,old_patient_id } = decoded.data;
            var getAccountId = await commonService.getAccountId(module_id);
            var account_id = getAccountId.account_id;
            var account_status = getAccountId.status
            var account_message = getAccountId.message
            var voucherid = await commonService.getVoucherId(module_id);
            var voucher_id = voucherid.voucher_id;
            var voucher_status = voucherid.status;
            var voucher_message = voucherid.message;
            var financial_year_id = voucherid.financial_year_id;
            if (decoded) {

                var maxCity_Check = 0, uhid_Insert = 0, registration_Fee = 0;
                const createUhid = await client.query(`select a.company_code||to_char(now(),'YY')||to_char(now(),'MM')||(LPAD((select  coalesce (max(patient_id),0) + 1 as ref from tbl_patient)::text,4,'0'))
                as uhid from tbl_account_master as a  inner join tbl_account_module as b on a.account_id = b.account_id
                where b.module_id = 1`)
                if (createUhid.rows.length > 0) {
                    uhid_Insert = createUhid && createUhid.rows[0].uhid;
                }
                else {
                    uhid_Insert = uhid
                }

                const registration_fee = await client.query(`select registration_fee from tbl_control_panel_setting`)
                if (registration_fee.rows.length > 0) {
                    registration_Fee = registration_fee && registration_fee.rows[0].registration_fee;
                }
                else {
                    registration_Fee = 0
                }
                const maxcity = await client.query(`select coalesce(max(city_id),0) + 1 as mr FROM tbl_def_city`)
                maxCity_Check = maxcity && maxcity.rows[0].mr;
                if (city_id == 0) {
                    await client.query(`INSERT INTO "tbl_def_city"("city_id","city_name","active_status") values ($1,Upper($2),$3) `, [maxCity_Check, city_name, 1]);
                }
                else { maxCity_Check = city_id }
                const duplicated_check = await client.query(`select count(*) from tbl_patient where lower(old_patient_id) = lower($1)and patient_id != $2 `,[old_patient_id,patient_id])
               
                var old_patient_check = duplicated_check && duplicated_check.rows[0].count
                if(old_patient_check === 0 || old_patient_check === '0') {
                if (patient_id == 0) {
                    if (account_status == true) {
                        if (voucher_status == true) {
                            var makerid = await commonService.insertLogs(user_id, "Insert Patient");
                            const max = await client.query(`select coalesce(max(patient_id),0) + 1 as mr FROM tbl_patient`)
                            var maxpatient = max && max.rows[0].mr;
                            const maxtransaction = await client.query(`select coalesce(max(transaction_id),0) + 1 as transaction FROM tbl_transaction`);
                            var maxtransaction_id = maxtransaction && maxtransaction.rows[0].transaction;
                            
                            const create_result = await client.query(`INSERT INTO "tbl_patient"("patient_id","patient_name","patient_code","guardian_name","gender_id","date_of_birth","blood_group_id","street_name","area_name","city_id","pincode","state_id","mobile_number","aadhar_number","occupation","dob_type","clinical_photography","uhid","age_year","age_month","age_day","drug_allergy","active_status","maker_id","user_id","tag_id","refered_by","reason_visit","treatment_undergone","old_patient_id","created_date") values ($1, Upper($2),$3,Upper($4),$5,$6,$7,initcap($8),initcap($9),$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,CURRENT_TIMESTAMP) `, [maxpatient, patient_name, patient_code, guardian_name, gender_id, date_of_birth, blood_group_id, street_name, area_name, maxCity_Check, pincode, state_id, mobile_number, aadhar_number, occupation, dob_type, clinical_photography, uhid_Insert, age_year, age_month, age_day, drug_allergy, active_status, makerid, user_id,tag_id, refered_by,reason_visit,treatment_undergone,old_patient_id]);

                            var start_timedate = new Date().getTime();
                            const create_result1 = await client.query(`INSERT INTO "tbl_transaction"("transaction_id","patient_id","module_id","paymentstatus_id","total_amount","active_status","maker_id","user_id","ref_no","created_time","account_id","voucher_no","financial_year_id","created_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CURRENT_TIMESTAMP)`, [maxtransaction_id, maxpatient, module_id, 2, registration_Fee, 1, makerid, user_id, maxpatient, start_timedate, account_id, voucher_id, financial_year_id]);
                            let create_patient1 = create_result1 && create_result1.rowCount ? create_result1.rowCount : 0;

                            if (disease_history && disease_history.length > 0) {
                                for (let i = 0; i < disease_history.length; i++) {
                                    const disease_max = await client.query(`select coalesce (max(disease_id),0) + 1 as mr FROM tbl_disease_history`)
                                    var patient_disease_max = disease_max && disease_max.rows[0].mr;
                                    const intake_result = await client.query(`INSERT INTO "tbl_disease_history"("disease_id","patient_id","treatment_id","disease_details","user_id","created_date") values ($1, $2, $3, $4, $5,CURRENT_TIMESTAMP) `, [patient_disease_max, maxpatient, disease_history[i].treatment_id, disease_history[i].details, user_id]);
                                    let Disease_code = intake_result && intake_result.rowCount ? intake_result.rowCount : 0;
                                }
                            }
                            if (other_history && other_history.length > 0) {
                                for (let i = 0; i < other_history.length; i++) {
                                    const history_max = await client.query(`select coalesce (max(patient_details_id),0) + 1 as mr FROM tbl_patient_other_details`)
                                    var other_history_max = history_max && history_max.rows[0].mr;
                                    const history_result = await client.query(`INSERT INTO "tbl_patient_other_details"("patient_details_id","patient_id","details_id","patient_details_name","user_id","created_date") values ($1, $2, $3, $4, $5,CURRENT_TIMESTAMP) `, [other_history_max, maxpatient, other_history[i].details_id, other_history[i].details,user_id]);
                                    let history_code = history_result && history_result.rowCount ? history_result.rowCount : 0;
                                }
                            }
                            let create_patient = create_result && create_result.rowCount ? create_result.rowCount : 0;
                            if (client) {
                                client.end();
                            }
                            if (create_patient == 1) {
                                response = { "patient_id": maxpatient, "message": constants.userMessage.USER_CREATED ,"status_flag" : 0 }
                                return response;
                            }
                            else { return '' }
                        }
                        else {
                            return message = { "message": voucher_message, "status": voucher_status, "status_flag" : 2 }
                        }
                    }
                    else {
                        return message = { "message": account_message, "status": account_status, "status_flag" : 2 }
                    }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Patient");
                    const count = await client.query(`select count(*) as count FROM tbl_patient where patient_id =` + patient_id)
                    var count_Check = count && count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_patient" set "patient_name"= Upper($1), "patient_code"=$2,"guardian_name"= Upper($3),"gender_id"=$4,"date_of_birth"=$5,"blood_group_id"=$6,"street_name"=initcap($7),"area_name"=initcap($8),"city_id"=$9,"pincode"=$10,"state_id"=$11,"mobile_number"=$12,"aadhar_number"=$13,"occupation"=$14,"dob_type"=$15,"clinical_photography"=$16,"uhid"=$17,"age_year"=$18,"age_month"=$19,"age_day"=$20,"drug_allergy"=$21,"active_status"=$22,"maker_id"=$23,"user_id"=$24,"tag_id"=$25,"refered_by"=$26, "reason_visit"=$27,"treatment_undergone"=$28,"old_patient_id"=$29,"updated_date"= CURRENT_TIMESTAMP where "patient_id" = $30 `, [patient_name, patient_code, guardian_name, gender_id, date_of_birth, blood_group_id, street_name, area_name, maxCity_Check, pincode, state_id, mobile_number, aadhar_number, occupation, dob_type, clinical_photography, uhid, age_year, age_month, age_day, drug_allergy, active_status, makerid, user_id,tag_id, refered_by,reason_visit,treatment_undergone,old_patient_id,patient_id]);

                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;

                        await client.query(`DELETE FROM tbl_disease_history where patient_id=` + patient_id)
                        
                        if (disease_history && disease_history.length > 0) {
                            for (let i = 0; i < disease_history.length; i++) {
                                const disease_max = await client.query(`select coalesce (max(disease_id),0) + 1 as mr FROM tbl_disease_history`)
                                var patient_disease_max = disease_max && disease_max.rows[0].mr;
                                const intake_result = await client.query(`INSERT INTO "tbl_disease_history"("disease_id","patient_id","treatment_id","disease_details","user_id","created_date") values ($1, $2, $3, $4, $5,CURRENT_TIMESTAMP) `, [patient_disease_max, patient_id, disease_history[i].treatment_id, disease_history[i].details, user_id]);
                                let Disease_code = intake_result && intake_result.rowCount ? intake_result.rowCount : 0;
                            }
                        }
                    
                        await client.query(`DELETE FROM tbl_patient_other_details where patient_id=` + patient_id)

                        if (other_history && other_history.length > 0) {
                            for (let i = 0; i < other_history.length; i++) {
                                const history_max = await client.query(`select coalesce (max(patient_details_id),0) + 1 as mr FROM tbl_patient_other_details`)
                                var other_history_max = history_max && history_max.rows[0].mr;
                                const history_result = await client.query(`INSERT INTO "tbl_patient_other_details"("patient_details_id","patient_id","details_id","patient_details_name","user_id","created_date") values ($1, $2, $3, $4, $5,CURRENT_TIMESTAMP) `, [other_history_max, patient_id, other_history[i].details_id, other_history[i].details,user_id]);
                                let history_code = history_result && history_result.rowCount ? history_result.rowCount : 0;
                            }
                        }
                        
                        if (client) {
                            client.end();
                        }
                        if (update_code == 1) {
                            response = { "patient_id": patient_id, "message": constants.userMessage.USER_UPDATED , "status_flag" : 0 }
                            return response;
                        }
                        else { return '' }
                    }
                }
            } else {
                return message = { "message": constants.userMessage.DUPLICATE_OLDID, "status": false ,"status_flag" : 1 }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "createPatient");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Delete Patient jwt 
module.exports.deletePatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "deletePatientJwt");
        throw new Error(error);
    }
}
//Delete Patient service
module.exports.deletePatient = async (req) => {
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
            const { patient_id, user_id } = decoded.data;
            if (decoded) {
                var response = {}
                await commonService.insertLogs(user_id, "Delete Patient");
                const appointmentcount = await client.query(`select count(*) as appointmentcount FROM tbl_appointment where patient_id =` + patient_id)
                var appointment_Check = appointmentcount && appointmentcount.rows[0].appointmentcount
                if (appointment_Check > 0) {
                    return response = { "message": constants.userMessage.PATIENT_NAME_CHECK, "status": false }
                }
                else {
                    const patient_Count = await client.query(`select count(*) as count FROM tbl_patient where patient_id =` + patient_id)
                    var count_Check = patient_Count && patient_Count.rows[0].count;
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        await client.query(`DELETE FROM tbl_patient_other_details where patient_id = $1 `, [patient_id]);
                        await client.query(`DELETE FROM tbl_disease_history where patient_id = $1 `, [patient_id]);
                        const delete_result = await client.query(`DELETE FROM tbl_patient where patient_id = $1 `,
                            [patient_id]);
                        if (client) {
                            client.end();
                        }
                        let patientcode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
                        if (patientcode == 1) {
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "deletePatient");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//List Patient jwt 
module.exports.listPatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "listPatientJwt");
        throw new Error(error);
    }
}
//List Patient List
module.exports.listPatient = async (req) => {
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
            const { user_id, offset, pagesize, search_value, gender_id, city_id, active_status } = decoded.data;
            
            if (decoded) {
                var response_Array = {}
                var taken_gender_id= (gender_id == -1) ? '1=1' : 'a.gender_id='+gender_id;
                var taken_city_id= (city_id == -1) ? '1=1' : 'a.city_id='+city_id;
                var taken_active_status= (active_status == -1) ? '1=1' : 'a.active_status='+active_status;
                var search = (search_value != '') ? (`Lower(a.patient_name) like '%`+search_value+`%' OR a.mobile_number like '%`+search_value+`%' OR a.uhid::text like '%`+search_value+`%' OR  Lower(a.guardian_name) like '%`+search_value+`%' OR Lower(b.gender_name) like '%`+search_value+`%' OR  Lower(e.city_name) like '%`+search_value+`%' OR  Lower(a.old_patient_id) like '%`+search_value+`%'`) : '1=1'
                const list_Patient = await client.query(`SELECT a.patient_id,a.patient_name,a.guardian_name,a.gender_id,a.street_name,a.area_name,a.pincode,a.old_patient_id,a.date_of_birth,a.refered_by,a.occupation,a.aadhar_number,a.drug_allergy,a.blood_group_id, a.age_day,a.age_month,a.age_year,a.dob_type,a.active_status,a.city_id,a.mobile_number,a.tag_id,f.display_code, a.uhid,a.created_date,b.gender_name,c.blood_group_name,d.status_name,e.city_name,f.tag_name, case when (select count(patient_id) from tbl_appointment where patient_id=a.patient_id) > 0 then 0 else 1 end as deleteflag from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_blood_group as c on a.blood_group_id=c.blood_group_id inner join tbl_def_status as d on a.active_status = d.status_id inner join tbl_def_city as e on a.city_id = e.city_id inner join tbl_def_tag as f on a.tag_id = f.tag_id  WHERE `+taken_gender_id+` AND `+taken_city_id+` AND ` +taken_active_status+` AND `+search+` ORDER BY a.patient_id DESC OFFSET $1 LIMIT $2 ;`,[offset,pagesize]);

                //FOR TAKING ROW COUNT
                const counts =await client.query(`select count(*) from (SELECT a.patient_id,a.patient_name, a.guardian_name,a.gender_id,a.date_of_birth,a.drug_allergy,a.blood_group_id,
                a.age_day,a.age_month,a.age_year,a.dob_type,a.active_status,a.city_id,a.mobile_number,a.tag_id,f.display_code, a.uhid,a.created_date,b.gender_name,c.blood_group_name,d.status_name,e.city_name,f.tag_name, case when (select count(patient_id) from tbl_appointment where patient_id=a.patient_id) > 0 then 0 else 1 end as deleteflag from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_blood_group as c on a.blood_group_id=c.blood_group_id inner join tbl_def_status as d on a.active_status = d.status_id inner join tbl_def_city as e on a.city_id = e.city_id inner join tbl_def_tag as f on a.tag_id = f.tag_id  WHERE `+taken_gender_id+` AND `+taken_city_id+` AND `+taken_active_status+` AND `+search+` ORDER BY a.patient_id DESC) total_count`);
                
                
                const totalvalue = await client.query('select count(*) as count from tbl_patient');
                const malevalue = await client.query('select count(*) as count from tbl_patient where gender_id = 1')
                const femalevalue = await client.query('select count(*) as count from tbl_patient where gender_id = 2')
                const othervalue = await client.query('select count(*) as count from tbl_patient where gender_id = 3')
                const medical_condition = await client.query(`select a.patient_id,string_agg(distinct  c.clinical_history_details, ',') as medical_condition from tbl_patient as a inner join tblmedicine_clinicalhistory as b on a.patient_id = b.patient_id inner join tbl_def_clinical_history as c on b.clinical_history_id = c.clinical_history_id group by a.patient_id`)
                if (client) {
                    client.end();
                }
                var list_Patientarray = list_Patient && list_Patient.rows ? list_Patient.rows : [];
                var total_Count = totalvalue && totalvalue.rows[0].count ? totalvalue.rows[0].count : 0
                var male_Count = malevalue && malevalue.rows[0].count ? malevalue.rows[0].count : 0
                var female_Count = femalevalue && femalevalue.rows[0].count ? femalevalue.rows[0].count : 0
                var other_Count = othervalue && othervalue.rows[0].count ? othervalue.rows[0].count : 0
                var medical_conditions = medical_condition && medical_condition.rows ? medical_condition.rows : []
                var Count = counts && counts.rows[0].count ? counts.rows[0].count : 0

                response_Array = {
                    "patientArray": list_Patientarray, "total_Count": total_Count, "male_Count": male_Count, "female_Count": female_Count, "other_Count": other_Count, "medical_conditions":medical_conditions,
                    "Counts":Count
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "listPatient");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Edit Patient jwt 
module.exports.editloadPatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "editloadPatientJwt");
        throw new Error(error);
    }
}
//Edit Patient List
module.exports.editloadPatient = async (req) => {
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
                var response_Array = {}
                const edit_Patient = await client.query(`select a.patient_id,a.patient_name,a.patient_code,a.guardian_name,a.gender_id,a.date_of_birth,a.blood_group_id,a.street_name,a.area_name,a.active_status,a.city_id,a.pincode,a.state_id,a.mobile_number,a.aadhar_number,a.occupation,a.uhid,a.created_date,a.dob_type,a.clinical_photography,a.age_year,a.age_month,a.age_day,a.drug_allergy,a.old_patient_id,a.tag_id,h.display_code,a.reason_visit,a.treatment_undergone,a.refered_by,b.gender_name,h.tag_name,c.blood_group_name,d.status_name,e.city_name,f.state_name from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_blood_group as c on a.blood_group_id=c.blood_group_id inner join tbl_def_status as d on a.active_status = d.status_id inner join tbl_def_city as e on a.city_id =e.city_id inner join tbl_def_state as f on a.state_id = f.state_id inner join tbl_def_tag as h on a.tag_id = h.tag_id where a.patient_id = ` + patient_id);

                const other_Details = await client.query(`select a.patient_details_id,a.patient_id,a.details_id,a.patient_details_name, b.details_name from tbl_patient_other_details  as a inner join tbl_def_other_details as b on a.details_id = b.details_id where patient_id = $1`, [patient_id])

                const disease_Details = await client.query(`select a.disease_id,a.patient_id,a.treatment_id,a.disease_details,b.treatment_name from tbl_disease_history as a inner join tbl_def_treatment as b on a.treatment_id = b.treatment_id 
               where patient_id = $1`, [patient_id])

                const reason_Details = await client.query(`SELECT coalesce(string_agg(a.reason_name,', '), '' ) as reason_name from tbl_def_reason_purpose as a where a.reason_id in (SELECT cast(unnest(string_to_array(reason_visit, ',')) as integer) from tbl_patient where patient_id = $1)`, [patient_id])

                const clinicalhistory_Details = await client.query(`SELECT coalesce(string_agg(a.clinical_history_details,', '),'') as clinical_history_details from tbl_def_clinical_history as a where a.clinical_history_id in (SELECT cast(unnest(string_to_array(treatment_undergone, ',')) as integer) from tbl_patient where patient_id = $1)`, [patient_id])

                if (client) {
                    client.end();
                }
                let edit_Patientarray = edit_Patient && edit_Patient.rows ? edit_Patient.rows : [];
                let other_Detailsarray = other_Details && other_Details.rows ? other_Details.rows : [];
                let disease_Detailsarray = disease_Details && disease_Details.rows ? disease_Details.rows : [];
                let reason_Detailsarray = reason_Details && reason_Details.rows[0].reason_name ? reason_Details.rows : [];
                let clinicalhistory_array = clinicalhistory_Details && clinicalhistory_Details.rows[0].clinical_history_details ? clinicalhistory_Details.rows : [];
                response_Array = {
                    "PatientArray": edit_Patientarray,"OtherDetails": other_Detailsarray, "DiseaseDetails": disease_Detailsarray, "ReasonDetails": reason_Detailsarray, "ClinicalHistory": clinicalhistory_array
                }
                if (response_Array) {
                    return response_Array;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "editloadPatient");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Uhid Patient Jwt
module.exports.getUHIDJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "getUHIDJwt");
        throw new Error(error);
    }
}

//Uhid Patient
module.exports.getUHID = async (req) => {
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
                var response_Array = {}
                const getUHID = await client.query(`select a.company_code||to_char(now(),'YY')||to_char(now(),'MM')||(LPAD((select  coalesce (max(patient_id),0) + 1 as ref from tbl_patient)::text,4,'0')) as uhid from tbl_account_master as a  inner join tbl_account_module as b on a.account_id = b.account_id where b.module_id = 1`);
                if (client) {
                    client.end();
                }
                if (getUHID.rows.length > 0) {
                    const uhid = getUHID && getUHID.rows[0].uhid;
                    return response_Array = { "UHID": uhid, "status": true }
                }
                else {
                    return response_Array = { "message": constants.userMessage.ACCOUNTDETAILSMISSING, "status": false }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "getUHID");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//patient search Jwt
module.exports.patientDetailsearchJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "patientDetailsearchJwt");
        throw new Error(error);
    }
}
//patient search
module.exports.patientDetailsearch = async (req) => {
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
            const { mobile_number, date_of_birth, gender_id, patient_name, patient_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                var condition = `LOWER ("patient_name") = LOWER ( ` + "'" + patient_name + "')"

                const patientcount = await client.query(`select count(*) as patientcount FROM tbl_patient where ` + ` "mobile_number" = '` + mobile_number + `' and gender_id = ` + gender_id + ` and ` + condition + `  and date_of_birth =  ` + date_of_birth + ` and  patient_id !=` + patient_id);
                if (client) {
                    client.end();
                }

                var patient_Check = patientcount && patientcount.rows[0].patientcount
                if (patient_Check > 0) {
                    return response = { "message": constants.userMessage.DUPLICATE_PATIENT, "status": false }
                }

                return response = { "message": constants.userMessage.UNIQUE_PATIENT, "status": true }

            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Patient", error, "patientDetailsearch");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}