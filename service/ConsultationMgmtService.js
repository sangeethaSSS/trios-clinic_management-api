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
const fs = require('fs');
const moment = require('moment');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');

//create Consultation jwt 
module.exports.createConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "createConsultationJwt");
        throw new Error(error);
    }
}
//create Consultation service
module.exports.createConsultation = async (req) => {
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
            const { consultation_id, appointment_id, employee_id, patient_id, user_id, doctor_notes, review_date, appointment_status_id, paymentstatus_id, prescriptionArray } = decoded.data;
            var response = {}
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            var create_date = new Date().getTime();
            if (decoded) {
                if (consultation_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Consultation");
                    const max = await client.query(`select coalesce(max(consultation_id),0) + 1 as mr FROM tbl_consultation`)
                    var maxconsultation = max && max.rows[0].mr;

                    const create_result = await client.query(`INSERT INTO "tbl_consultation"("consultation_id","appointment_id","employee_id","patient_id","doctor_notes","review_date","maker_id","user_id","created_date") values ($1, $2, $3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP) `, [maxconsultation, appointment_id, employee_id, patient_id, doctor_notes, review_date, makerid, user_id]);

                    await client.query(`UPDATE "tbl_appointment" set "paymentstatus_id"=$1  where "appointment_id" = $2`, [paymentstatus_id, appointment_id]);

                    await client.query(`UPDATE "tbl_transaction" set "updated_date"= CURRENT_TIMESTAMP,"paymentstatus_id"=$1,"active_status"=$2 where "ref_no" = $3 and module_id=1`, [paymentstatus_id, 1, appointment_id]);

                    if (prescriptionArray && prescriptionArray.length > 0) {
                        for (let i = 0; i < prescriptionArray.length; i++) {
                            var mn = false, af = false, en = false, nt = false;
                            if (prescriptionArray[i].mn_value == 1 || prescriptionArray[i].mn_value == true) {
                                mn = true
                            }
                            if (prescriptionArray[i].af_value == 1 || prescriptionArray[i].af_value == true) {
                                af = true
                            }
                            if (prescriptionArray[i].en_value == 1 || prescriptionArray[i].en_value == true) {
                                en = true
                            }
                            if (prescriptionArray[i].nt_value == 1 || prescriptionArray[i].nt_value == true) {
                                nt = true
                            }
                            const maxmedicine = await client.query(`select coalesce(max(prescription_medicine_id),0) + 1 as max FROM tbl_prescription_medicine_details`)
                            var maxmedicine_Check = maxmedicine && maxmedicine.rows[0].max;

                            await client.query(`INSERT INTO "tbl_prescription_medicine_details"(prescription_medicine_id,salt_name,drug_name,dosage_name,comment,duration,consultation_id,route_name,referral_name,duration_name,unit_name,mn,af,en,nt,user_id,frequency,display_unit) values ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) `, [maxmedicine_Check, prescriptionArray[i].salt_name, prescriptionArray[i].medicine_name, prescriptionArray[i].dosage, prescriptionArray[i].comment, prescriptionArray[i].duration_value, maxconsultation, prescriptionArray[i].route_name, prescriptionArray[i].referral_name, prescriptionArray[i].duration_name, prescriptionArray[i].unit_name, mn, af, en, nt, user_id, prescriptionArray[i].frequency, prescriptionArray[i].display_unit]);
                        }
                    }
                    var id = await commonService.insertLogs(user_id, "Update Appointment");

                    await client.query(`UPDATE "tbl_appointment" set "appointment_status_id"=$1,"paymentstatus_id"=$2,"review_date"=$3,"updated_date"=CURRENT_TIMESTAMP,"user_id"=$4 where "appointment_id" = $5 `, [appointment_status_id, paymentstatus_id, review_date, user_id, appointment_id]);

                    let create_consultation = create_result && create_result.rowCount ? create_result.rowCount : 0;
                    if (create_consultation == 1) {
                        const list_cash = await client.query(`select a.transaction_id,a.employee_id,a.patient_id,a.module_id,a.total_amount,a.paymentstatus_id,a.ref_no,a.voucher_no,a.account_id,a.created_time,b.patient_name,c.company_name,c.company_code,d.module_name,e.paymentstatus_name from tbl_transaction as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_account_master as c on a.account_id = c.account_id inner join tbl_def_modules as d on a.module_id = d.module_id inner join tbl_def_payment_status as e on a.paymentstatus_id = e.paymentstatus_id where a.ref_no =$1`, [appointment_id]);

                        const appointment_list = await client.query(`select a.height,a.weight,a.spo2,a.blood_pressure,a.temparature,a.bmi,a.cbg,a.pulse,b.date_of_birth,b.age_year,b.age_month,b.age_day,b.dob_type,c.gender_name,b.patient_name,b.uhid from tbl_appointment as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_gender as c on  b.gender_id = c.gender_id where a.appointment_id = $1`, [appointment_id])
                        if (client) {
                            client.end();
                        }
                        // this.getPrintDetails(patient_id, module_id, employee_id, fees)
                        let list_casharray = list_cash && list_cash.rows ? list_cash.rows : [];
                        let AppointmentList = appointment_list && appointment_list.rows ? appointment_list.rows : [];
                        return response = { "consultation_id": maxconsultation, "message": constants.userMessage.USER_UPDATED, "listCasharray": list_casharray, "status": true, "AppointmentList": AppointmentList };
                    }
                    else {
                        if (client) {
                            client.end();
                        } return ''
                    }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Consultation");
                    const consultation_Count = await client.query(`select count(*) as count FROM tbl_consultation where consultation_id =` + consultation_id)
                    var count_Check = consultation_Count && consultation_Count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {

                        const update_result = await client.query(`UPDATE "tbl_consultation" set "appointment_id"=$1, "employee_id"=$2,"patient_id"=$3,"doctor_notes"=$4,"maker_id"=$5,"review_date"=$6,"user_id"=$7,"updated_date"=CURRENT_TIMESTAMP where "consultation_id" = $8 `, [appointment_id, employee_id, patient_id, doctor_notes, makerid, review_date, user_id, consultation_id]);

                        await client.query(`UPDATE "tbl_appointment" set "paymentstatus_id"=$1 where "appointment_id" = $2`, [paymentstatus_id, appointment_id]);

                        await client.query(`UPDATE "tbl_transaction" set "updated_date"= CURRENT_TIMESTAMP,"paymentstatus_id"=$1,"active_status"=$2 where "ref_no" = $3 and module_id = 1`, [paymentstatus_id, 1, appointment_id]);


                        await client.query(`DELETE FROM tbl_prescription_medicine_details where consultation_id=` + consultation_id)

                        if (prescriptionArray && prescriptionArray.length > 0) {
                            for (let i = 0; i < prescriptionArray.length; i++) {
                                var mn = false, af = false, en = false, nt = false;
                                if (prescriptionArray[i].mn_value == 1 || prescriptionArray[i].mn_value == true) {
                                    mn = true
                                }
                                if (prescriptionArray[i].af_value == 1 || prescriptionArray[i].af_value == true) {
                                    af = true
                                }
                                if (prescriptionArray[i].en_value == 1 || prescriptionArray[i].en_value == true) {
                                    en = true
                                }
                                if (prescriptionArray[i].nt_value == 1 || prescriptionArray[i].nt_value == true) {
                                    nt = true
                                }
                                const maxmedicine = await client.query(`select coalesce(max(prescription_medicine_id),0) + 1 as max FROM tbl_prescription_medicine_details`)
                                var maxmedicine_Check = maxmedicine && maxmedicine.rows[0].max;

                                await client.query(`INSERT INTO "tbl_prescription_medicine_details"(prescription_medicine_id,salt_name,drug_name,dosage_name,comment,duration,consultation_id,route_name,referral_name,duration_name,unit_name,mn,af,en,nt,user_id,frequency,display_unit) values ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) `, [maxmedicine_Check, prescriptionArray[i].salt_name, prescriptionArray[i].medicine_name, prescriptionArray[i].dosage, prescriptionArray[i].comment, prescriptionArray[i].duration_value, consultation_id, prescriptionArray[i].route_name, prescriptionArray[i].referral_name, prescriptionArray[i].duration_name, prescriptionArray[i].unit_name, mn, af, en, nt, user_id, prescriptionArray[i].frequency, prescriptionArray[i].display_unit]);
                            }
                        }

                        await client.query(`UPDATE "tbl_appointment" set "appointment_status_id"=$1,"paymentstatus_id"=$2,"review_date"=$3,"updated_date"=CURRENT_TIMESTAMP,"user_id"=$4 where "appointment_id" = $5 `, [appointment_status_id, paymentstatus_id, review_date, user_id, appointment_id]);

                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (update_code == 1) {
                            const list_cash = await client.query(`select a.transaction_id,a.employee_id,a.patient_id,a.module_id,a.total_amount,a.paymentstatus_id,a.ref_no,a.voucher_no,a.account_id,a.created_time,b.patient_name,c.company_name,c.company_code,d.module_name,e.paymentstatus_name from tbl_transaction as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_account_master as c on a.account_id = c.account_id inner join tbl_def_modules as d on a.module_id = d.module_id inner join tbl_def_payment_status as e on a.paymentstatus_id = e.paymentstatus_id where a.ref_no =$1`, [appointment_id]);

                            const appointment_list = await client.query(`select a.height,a.weight,a.spo2,a.blood_pressure,a.temparature,a.bmi,a.cbg,a.pulse,b.date_of_birth,b.age_year,b.age_month,b.age_day,b.dob_type,c.gender_name,b.patient_name,b.uhid from tbl_appointment as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_gender as c on  b.gender_id = c.gender_id where a.appointment_id = $1`, [appointment_id])

                            if (client) {
                                client.end();
                            }
                            let list_casharray = list_cash && list_cash.rows ? list_cash.rows : [];
                            let AppointmentList = appointment_list && appointment_list.rows ? appointment_list.rows : [];
                            return response = { "consultation_id": consultation_id, "message": constants.userMessage.USER_UPDATED, "listCasharray": list_casharray, "status": true, "AppointmentList": AppointmentList };
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "createConsultation");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Get Print Details Module
module.exports.getPrintDetails = async (patient_id, module_id, employee_id, fees) => {
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

        const Get_employee = await client.query(`select a.emplee_id,a.employee_name from tbl_employee_master as a where a.employee_id =$1 `, [employee_id])
        let get_PrintArray = get_Print && get_Print.rows ? get_Print.rows : [];
        let get_EmployeeArray = Get_employee && Get_employee.rows ? Get_employee.rows : [];
        let get_Accountarray = get_Account && get_Account.rows ? get_Account.rows : [];
        let getPatientArray = get_Patient && get_Patient.rows ? get_Patient.rows : [];
        response_array = {
            "getAccountarray": get_Accountarray, "getPatientArray": getPatientArray,
        }
        // return response_array
        var total_rate = fees.toFixed(2);

        // var directory = get_PrintArray[0]['print_folder_name'];
        var directory = 'D:/';
        var foldername = 'labtestreport';
        var filepath = '';
        if (fs.existsSync(directory)) {
            fs.mkdirSync(directory + foldername);
            filepath = directory + foldername + '/labtest1.txt';
        }
        if (filepath) {
            var logger = fs.createWriteStream(filepath, {
            })
            var date = moment(getPatientArray[0]['date_of_birth']).format('MM/DD/YYYY');
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
            logger.write(formattextLeftRight(getPatientArray[0]['patient_name'], 'Date:' + date, 45) + "\r\n")
            logger.write(formattextLeftRight("#" + getPatientArray[0]['uhid'], 'Doctor Name:' + get_EmployeeArray[0]['employee_name'], 45) + "\r\n")
            logger.write(formattextLeftRight(age + ',' + getPatientArray[0]['gender_name'], 'Time:' + time, 45) + "\r\n")
            logger.write(getPatientArray[0]['mobile_number'] + "\r\n")
            logger.write(getPatientArray[0]['city_name'] + "\r\n")
            logger.write('----------------------------------------------' + "\r\n")
            logger.write(formattextLeftRight('Consultation Fees', 'Rs.' + total_rate.toString(), 45) + "\r\n")
            logger.end()
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getPrintDetails");
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Get Consultation jwt 
module.exports.getDataConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getDataConsultationJwt");
        throw new Error(error);
    }
}
//Get Consultation List
module.exports.getDataConsultation = async (req) => {
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
            const { appointment_id } = decoded.data
            if (decoded) {
                var response_Data = {}
                const get_Data = await client.query(`select a.appointment_id,a.employee_id,a.patient_id,a.appointment_date,a.token_number,a.appointment_type_id,
                a.appointment_mode_id,a.patient_category_id,a.fees,a.remarks,a.height,a.session_id,a.paymentstatus_id,a.weight,
                a.spo2,a.blood_pressure,a.temparature,a.bmi,a.pulse,a.cbg,b.patient_name,b.patient_code,b.tag_id,i.display_code,
                b.gender_id,b.date_of_birth,b.blood_group_id,b.uhid,b.drug_allergy,b.age_day,b.age_month,b.age_year,
                case when (select count(*) 
                 from tbl_appointment as ta where ta.patient_id=a.patient_id)>1 then 'OLD' else 'NEW' end as employee_type ,
                b.dob_type,b.clinical_photography,c.gender_name,d.blood_group_name,f.appintment_type,e.appointment_mode,
                g.patient_category_name,h.paymentstatus_name,i.tag_name from tbl_appointment as a inner join tbl_patient 
                as b on a.patient_id = b.patient_id inner join tbl_def_gender as c on b.gender_id = c.gender_id inner join 
                tbl_def_blood_group as d on b.blood_group_id=d.blood_group_id inner join tbl_def_appointment_type as f on 
                a.appointment_type_id=f.appointment_type_id inner join tbl_def_appointment_mode as e on 
                a.appointment_mode_id = e.appointment_mode_id inner join tbl_def_patient_category as g on 
                a.patient_category_id = g.patient_category_id inner join tbl_def_payment_status as h on 
                a.paymentstatus_id = h.paymentstatus_id inner join tbl_def_tag as i on b.tag_id = i.tag_id  where a.appointment_id =` + appointment_id);

                const other_Details = await client.query(`select a.patient_details_id,a.patient_id,a.details_id,a.patient_details_name, b.details_name from tbl_patient_other_details  as a inner join tbl_def_other_details as b on a.details_id = b.details_id where patient_id =(select patient_id from tbl_appointment where appointment_id = $1 limit 1)`, [appointment_id])

                const disease_Details = await client.query(`select a.disease_id,a.patient_id,a.treatment_id,a.disease_details,b.treatment_name from tbl_disease_history as a inner join tbl_def_treatment as b on a.treatment_id = b.treatment_id 
               where patient_id = (select patient_id from tbl_appointment where appointment_id = $1 limit 1)`, [appointment_id])

                const reason_Details = await client.query(`SELECT coalesce(string_agg(a.reason_name,', '), '' ) as reason_name from tbl_def_reason_purpose as a where a.reason_id in (SELECT cast(unnest(string_to_array(reason_visit, ',')) as integer) from tbl_patient where patient_id = (select patient_id from tbl_appointment where appointment_id = $1 limit 1))`, [appointment_id])

                const clinicalhistory_Details = await client.query(`SELECT coalesce(string_agg(a.clinical_history_details,', '),'') as clinical_history_details from tbl_def_clinical_history as a where a.clinical_history_id in (SELECT cast(unnest(string_to_array(treatment_undergone, ',')) as integer) from tbl_patient where patient_id = (select patient_id from tbl_appointment where appointment_id = $1 limit 1))`, [appointment_id])


                if (client) {
                    client.end();
                }
                let get_Datararray = get_Data && get_Data.rows ? get_Data.rows : [];
                let other_Detailsarray = other_Details && other_Details.rows ? other_Details.rows : [];
                let disease_Detailsarray = disease_Details && disease_Details.rows ? disease_Details.rows : [];
                let reason_Detailsarray = reason_Details && reason_Details.rows[0].reason_name ? reason_Details.rows : [];
                let clinicalhistory_array = clinicalhistory_Details && clinicalhistory_Details.rows[0].clinical_history_details ? clinicalhistory_Details.rows : [];

                response_Data = {
                    "ConsultationArray": get_Datararray, "OtherDetails": other_Detailsarray, "DiseaseDetails": disease_Detailsarray, "ReasonDetails": reason_Detailsarray, "ClinicalHistory": clinicalhistory_array
                }
                if (response_Data) {
                    return response_Data;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getDataConsultation");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//List Consultation jwt 
module.exports.listConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//List Consultation 
module.exports.listConsultation = async (req) => {
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
            const { session_id, employee_id, start_date } = decoded.data;
            if (decoded) {
                var response_Array = {}
                var employee = '', session = '';
                if (employee_id == -1) {
                    employee = ' 1=1'
                }
                else {
                    employee = ` derv.employee_id = ` + employee_id
                }
                if (session_id == -1) {
                    session = ' 1=1'
                }
                else {
                    session = ` derv.session_id = ` + session_id
                }
                const List_Data = await client.query(`SELECT derv.* from
                (select a.tentative_time,a.token_number,a.appointment_status_id,a.patient_id,
                 a.appointment_id,a.appointment_date,a.appointment_mode_id,a.employee_id,
                 a.paymentstatus_id,b.consultation_id,a.fees AS fees,
                 CASE when b.created_date is not NULL then b.created_date else  a.appointment_date END AS created_date,
                (select employee_name from tbl_employee_master where employee_id=a.user_id) as created_by,a.session_id,a.weight,
				 a.height,a.weight,a.spo2,a.blood_pressure,a.temparature,a.bmi,a.pulse,a.cbg,
                 i.appointment_mode,c.clinical_photography,c.patient_name,c.tag_id,j.display_code,
                 c.uhid,c.gender_id,c.date_of_birth,c.blood_group_id,c.age_day,c.age_month,c.age_year,c.dob_type,c.city_id,c.mobile_number,d.employee_name,c.city_id,e.appointment_status,f.paymentstatus_name,j.tag_name,k.gender_name,l.blood_group_name,m.city_name,n.transaction_id,n.ref_no,n.voucher_no,n.account_id,n.created_time,n.module_id,n.total_amount as transaction_rate,
                 case when a.appointment_status_id = 2 then 1 
                 when a.appointment_status_id = 3 then 2 
                 when a.appointment_status_id = 1 then 3 
                 when a.appointment_status_id = 4 then 4 end as ordernumber,
                 case when (select count(*) from tbl_appointment as ta where 
                      ta.patient_id=a.patient_id)>1 then 'OLD' else 'NEW' end as employee_type 
                 from tbl_appointment as a
                 left outer join  tbl_consultation as b on a.appointment_id = b.appointment_id 
                 inner join tbl_patient as c on a.patient_id = c.patient_id 
                 inner join tbl_employee_master as d on a.employee_id = d.employee_id 
                 inner join tbl_def_appointment_status as e on a.appointment_status_id = e.appointment_status_id 
                 inner join tbl_def_payment_status as f on a.paymentstatus_id = f.paymentstatus_id 
                 inner join tbl_def_appointment_mode as i on a.appointment_mode_id = i.appointment_mode_id 
                 inner join tbl_def_tag as j on c.tag_id = j.tag_id 
                 inner join tbl_def_gender as k on c.gender_id = k.gender_id 
                 inner join tbl_def_blood_group as l on c.blood_group_id=l.blood_group_id 
                 inner join tbl_def_city as m on c.city_id = m.city_id 
                 left outer join tbl_transaction as n on a.appointment_id = n.ref_no ) as derv 
                 where module_id = 1 and appointment_status_id != 4 and appointment_status_id !=3 and to_char(derv.appointment_date,'YYYY-MM-DD') = $1 and `+ employee + ` and ` + session + `  order by ordernumber,token_number asc`, [start_date]);

                const consultation_status = await client.query(`SELECT a.appointment_status_id,appointment_status,count(b.*) from tbl_def_appointment_status as a left join 
                tbl_appointment as b on a.appointment_status_id=b.appointment_status_id and b.session_id = $1
                  group by a.appointment_status_id,a.appointment_status `, [session_id])


                // const totalAmount = await client.query(`select SUM(a.fees) as count from tbl_consultation as a inner join tbl_appointment as b on a.appointment_id = b.appointment_id where to_char(a.created_date,'YYYY-MM-DD') = ` + date + ` and b.session_id = ` + session_id + ` and b.paymentstatus_id = 1 `)

                // const currentvalue = await client.query(`select token_number from  (select max(session_id)  as token_number from tbl_appointment where appointment_status_id = 2 order by token_number asc limit 1) as temp`)
                const currentvalue = await client.query(`select COALESCE(max(COALESCE(token_number,0))+1,1) as token_number from tbl_appointment where session_id = ` + session_id)

                const totalvalue = await client.query(`select count(*) as count from tbl_appointment`);
                if (client) {
                    client.end();
                }
                let List_array = List_Data && List_Data.rows ? List_Data.rows : [];
                var total_Count = totalvalue && totalvalue.rows[0].count ? totalvalue.rows[0].count : 0
                if (consultation_status && consultation_status.rows.length > 0) {
                    var status = consultation_status.rows
                    for (let i = 0; i < status.length; i++) {
                        if (status[i].appointment_status_id == 1) {
                            consulted_Count = status[i].count;
                        }
                        if (status[i].appointment_status_id == 2) {
                            queue_Count = status[i].count;
                        }
                        if (status[i].appointment_status_id == 3) {
                            skipped_Count = status[i].count;
                        }
                    }
                }

                // var total_Amount = totalAmount && totalAmount.rows[0].count ? totalAmount.rows[0].count : 0
                var current_Token = currentvalue && currentvalue.rows[0] ? currentvalue.rows[0] : 0
                response_Array = {
                    "ConsultationArray": List_array, "total_Count": total_Count, "consulted_Count": consulted_Count, "queue_Count": queue_Count, "current_Token": current_Token, "skipped_Count": skipped_Count, "total_Amount": 0,
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "listConsultation");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Editload Consultation jwt 
module.exports.editloadConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "editloadConsultationJwt");
        throw new Error(error);
    }
}
//Editload Consultation List
module.exports.editloadConsultation = async (req) => {
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
            const { consultation_id } = decoded.data

            if (decoded) {
                var response_Data = {}
                const editload_Data = await client.query(`select a.consultation_id,a.appointment_id,a.patient_id,a.review_date,b.fees,a.doctor_notes,a.employee_id,b.paymentstatus_id,b.appointment_date,b.token_number,b.appointment_type_id,b.appointment_mode_id,b.patient_category_id,b.remarks,b.height,b.weight,b.spo2,b.session_id,b.blood_pressure,b.temparature,b.bmi,b.pulse,b.cbg,c.patient_name,c.patient_code,c.tag_id,i.display_code,c.gender_id,c.date_of_birth,c.blood_group_id,c.uhid,c.drug_allergy,c.age_day,c.age_month,c.age_year,c.dob_type,c.clinical_photography,d.gender_name,h.blood_group_name,f.appintment_type,e.appointment_mode,g.patient_category_name, t.paymentstatus_name,i.tag_name, case when (select count(*) from tbl_appointment as ta where ta.patient_id=a.patient_id)>1 then 'OLD' else 'NEW' end as employee_type from tbl_consultation as a inner join tbl_appointment as b on a.appointment_id = b.appointment_id inner join tbl_patient as c on a.patient_id = c.patient_id inner join tbl_def_gender as d on c.gender_id = d.gender_id inner join tbl_def_blood_group as h on c.blood_group_id=h.blood_group_id inner join tbl_def_appointment_type as f on b.appointment_type_id=f.appointment_type_id inner join tbl_def_appointment_mode as e on b.appointment_mode_id = e.appointment_mode_id inner join tbl_def_patient_category as g on b.patient_category_id = g.patient_category_id inner join tbl_def_payment_status as t on b.paymentstatus_id = t.paymentstatus_id inner join tbl_def_tag as i on c.tag_id = i.tag_id where a.consultation_id =` + consultation_id);

                const other_Details = await client.query(`select a.patient_details_id,a.patient_id,a.details_id,a.patient_details_name, b.details_name from tbl_patient_other_details  as a inner join tbl_def_other_details as b on a.details_id = b.details_id where patient_id =(select patient_id from tbl_consultation where consultation_id = $1 limit 1)`, [consultation_id])

                const disease_Details = await client.query(`select a.disease_id,a.patient_id,a.treatment_id,a.disease_details,b.treatment_name from tbl_disease_history as a inner join tbl_def_treatment as b on a.treatment_id = b.treatment_id 
               where patient_id = (select patient_id from tbl_consultation where consultation_id = $1 limit 1)`, [consultation_id])

                const reason_Details = await client.query(`SELECT coalesce(string_agg(a.reason_name,', '), '' ) as reason_name from tbl_def_reason_purpose as a where a.reason_id in (SELECT cast(unnest(string_to_array(reason_visit, ',')) as integer) from tbl_patient where patient_id = (select patient_id from tbl_consultation where consultation_id = $1 limit 1))`, [consultation_id])

                const clinicalhistory_Details = await client.query(`SELECT coalesce(string_agg(a.clinical_history_details,', '),'') as clinical_history_details from tbl_def_clinical_history as a where a.clinical_history_id in (SELECT cast(unnest(string_to_array(treatment_undergone, ',')) as integer) from tbl_patient where patient_id = (select patient_id from tbl_consultation where consultation_id = $1 limit 1))`, [consultation_id])

                const prescriptionArray = await client.query(`select salt_name,drug_name as medicine_name,dosage_name as dosage,comment,consultation_id,duration as duration_value,route_name,referral_name,duration_name,unit_name,mn as mn_value,af as af_value,en as en_value,nt as nt_value,frequency,prescription_medicine_id as prescription_id,display_unit from tbl_prescription_medicine_details where consultation_id = $1 `, [consultation_id])

                if (client) {
                    client.end();
                }

                let editload_Datararray = editload_Data && editload_Data.rows ? editload_Data.rows : [];
                let edit_prescriptionArray = prescriptionArray && prescriptionArray.rows ? prescriptionArray.rows : [];
                let other_Detailsarray = other_Details && other_Details.rows ? other_Details.rows : [];
                let disease_Detailsarray = disease_Details && disease_Details.rows ? disease_Details.rows : [];
                let reason_Detailsarray = reason_Details && reason_Details.rows[0].reason_name ? reason_Details.rows : [];
                let clinicalhistory_array = clinicalhistory_Details && clinicalhistory_Details.rows[0].clinical_history_details ? clinicalhistory_Details.rows : [];

                response_Data = {
                    "ConsultationArray": editload_Datararray, "PrescriptionDetails": edit_prescriptionArray, "OtherDetails": other_Detailsarray, "DiseaseDetails": disease_Detailsarray, "ReasonDetails": reason_Detailsarray, "ClinicalHistory": clinicalhistory_array
                }
                if (response_Data) {
                    return response_Data;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "editloadConsultation");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Clinic History  jwt 
module.exports.clinicHistoryJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "clinicHistoryJwt");
        throw new Error(error);
    }
}
//Clinic History 
module.exports.clinicHistory = async (req) => {
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
            const { patient_id, offset, pagesize } = decoded.data
            if (decoded) {
                var response = {}
                const Clinicalhistory_data = await client.query(`select * from (select  ROW_NUMBER() OVER(ORDER BY  appointment_date desc) as rno,* from (SELECT d.consultation_id as id,b.patient_id,b.appointment_status_id,CASE when d.created_date is not NULL then d.created_date else  b.appointment_date END AS appointment_date,b.appointment_id,b.tentative_time,b.height,b.weight,b.spo2,b.blood_pressure,b.bmi,b.pulse,b.cbg,b.temparature,b.session_id,c.patient_name,c.drug_allergy,b.created_time,d.doctor_notes,d.created_date from tbl_appointment as b  inner join tbl_patient as c on b.patient_id = c.patient_id left join tbl_consultation as d on b.appointment_id = d.appointment_id WHERE b.patient_id = $1  and (b.appointment_status_id =2 or b.appointment_status_id =1) union all select a.old_prescription_id,a.patient_id,0,a.prescription_date,0,0,0,0,0,'',0,0,0,0,0,'','',0,a.doctor_notes,null from tbl_old_prescription as a  WHERE a.patient_id = $1 and a.doctor_notes != ''  union all select a.old_prescription_id as id,a.patient_id,0,a.prescription_date,0,0,0,0,0,'',0,0,0,0,0,'','',0,a.doctor_notes,null from tbl_old_prescription as a WHERE a.patient_id = $1 and a.doctor_notes = '' ) as dev ) as dev1 order by rno  `, [patient_id]);

                var Clinicalhistoryarray = Clinicalhistory_data && Clinicalhistory_data.rows ? Clinicalhistory_data.rows : [];

                if (Clinicalhistoryarray.length > 0) {
                    for (let i = 0; i < Clinicalhistoryarray.length; i++) {
                        var date = moment(Clinicalhistoryarray[i].appointment_date).format('YYYY-MM-DD');

                        const exeQuery1 = await client.query(`select * from (Select a.created_date as date,a.doctor_notes,b.salt_name,  b.drug_name,b.dosage_name,b.duration,b.route_name,b.referral_name,b.duration_name,b.unit_name,b.frequency, b.display_unit,b.mn as mn_value,b.af as af_value,b.en as en_value,b.nt as nt_value from tbl_consultation as a inner join  tbl_prescription_medicine_details as b on a.consultation_id = b.consultation_id  where a.patient_id = $1 and a.appointment_id =$2 union all Select a.prescription_date as date,a.doctor_notes,b.salt_name,b.drug_name,b.dosage_name,b.duration,b.route_name,b.referral_name,b.duration_name,b.unit_name,b.frequency,b.display_unit,b.mn as mn_value,b.af as af_value,b.en as en_value,b.nt as nt_value from tbl_old_prescription as a inner join  tbl_old_prescription_details as b on a.old_prescription_id = b.old_prescription_id where a.patient_id = $1 and to_char(a.prescription_date,'YYYY-MM-DD') =$3 and a.old_prescription_id = $4) as dev order by dev.date desc`, [Clinicalhistoryarray[i].patient_id, Clinicalhistoryarray[i].appointment_id, date,Clinicalhistoryarray[i].id]);
                        let PrescriptionList = exeQuery1 && exeQuery1.rows ? exeQuery1.rows : [];
                        Clinicalhistoryarray[i]['PrescriptionList'] = PrescriptionList
                    }
                }

                const total_count = await client.query(`SELECT count(*) FROM (SELECT a.patient_id from tbl_consultation  as a inner join tbl_appointment as b on a.appointment_id = b.appointment_id inner join tbl_patient as c on a.patient_id = c.patient_id WHERE a.patient_id = $1 union all select patient_id from tbl_old_prescription  
                    WHERE  patient_id = $1) total_count;`, [patient_id])

                if (client) {
                    client.end();
                }
                var Clinicalhistoryarray = Clinicalhistory_data && Clinicalhistory_data.rows ? Clinicalhistory_data.rows : [];
                // var prescriptionList = prescriptionArray && prescriptionArray.rows ? prescriptionArray.rows : [];
                var total_counts = total_count && total_count.rows ? total_count.rows : [];
                response = {
                    "ClinicalHistoryArray": Clinicalhistoryarray, "total_counts": total_counts
                }
                if (response) {
                    return response;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "clinicHistory");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Previous Consultation  jwt 
module.exports.previousConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "previousConsultationJwt");
        throw new Error(error);
    }
}
//Previous Consultation List
module.exports.previousConsultation = async (req) => {
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
            const { appointment_id, session_id } = decoded.data
            if (decoded) {
                var appointmentid = appointment_id - 1
                var previous_response = {}
                const previous_Count = await client.query(`select count(*) as previouscount FROM tbl_appointment where appointment_id =` + appointment_id)
                var previous_Check = previous_Count && previous_Count.rows[0].previouscount
                if (previous_Check != 0 && previous_Check != null && previous_Check != undefined && previous_Check != "") {
                    const previous_Data = await client.query(`select a.appointment_id,a.employee_id,a.patient_id,a.appointment_date,a.token_number,a.session_id,a.appointment_type_id,a.appointment_mode_id,a.appointment_status_id,a.patient_category_id,a.fees,a.remarks,a.height,a.bmi,a.cbg,a.pulse,a.paymentstatus_id,a.weight,a.spo2,a.blood_pressure,a.temparature,b.patient_name,b.patient_code,b.clinical_photography,b.gender_id,b.tag_id,j.display_code,b.date_of_birth,b.blood_group_id,b.uhid,b.drug_allergy,c.gender_name,d.blood_group_name,f.appintment_type,e.appointment_mode,g.patient_category_name,h.paymentstatus_name,i.appointment_status,j.tag_name from tbl_appointment as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_gender as c on b.gender_id = c.gender_id inner join tbl_def_blood_group as d on b.blood_group_id=d.blood_group_id inner join tbl_def_appointment_type as f on a.appointment_type_id=f.appointment_type_id inner join tbl_def_appointment_mode as e on a.appointment_mode_id = e.appointment_mode_id inner join tbl_def_patient_category as g on a.patient_category_id = g.patient_category_id inner join tbl_def_payment_status as h on a.paymentstatus_id = h.paymentstatus_id inner join tbl_def_appointment_status as i on a.appointment_status_id = i.appointment_status_id inner join tbl_def_tag as j on b.tag_id = j.tag_id where a.session_id =` + session_id + `and a.appointment_status_id = 1 and a.appointment_id < ` + appointment_id + `limit 1`);
                    if (client) {
                        client.end();
                    }
                    let previous_Datararray = previous_Data && previous_Data.rows ? previous_Data.rows : [];
                    if (previous_Datararray.length > 0) {
                        return previous_response = { "AppointmentData": previous_Datararray, "message": constants.userMessage.LIST_CREATED, "status": true };
                    }
                    else {
                        return previous_response = { "message": constants.userMessage.NORECORDFOUND, "status": false };
                    }
                }
                else {
                    return previous_response = { "message": constants.userMessage.NORECORDFOUND, "status": false };
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "previousConsultation");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Next Consultation  jwt 
module.exports.nextConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "nextConsultationJwt");
        throw new Error(error);
    }
}
//Next Consultation List
module.exports.nextConsultation = async (req) => {
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
            const { session_id } = decoded.data
            if (decoded) {
                var next_response = {}
                const next_Data = await client.query(`select a.appointment_id,a.employee_id,a.patient_id,a.appointment_date,a.token_number,a.appointment_type_id,a.appointment_mode_id,a.appointment_status_id,a.patient_category_id,a.fees,a.session_id,a.remarks,a.height,a.bmi,a.cbg,a.pulse,a.paymentstatus_id,a.weight,a.spo2,a.blood_pressure,a.temparature,b.patient_name,b.patient_code,b.gender_id,b.date_of_birth,b.blood_group_id,b.tag_id,j.display_code,b.uhid,b.drug_allergy,b.clinical_photography,c.gender_name,d.blood_group_name,f.appintment_type,e.appointment_mode,g.patient_category_name,h.paymentstatus_name,i.appointment_status,j.tag_name from tbl_appointment as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_gender as c on b.gender_id = c.gender_id inner join tbl_def_blood_group as d on b.blood_group_id=d.blood_group_id inner join tbl_def_appointment_type as f on a.appointment_type_id=f.appointment_type_id inner join tbl_def_appointment_mode as e on a.appointment_mode_id = e.appointment_mode_id inner join tbl_def_patient_category as g on a.patient_category_id = g.patient_category_id inner join tbl_def_payment_status as h on a.paymentstatus_id = h.paymentstatus_id inner join tbl_def_appointment_status as i on a.appointment_status_id = i.appointment_status_id
                inner join tbl_def_tag as j on b.tag_id = j.tag_id  where a.session_id =` + session_id + ` and a.appointment_status_id = 2 order by a.appointment_id asc limit 1`);

                if (client) {
                    client.end();
                }
                let next_Datararray = next_Data && next_Data.rows ? next_Data.rows : [];
                if (next_Datararray.length > 0) {
                    return next_response = { "AppointmentData": next_Datararray, "message": constants.userMessage.LIST_CREATED, "status": true };
                }
                else {
                    return next_response = { "message": constants.userMessage.NORECORDFOUND, "status": false };
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "nextConsultation");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Update payment jwt 
module.exports.updatePaymentStatusJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "updatePaymentStatusJwt");
        throw new Error(error);
    }
}

//Update payment service
module.exports.updatePaymentStatus = async (req) => {
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
            const { appointment_id, paymentstatus_id, fees, account_id, transaction_id, ref_no, module_id, voucher_no, narration, user_id, employee_id } = decoded.data;
            var update_code = 0;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            var create_date = new Date().getTime();
            var financialId = await commonService.getFinancial_year();
            var financial_year_id = financialId.financial_year_id;
            var financialyear_status = financialId.status
            var financialyear_message = financialId.message
            if (decoded) {
                if (financialyear_status == true) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Cash Module");
                    if (paymentstatus_id == 1) {
                        const max = await client.query(`select coalesce(max(cash_id),0) + 1 as mr FROM tbl_cash_transaction`)
                        var maxcash = max && max.rows[0].mr;
                        var getFees_Insert = fees;
                        const getFees = await client.query(`select total_amount from tbl_transaction where transaction_id = $1`, [transaction_id])
                        if (getFees.rows.length > 0) {
                            getFees_Insert = getFees && getFees.rows[0].total_amount;
                        }
                        else {
                            getFees_Insert = fees;
                        }
                        await client.query(`INSERT INTO "tbl_cash_transaction"("cash_id","transaction_id","account_id","module_id","voucher_no","financial_year","cash_rate","narration","created_time","ref_no","maker_id","user_id","created_date","employee_id") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`, [maxcash, transaction_id, account_id, module_id, voucher_no, financial_year_id, getFees_Insert, narration, create_date, ref_no, makerid, user_id, createupdate_date, employee_id]);
                    }
                    else {
                        const cashcount = await client.query(`select count(*) FROM tbl_cash_transaction where transaction_id = $1`, [transaction_id])
                        var count_Check = cashcount && cashcount.rows[0].count
                        if (count_Check.length > 0) {
                            var res = await client.query(`Delete from tbl_cash_transaction where transaction_id = $1`, [transaction_id])
                        }
                    }
                    if (module_id == 1) {

                        await client.query(`UPDATE "tbl_transaction" set "updated_date"=$4,"paymentstatus_id"=$1,"active_status"=$5 where "transaction_id" = $2 and module_id = $3`, [paymentstatus_id, transaction_id, module_id, createupdate_date, 1]);
                        await client.query(`UPDATE "tbl_consultation" set "updated_date"=$1 where "appointment_id" = $2`, [createupdate_date, appointment_id]);
                        var update_result = await client.query(`UPDATE "tbl_appointment" set "paymentstatus_id"=$1,"updated_date"=$2 where "appointment_id" = $3 `, [paymentstatus_id, createupdate_date, appointment_id]);
                        update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    }
                    if (module_id == 2) {
                        await client.query(`UPDATE "tbl_transaction" set "updated_date"=$4,"paymentstatus_id"=$1 where "transaction_id" = $2  and module_id =$3`, [paymentstatus_id, transaction_id, module_id, createupdate_date]);

                        update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    }

                    if (module_id == 3) {
                        await client.query(`UPDATE "tbl_transaction" set "updated_date"=$4,"paymentstatus_id"=$1 where "transaction_id" = $2  and module_id =$3`, [paymentstatus_id, transaction_id, module_id, createupdate_date]);

                        var update_result = await client.query(`UPDATE "tbl_patient_radiology" set "paymentstatus_id"=$1,"updated_date"=$2 where "radiology_test_id" = $3 `, [paymentstatus_id, createupdate_date, ref_no]);
                        update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    }

                    if (module_id == 4) {
                        await client.query(`UPDATE "tbl_transaction" set "updated_date"=$4,"paymentstatus_id"=$1,"active_status"=$5 where "transaction_id" = $2  and module_id =$3`, [paymentstatus_id, transaction_id, module_id, createupdate_date, 1]);

                        var update_result = await client.query(`UPDATE "tbl_patient_lab_details" set "paymentstatus_id"=$1,"updated_date"=$2 where "lab_patient_id" = $3 `, [paymentstatus_id, createupdate_date, ref_no]);
                        update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    }

                    if (module_id == 6) {
                        await client.query(`UPDATE "tbl_transaction" set "updated_date"=$4,"paymentstatus_id"=$1 where "transaction_id" = $2  and module_id =$3`, [paymentstatus_id, transaction_id, module_id, createupdate_date]);

                        var update_result = await client.query(`UPDATE "tbl_patient_radiology" set "paymentstatus_id"=$1,"updated_date"=$2 where "radiology_test_id" = $3 `, [paymentstatus_id, createupdate_date, ref_no]);
                        update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    }


                    if (client) {
                        client.end();
                    }
                    if (update_code == 1) {
                        return constants.userMessage.USER_UPDATED;
                    }
                    else { return '' }
                }
                else {
                    return financialyear_message
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "updatePaymentStatus");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Check payment status jwt 
module.exports.checkPaymentStatusJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "checkPaymentStatusJwt");
        throw new Error(error);
    }
}

//Check payment status
module.exports.checkPaymentStatus = async (req) => {
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
            const { ref_no, module_id } = decoded.data;

            if (decoded) {

                const payment_Check = await client.query(`select count(*) as count FROM tbl_transaction where "ref_no" = $1  and module_id =$2 and paymentstatus_id=1`, [ref_no, module_id]);
                var count_Check = payment_Check && payment_Check.rows[0].count;
                if (client) {
                    client.end();
                }
                if (count_Check != null && count_Check != undefined && count_Check != "") {
                    if (count_Check > 0) {
                        return { message: constants.userMessage.PAID_MESSAGE, status: true }
                    }
                    else
                        return { message: constants.userMessage.PENDING_MESSAGE, status: false }
                }
                else { return '' }
            }
            else {
                return ''
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "checkPaymentStatus");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//clinical Photography service
module.exports.clinicalPhotography = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        // if (req.jwtToken) {
        //     const decoded = await commonService.jwtVerify(req.jwtToken);
        const { imageArray, patient_id, consultation_id, appointment_id, user_id, description_clinicalphotography, deleteArray } = req;
        var fs = require('fs');
        var direction = './images/clinical_photography/' + consultation_id;
        if (!fs.existsSync(direction)) {
            fs.mkdirSync(direction);
        }
        else {
            if (deleteArray && deleteArray.length > 0) {
                for (let i = 0; i < deleteArray.length; i++) {
                    await this.remove_file(direction, consultation_id, deleteArray[i]);
                }
            }
        }
        if (imageArray && imageArray.length > 0) {
            var image_array = imageArray
            for (let i = 0; i < image_array.length; i++) {
                await this.insert_image(direction, i, imageArray[i], patient_id, consultation_id, appointment_id, user_id, description_clinicalphotography)
            }
        }
        await client.query(`UPDATE "clinical_photography" set "description_clinicalphotography"=$1 where "consultation_id" = $2 `, [description_clinicalphotography, consultation_id]);
        if (client) {
            client.end();
        }
        return constants.userMessage.USER_UPLOAD;
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "clinicalPhotography");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
module.exports.remove_file = async function (direction, consultation_id, deleteArray) {
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
        const path = require('path');
        if (fs.existsSync(direction + '/' + deleteArray.fileName)) {
            fs.unlink(direction + '/' + deleteArray.fileName, async (err) => {
                if (err) throw err;
                // if no error, file has been deleted successfully
                else {
                    console.log('File deleted!');
                    await client.query(`DELETE FROM clinical_photography where image_name = $1 and consultation_id = $2`, [deleteArray.fileName, consultation_id])
                    if (client) { client.end(); }
                }
            });
        } else {
            console.log("DOES NOT exist:");
        }
        // await fs.readdir(direction, async (err, files) => {
        //     if (err) throw err;
        //     for (const file of files) {
        //         fs.unlink(path.join(direction, file), async (err) => {
        //             if (err) throw err;
        //             else {
        //                 await client.query(`DELETE FROM clinical_photography where consultation_id=` + consultation_id)
        //                 if (client) { client.end(); }
        //             }
        //         });
        //     }
        // });
        return;
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "remove_file");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.insert_image = async function (direction, i, imageArray, patient_id, consultation_id, appointment_id, user_id, description_clinicalphotography) {
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
        var makerid = await commonService.insertLogs(user_id, "Insert clinicalPhotography");
        var createupdate_date = new Date().setHours(0, 0, 0, 0);
        var time_stemp = new Date().getTime();
        var dataString = imageArray.fileArray;
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        await fs.writeFile(direction + '/' + patient_id + '_' + consultation_id + '_' + time_stemp + '_' + [i + 1] + '_' + imageArray.fileName, response.data, function (err) {
            console.log("The file was saved!");
        })
        const image_max = await client.query(`select coalesce (max(image_id),0) + 1 as mr FROM clinical_photography`)
        var imageid = image_max && image_max.rows[0].mr;
        await client.query(`INSERT INTO "clinical_photography"("consultation_id","appointment_id","patient_id","image_id","image_name","description_clinicalphotography","user_id","maker_id","created_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$9) `, [consultation_id, appointment_id, patient_id, imageid, patient_id + '_' + consultation_id + '_' + time_stemp + '_' + [i + 1] + '_' + imageArray.fileName, description_clinicalphotography, user_id, makerid, createupdate_date]);
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "insert_image");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Consultation clinicalImages jwt 
module.exports.getConsultationclinicalImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getConsultationclinicalImagesJwt");
        throw new Error(error);
    }
}
//Consultation clinicalImages service
module.exports.getConsultationclinicalImages = async (req) => {
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
            const { consultation_id } = decoded.data;
            if (decoded) {
                const image_result = await client.query(`SELECT consultation_id,appointment_id,patient_id,image_id,image_name,description_clinicalphotography from clinical_photography where "consultation_id" = $1 `, [consultation_id]);
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
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getConsultationclinicalImages");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Patient clinicalImages jwt 
module.exports.getPatientclinicalImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getPatientclinicalImagesJwt");
        throw new Error(error);
    }
}
//Consultation clinicalImages service
module.exports.getPatientclinicalImages = async (req) => {
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
                const image_result = await client.query(`SELECT a.consultation_id,a.appointment_id,a.patient_id,a.image_id,a.image_name,a.description_clinicalphotography,row_number() OVER (ORDER BY b.created_date DESC),b.created_date from clinical_photography as a inner join tbl_consultation as b on a.consultation_id = b.consultation_id where a.patient_id = $1 `, [patient_id]);
                let list_imagearray = image_result && image_result.rows ? image_result.rows : [];
                if (client) {
                    client.end();
                }
                if (list_imagearray) {
                    return list_imagearray;
                }
                else { return '' }
            }
            else {
                if (client) { client.end(); }
            }

        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getPatientclinicalImages");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Get Print Details Module
module.exports.getPrintDetails = async (patient_id, module_id, employee_id, fees) => {
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

        const Get_employee = await client.query(`select a.employee_id,a.employee_name from tbl_employee_master as a where a.employee_id =$1 `, [employee_id])

        let get_PrintArray = get_Print && get_Print.rows ? get_Print.rows : [];
        let get_EmployeeArray = Get_employee && Get_employee.rows ? Get_employee.rows : [];
        let get_Accountarray = get_Account && get_Account.rows ? get_Account.rows : [];
        let getPatientArray = get_Patient && get_Patient.rows ? get_Patient.rows : [];
        response_array = {
            "getAccountarray": get_Accountarray, "getPatientArray": getPatientArray,
        }
        var age = await commonService.agecalucation(getPatientArray[0]['age_day'], getPatientArray[0]['age_month'], getPatientArray[0]['age_year'], getPatientArray[0]['dob_type'], getPatientArray[0]['date_of_birth']);
        //  return response_array
        var total_rate = fees.toFixed(2);

        var directory = get_PrintArray[0]['print_folder_name'];
        var foldername = 'labtestreport';
        var filepath = '';
        if (fs.existsSync(directory)) {
            // fs.mkdirSync(directory + foldername);
            filepath = directory + '/print.txt';
        }
        // var directory = get_PrintArray[0]['print_folder_name'];
        // var directory = 'F:/';
        // var foldername = 'labtestreport';
        // var filepath = '';
        // if (fs.existsSync(directory)) {
        //      fs.mkdirSync(directory + foldername);
        //     filepath = directory + foldername + '/labtest1.txt';
        // }
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
            logger.write(formattextLeftRight(getPatientArray[0]['patient_name'], 'Date:' + date, 45) + "\r\n")
            logger.write(formattextLeftRight("#" + getPatientArray[0]['uhid'], 'Time:' + time, 45) + "\r\n")
            logger.write(formattextLeftRight(age + ',' + getPatientArray[0]['gender_name'], 'Doctor Name:' + get_EmployeeArray[0]['employee_name'], 45) + "\r\n")
            logger.write(getPatientArray[0]['mobile_number'] + "\r\n")
            logger.write(getPatientArray[0]['city_name'] + "\r\n")
            logger.write('----------------------------------------------' + "\r\n")
            logger.write(formattextLeftRight('Consultation Fees', 'Rs.' + (total_rate).toString(), 45) + "\r\n")
            logger.write('----------------------------------------------' + "\r\n")
            logger.write(formattextCenter('Greatest wealth is Health !!...', 45, "center") + "\r\n")
            logger.end();
        }
    } catch (error) {
        // await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Consultation", error, "getPrintDetails");
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

async function formattextCenter(textval, length, align) {
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", err, "formattextCenter");
        console.log(err, 'error');
    }

}

async function formattextLeftRight(textval, textval2, length) {
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", err, "formattextLeftRight");
    }
}

//list CashModule jwt 
module.exports.getFinancial_yearJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getFinancial_yearJwt");
        throw new Error(error);
    }
}
//list CashModule List
module.exports.getFinancial_year = async (req) => {
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
                const { module_id } = decoded.data;
                return await commonService.getVoucherId(module_id);

                client.end();
            }
            //   let financial_year = financialId && financialId.rows ? financialId.rows : [];
            //   if (financial_year) {
            //     var financial_year_id = financialId.financial_year_id;
            //     var financialyear_status = financialId.status
            //     var financialyear_message = financialId.message
            //       if (client) {
            //     return list_casharray;
            //   }
            //   else {
            //     return '';
            //   }
            // }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getFinancial_year");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//list CashModule jwt 
module.exports.getAccountMasterJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getAccountMasterJwt");
        throw new Error(error);
    }
}
//list CashModule List
module.exports.getAccountMaster = async (req) => {
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
                const { module_id } = decoded.data;
                return await commonService.getAccountId(module_id);
            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getAccountMaster");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//load Test Details jwt 
module.exports.loadtest_DetailsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "loadtest_DetailsJwt");
        throw new Error(error);
    }
}
//load Test Details
module.exports.loadtest_Details = async (req) => {
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
            const { lab_test_id } = decoded.data;
            if (decoded) {

                const get_Labtest = await client.query(`select a.report_id,b.value,a.created_time,c.employee_id,b.test_id ,d.test_name,b.group_id,e.group_name
                from tbl_lab_report as a inner join
                tbl_lab_report_details as b on b.report_id= a.report_id 
                inner join tbl_transaction as c on
                c.transaction_id = a.transaction_id 
                inner join tbl_lab_test_master as d on d.test_id =  b.test_id
                inner join tbl_lab_test_group_master as e on e.group_id=b.group_id 
                where a.lab_test_id=$1`, [lab_test_id]);
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "loadtest_Details");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//getpatientId jwt 
module.exports.getpatient_idJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getpatient_idJwt");
        throw new Error(error);
    }
}
//getpatientId
module.exports.getpatient_id = async (req) => {
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

                const get_Labtest = await client.query(`select c.report_id,d.test_id,c.lab_test_id,h.group_name,f.test_name,d.value,c.updated_time,f.unit_name 
                from tbl_cash_transaction as a  inner join tbl_transaction as b on
                b.transaction_id = a.transaction_id inner join tbl_lab_report as c on c.transaction_id=a.transaction_id
                 inner join tbl_lab_report_details as d on d.report_id=c.report_id
                inner join tbl_lab_group_test as e on e.test_id=d.test_id and e.group_id =d.group_id
                inner join tbl_lab_test_master as f
                on e.test_id=f.test_id inner join tbl_lab_test_group_master as h on h.group_id=e.group_id
                where a.module_id=4 and b.patient_id=`+ patient_id);

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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getpatient_id");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}

//onchange Drug List Jwt
module.exports.onchangeDrugListJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Master", error, "onchangeDrugListJwt");
        throw new Error(error);
    }
}
//onchange Drug List
module.exports.onchangeDrugList = async (req) => {
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
                const { salt_name } = decoded.data;
                var condition = "";
                if (salt_name === "") {
                    condition = ` where 1=1`
                }
                else {
                    condition = `where salt_name = '` + salt_name + `'`
                }
                const drug_array = await client.query(`select drug_name,salt_name from tbl_drug_master ` + condition)
                if (client) {
                    client.end();
                }

                let drug_list = drug_array && drug_array.rows ? drug_array.rows : [];
                responseData = {
                    "Druglist": drug_list
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Master", error, "onchangeDrugListJwt");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}


// Old Prescription Medicine Jwt 
module.exports.oldPrescriptionJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "oldPrescriptionJwt");
        throw new Error(error);
    }
}
//Old Prescription Medicine
module.exports.oldPrescription = async (req) => {
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
            const { patient_id, old_prescription_id, user_id, doctor_notes, prescription_date, old_prescriptionArray } = decoded.data;
            if (decoded) {
                if (old_prescription_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Old Prescription");
                    const max = await client.query(`select coalesce(max(old_prescription_id),0) + 1 as mr FROM tbl_old_prescription`)
                    var maxprescription = max && max.rows[0].mr;
                    const create_result = await client.query(`INSERT INTO "tbl_old_prescription"("old_prescription_id","patient_id","doctor_notes","prescription_date","maker_id","user_id","created_date") values ($1, $2, $3,$4,$5,$6,CURRENT_TIMESTAMP) `, [maxprescription, patient_id, doctor_notes, prescription_date, makerid, user_id]);

                    if (old_prescriptionArray && old_prescriptionArray.length > 0) {
                        for (let i = 0; i < old_prescriptionArray.length; i++) {
                            var mn = false, af = false, en = false, nt = false;
                            if (old_prescriptionArray[i].mn_value == 1 || old_prescriptionArray[i].mn_value == true) {
                                mn = true
                            }
                            if (old_prescriptionArray[i].af_value == 1 || old_prescriptionArray[i].af_value == true) {
                                af = true
                            }
                            if (old_prescriptionArray[i].en_value == 1 || old_prescriptionArray[i].en_value == true) {
                                en = true
                            }
                            if (old_prescriptionArray[i].nt_value == 1 || old_prescriptionArray[i].nt_value == true) {
                                nt = true
                            }
                            const maxprescription_id = await client.query(`select coalesce(max(patient_prescription_id),0) + 1 as max FROM tbl_old_prescription_details`)
                            var maxprescription_Check = maxprescription_id && maxprescription_id.rows[0].max;

                            await client.query(`INSERT INTO "tbl_old_prescription_details"(patient_prescription_id,salt_name,drug_name,dosage_name,comment,duration,old_prescription_id,route_name,referral_name,duration_name,unit_name,mn,af,en,nt,user_id,frequency,display_unit) values ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) `, [maxprescription_Check, old_prescriptionArray[i].salt_name, old_prescriptionArray[i].medicine_name, old_prescriptionArray[i].dosage, old_prescriptionArray[i].comment, old_prescriptionArray[i].duration_value, maxprescription, old_prescriptionArray[i].route_name, old_prescriptionArray[i].referral_name, old_prescriptionArray[i].duration_name, old_prescriptionArray[i].unit_name, mn, af, en, nt, user_id, old_prescriptionArray[i].frequency, old_prescriptionArray[i].display_unit]);
                        }
                    }

                    let create_consultation = create_result && create_result.rowCount ? create_result.rowCount : 0;
                    if (create_consultation == 1) {
                        return response = { "message": constants.userMessage.USER_UPDATED, "status": true };
                    }
                    else {
                        if (client) {
                            client.end();
                        } return ''
                    }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Old Prescription");
                    const consultation_Count = await client.query(`select count(*) as count FROM tbl_old_prescription where old_prescription_id =` + old_prescription_id)
                    var count_Check = consultation_Count && consultation_Count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {

                        const update_result = await client.query(`UPDATE "tbl_old_prescription" set "patient_id"=$1,"doctor_notes"=$2,"maker_id"=$3,"prescription_date"=$4,"user_id"=$5,"updated_date"=CURRENT_TIMESTAMP where "old_prescription_id" = $6 `, [patient_id, doctor_notes, makerid, prescription_date, user_id, old_prescription_id]);

                        await client.query(`DELETE FROM tbl_old_prescription_details where old_prescription_id=` + old_prescription_id)

                        if (old_prescriptionArray && old_prescriptionArray.length > 0) {
                            for (let i = 0; i < old_prescriptionArray.length; i++) {
                                var mn = false, af = false, en = false, nt = false;
                                if (old_prescriptionArray[i].mn_value == 1 || old_prescriptionArray[i].mn_value == true) {
                                    mn = true
                                }
                                if (old_prescriptionArray[i].af_value == 1 || old_prescriptionArray[i].af_value == true) {
                                    af = true
                                }
                                if (old_prescriptionArray[i].en_value == 1 || old_prescriptionArray[i].en_value == true) {
                                    en = true
                                }
                                if (old_prescriptionArray[i].nt_value == 1 || old_prescriptionArray[i].nt_value == true) {
                                    nt = true
                                }
                                const maxprescription_id = await client.query(`select coalesce(max(patient_prescription_id),0) + 1 as max FROM tbl_old_prescription_details`)
                                var maxprescription_Check = maxprescription_id && maxprescription_id.rows[0].max;

                                await client.query(`INSERT INTO "tbl_old_prescription_details"(patient_prescription_id,salt_name,drug_name,dosage_name,comment,duration,old_prescription_id,route_name,referral_name,duration_name,unit_name,mn,af,en,nt,user_id,frequency,display_unit) values ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) `, [maxprescription_Check, old_prescriptionArray[i].salt_name, old_prescriptionArray[i].medicine_name, old_prescriptionArray[i].dosage, old_prescriptionArray[i].comment, old_prescriptionArray[i].duration_value, old_prescription_id, old_prescriptionArray[i].route_name, old_prescriptionArray[i].referral_name, old_prescriptionArray[i].duration_name, old_prescriptionArray[i].unit_name, mn, af, en, nt, user_id, old_prescriptionArray[i].frequency, old_prescriptionArray[i].display_unit]);
                            }
                        }


                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (update_code == 1) {
                            return response = { "message": constants.userMessage.USER_UPDATED, "status": true };
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "oldPrescription");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Edit Old Prescription Jwt
module.exports.editOldPrescriptionJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "editOldPrescriptionJwt");
        throw new Error(error);
    }
}

//Edit Old Prescription 
module.exports.editOldPrescription = async (req) => {
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
            const { patient_id } = decoded.data
            if (decoded) {
                var response = {}
                const exeQuery1 = await client.query(`Select a.old_prescription_id,a.prescription_date,a.doctor_notes,b.salt_name,b.drug_name as medicine_name,b.dosage_name as dosage,b.comment,b.duration as duration_value,b.route_name,b.referral_name,b.duration_name,b.unit_name,b.mn as mn_value,b.af as af_value,b.en as en_value,b.nt as nt_value,b.frequency,b.patient_prescription_id as prescription_id,b.display_unit from tbl_old_prescription as a 
                inner join  tbl_old_prescription_details as b on a.old_prescription_id = b.old_prescription_id
                where a.patient_id = $1`, [patient_id]);

                if (client) {
                    client.end();
                }
                var oldprescriptionArray = exeQuery1 && exeQuery1.rows ? exeQuery1.rows : [];

                response = {
                    "OldPrescriptionList": oldprescriptionArray
                }
                if (response) {
                    return response;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "editOldPrescriptionJwt");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Report Photography service
module.exports.reportPhotography = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        const { imageArray, patient_id, user_id, investigation_date, type_id } = req;
        var direction = '';
        const get_Print = await client.query(`select image_folder_name from tbl_print_setting `);
        let get_PrintArray = get_Print && get_Print.rows ? get_Print.rows : [];
        var path = get_PrintArray[0]['image_folder_name'];
        var fs = require('fs');
        direction = path +'images/report_photography/'+  patient_id;
        if (!fs.existsSync(direction)) {
            fs.mkdirSync(direction);
        }
        if (imageArray && imageArray.length > 0) {
            var image_array = imageArray
            for (let i = 0; i < image_array.length; i++) {
                await this.insert_report_image(direction, i, imageArray[i], patient_id, user_id, investigation_date, type_id)
            }
        }
        if (client) {
            client.end();
        }
        return constants.userMessage.USER_UPLOAD;
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "clinicalPhotography");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.insert_report_image = async function (direction, i, imageArray, patient_id, user_id, investigation_date, type_id) {
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
        var makerid = await commonService.insertLogs(user_id, "Insert ReportPhotography");
        var time_stemp = new Date().getTime();
        var dataString = imageArray.fileArray;
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        await fs.writeFile(direction + '/' + patient_id + '_' + time_stemp + '_' + [i + 1] + '_' + imageArray.fileName, response.data, function (err) {
            console.log("The file was saved!");
        })
        const report_max = await client.query(`select coalesce (max(report_id),0) + 1 as mr FROM tbl_report_details`)
        var report_id = report_max && report_max.rows[0].mr;
        await client.query(`INSERT INTO "tbl_report_details"("investigation_date","type_id","patient_id","report_id","image_name","image_type","user_id","maker_id","created_date") values ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP) `, [investigation_date, type_id, patient_id, report_id, patient_id + '_' + time_stemp + '_' + [i + 1] + '_' + imageArray.fileName, imageArray.fileType, user_id, makerid]);
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "insert_report_image");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Consultation Report Image jwt 
module.exports.getConsultationReportImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getConsultationReportImagesJwt");
        throw new Error(error);
    }
}
///Consultation Report Image
module.exports.getConsultationReportImages = async (req) => {
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
                const array = await client.query(`select a.investigation_date, a.type_id,b.type_name,c.patient_name,c.uhid,c.patient_id from tbl_report_details as a inner join tbl_def_report_type as b on a.type_id = b.type_id
                inner join tbl_patient as c on a.patient_id = c.patient_id where a.patient_id =  $1 group by a.investigation_date,a.type_id,b.type_name,c.patient_name,c.uhid,c.patient_id order by a.investigation_date desc`, [patient_id])

                var reportarray = array && array.rows ? array.rows : [];
                if (reportarray.length > 0) {
                    for (let i = 0; i < reportarray.length; i++) {
                        var date = moment(reportarray[i].investigation_date).format('YYYY-MM-DD');
                        const exeQuery1 = await client.query(`select * from (select patient_id,image_type,image_name,report_id,investigation_date  from tbl_report_details where type_id = $1 and to_char(investigation_date,'YYYY-MM-DD') = $2) as dev order by dev.investigation_date desc`, [reportarray[i].type_id, date]);
                        let list_imagearray = exeQuery1 && exeQuery1.rows ? exeQuery1.rows : [];
                        reportarray[i]['ImageArray'] = list_imagearray
                    }
                }

                response = {
                    "ImageList": reportarray
                }
                if (response) {
                    return response;
                }
                else {
                    return '';
                }

                // const image_result = await client.query(`select patient_id,image_type,image_name,report_id,investigation_date  from tbl_report_details where patient_id = $1 `, [patient_id]);
                // let list_imagearray = image_result && image_result.rows ? image_result.rows : [];
                // if (client) {
                //     client.end();
                // }
                // if (list_imagearray) {
                //     return list_imagearray;
                // }
                // else { return '' }
            } else {
                if (client) { client.end(); }
            }

        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "getConsultationReportImages");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Edit Report Image jwt 
module.exports.editReportImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "editReportImagesJwt");
        throw new Error(error);
    }
}
///Edit Report Image
module.exports.editReportImages = async (req) => {
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
            const { patient_id, date } = decoded.data;
            if (decoded) {
                const array = await client.query(`select to_char(a.investigation_date,'YYYY-MM-DD HH:MM:SS') as investigation_date, a.type_id,b.type_name from tbl_report_details as a inner join tbl_def_report_type as b on a.type_id = b.type_id inner join tbl_patient as c on a.patient_id = c.patient_id where a.patient_id =  $1 and  to_char(a.investigation_date,'YYYY-MM-DD') = $2 group by a.investigation_date,a.type_id,b.type_name`, [patient_id, date])

                var reportarray = array && array.rows ? array.rows : [];
                if (reportarray.length > 0) {
                    for (let i = 0; i < reportarray.length; i++) {
                        var date_value = moment(reportarray[i].investigation_date).format('YYYY-MM-DD');
                        const exeQuery1 = await client.query(`select * from (select patient_id,2 as add_flag,image_type,image_name,report_id,to_char(investigation_date,'YYYY-MM-DD HH:MM:SS') as investigation_date  from tbl_report_details where type_id = $1 and to_char(investigation_date,'YYYY-MM-DD') = $2) as dev order by dev.investigation_date desc`, [reportarray[i].type_id, date_value]);
                        let list_imagearray = exeQuery1 && exeQuery1.rows ? exeQuery1.rows : [];
                        reportarray[i]['ImageArray'] = list_imagearray
                    }
                }

                response = {
                    "ImageList": reportarray
                }
                if (response) {
                    return response;
                }
                else {
                    return '';
                }
            } else {
                if (client) { client.end(); }
            }

        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "editReportImages");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Update Report Image
module.exports.updateReportImage = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        const { imageArray, patient_id, user_id, investigation_date, type_id, deleteArray } = req;
        var direction = '';
        const get_Print = await client.query(`select image_folder_name from tbl_print_setting `);
        let get_PrintArray = get_Print && get_Print.rows ? get_Print.rows : [];
        var path = get_PrintArray[0]['image_folder_name'];
        var fs = require('fs');
        direction = path +'images/report_photography/'+  patient_id;
        if (deleteArray && deleteArray.length > 0) {
            for (let i = 0; i < deleteArray.length; i++) {
                await this.remove_report_file(direction, deleteArray[i]);
            }
        }
        if (imageArray && imageArray.length > 0) {
            var image_array = imageArray
            for (let i = 0; i < image_array.length; i++) {
                await this.insert_report_image(direction, i, imageArray[i], patient_id, user_id, investigation_date, type_id)
            }
        }
        if (client) { client.end(); }
        return constants.userMessage.USER_UPLOAD;
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "createConsultation");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.remove_report_file = async function (direction, deleteArray) {
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
        if (fs.existsSync(direction + '/' + deleteArray.image_name)) {

            await client.query(`DELETE FROM tbl_report_details where image_name = $1 and report_id = $2`, [deleteArray.image_name, deleteArray.report_id])
            if (client) { client.end(); }

            fs.unlink(direction + '/' + deleteArray.image_name, async (err) => {
                if (err) throw err;
                // if no error, file has been deleted successfully
                else {
                    console.log('File deleted!');
                }
            });
        } else {
            console.log("DOES NOT exist:");
        }
        return;
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "remove_file");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}


//Delete Report Image Jwt
module.exports.deleteReportImageJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "deleteReportImageJwt");
        throw new Error(error);
    }
}
///Delete Report Image
module.exports.deleteReportImage = async (req) => {
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
            const {deleteArray,patient_id} = decoded.data;
            if (decoded) {
                var direction = '';
                const get_Print = await client.query(`select image_folder_name from tbl_print_setting `);
                let get_PrintArray = get_Print && get_Print.rows ? get_Print.rows : [];
                var path = get_PrintArray[0]['image_folder_name'];
                direction = path +'images/report_photography/'+  patient_id;
                if (deleteArray && deleteArray.length > 0) {
                    for (let i = 0; i < deleteArray.length; i++) {
                        await this.remove_report_file(direction, deleteArray[i]);
                    }
                }
                if (client) { client.end(); }
                return constants.userMessage.USER_DELETED;
            } else {
                if (client) { client.end(); }
            }

        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Consultation", error, "deleteReportImageJwt");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}