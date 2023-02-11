const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create Appointment jwt 
module.exports.createAppointmentJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "createAppointmentJwt");
        throw new Error(error);
    }
}
//create Appointment service
module.exports.createAppointment = async (req) => {
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

            const { appointment_id, patient_id, user_id, employee_id, appointment_date, tentative_time, token_number, appointment_type_id, appointment_mode_id, patient_category_id, fees, remarks, session_id, height, weight, spo2, blood_pressure, temparature, review_date, bmi, cbg, module_id, pulse } = decoded.data;
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
            var start_timedate = new Date().getTime();
            if (decoded) {

                if (appointment_id == 0) {
                    if (account_status == true) {
                        if (voucher_status == true) {
                            var makerid = await commonService.insertLogs(user_id, "Insert Appointment");
                            const maxtransaction = await client.query(`select coalesce(max(transaction_id),0) + 1 as transaction FROM tbl_transaction`)
                            var maxtransaction_id = maxtransaction && maxtransaction.rows[0].transaction;
                            const max = await client.query(`select coalesce(max(appointment_id),0) + 1 as mr FROM tbl_appointment`)
                            var maxappointment = max && max.rows[0].mr;
                            var insert_sessionID = 0;
                            const check_Activesession = await client.query(`select COALESCE(max(session_id),0) as activesession FROM tbl_session where end_time = 0 `)
                            var activesession = check_Activesession && check_Activesession.rows[0].activesession;
                            if (activesession && activesession != 0 && activesession != null && activesession != undefined && activesession != "") {
                                insert_sessionID = activesession;
                            }

                            else {
                                const maxsession = await client.query(`select coalesce(max(session_id),0) + 1 as session_id FROM tbl_session`)
                                var maxsession_id = maxsession && maxsession.rows[0].session_id;
                                insert_sessionID = maxsession_id;
                                await client.query(`INSERT INTO "tbl_session"("session_id","start_time","end_time","maker_id","user_id") values ($1, $2, $3,$4,$5) `, [maxsession_id, start_timedate, 0, makerid, user_id]);
                            }

                            const Maxtoken_no = await client.query(`select COALESCE(max(COALESCE(token_number,0))+1,1) as token_number from tbl_appointment where session_id = ` + insert_sessionID)
                            var token_no = Maxtoken_no && Maxtoken_no.rows[0].token_number;
                            if (token_no && token_no != 0 && token_no != null && token_no != undefined && token_no != "") {
                                const create_result = await client.query(`INSERT INTO "tbl_appointment"("session_id","appointment_id","token_number","patient_id","employee_id","appointment_date","tentative_time","appointment_type_id","appointment_mode_id","patient_category_id","fees","remarks","height","weight","spo2","blood_pressure","temparature","appointment_status_id","paymentstatus_id","maker_id","user_id","review_date","bmi","cbg","pulse","created_time","created_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,CURRENT_TIMESTAMP)`, [insert_sessionID, maxappointment, token_no, patient_id, employee_id, appointment_date, tentative_time, appointment_type_id, appointment_mode_id, patient_category_id, fees, remarks, height, weight, spo2, blood_pressure, temparature, 2, 2, makerid, user_id, review_date, bmi, cbg, pulse, start_timedate]);

                                const create_result1 = await client.query(`INSERT INTO "tbl_transaction"("transaction_id","employee_id","patient_id","module_id","paymentstatus_id","total_amount","active_status","maker_id","user_id",ref_no,created_time,"account_id","voucher_no","financial_year_id","created_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,CURRENT_TIMESTAMP)`, [maxtransaction_id, employee_id, patient_id, module_id, 1, fees, 0, makerid, user_id, maxappointment, start_timedate, account_id, voucher_id, financial_year_id]);
                                let create_patient1 = create_result1 && create_result1.rowCount ? create_result1.rowCount : 0;
                                if (client) {
                                    client.end();
                                }
                                let create_patient = create_result && create_result.rowCount ? create_result.rowCount : 0;
                                if (create_patient == 1) {
                                    return constants.userMessage.USER_CREATED;
                                }
                                else { return '' }
                            }
                            else {
                                console.log("token ")
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
                    var makerid = await commonService.insertLogs(user_id, "Update Appointment");
                    const count = await client.query(`select count(*) as count FROM tbl_appointment where appointment_id =` + appointment_id)
                    var count_Check = count && count.rows[0].count

                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_appointment" set "patient_id"=$1, "employee_id"=$2,"appointment_date"=$3,"tentative_time"=$4,"token_number"=$5,"appointment_type_id"=$6,"appointment_mode_id"=$7,"patient_category_id"=$8,"fees"=$9,"remarks"=$10,"session_id"=$11,"height"=$12,"weight"=$13,"spo2"=$14,"blood_pressure"=$15,"temparature"=$16,"maker_id"=$17,"user_id"=$18,"review_date"=$19,"cbg"=$20,"bmi"=$21 ,"pulse"=$22, "updated_date"=CURRENT_TIMESTAMP where "appointment_id" = $23 `, [patient_id, employee_id, appointment_date, tentative_time, token_number, appointment_type_id, appointment_mode_id, patient_category_id, fees, remarks, session_id, height, weight, spo2, blood_pressure, temparature, makerid, user_id, review_date, cbg, bmi, pulse, appointment_id]);

                        await client.query(`UPDATE "tbl_transaction" set "updated_date"=CURRENT_TIMESTAMP,"paymentstatus_id"=$1,"total_amount"=$2,"active_status"=$3 where "ref_no" = $4 and module_id = $5`, [2, fees, 0, appointment_id, module_id]);
                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (client) {
                            client.end();
                        }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "createAppointment");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Delete Appointment jwt 
module.exports.deleteAppointmentJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "deleteAppointmentJwt");
        throw new Error(error);
    }
}
//Delete Appointment service
module.exports.deleteAppointment = async (req) => {
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
            const { appointment_id, user_id } = decoded.data;
            if (decoded) {
                await commonService.insertLogs(user_id, "Delete Appointment");
                const appointment_Count = await client.query('select count(*) as count FROM tbl_appointment where appointment_id =' + appointment_id)
                var count_Check = appointment_Count && appointment_Count.rows[0].count;
                if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                    const create_result = await client.query(`DELETE FROM tbl_appointment where appointment_id = $1 `,
                        [appointment_id]);
                    if (client) {
                        client.end();
                    }
                    let appointmentcode = create_result && create_result.rowCount ? create_result.rowCount : 0;
                    if (appointmentcode == 1) {
                        return constants.userMessage.USER_DELETED;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "deleteAppointment");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//List Appointment jwt 
module.exports.listAppointmentJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "listAppointmentJwt");
        throw new Error(error);
    }
}
//List Appointment List
module.exports.listAppointment = async (req) => {
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
            const { session_id,start_date,employee_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                var date = new Date(), consulted_Count = 0, queue_Count = 0, skipped_Count = 0;
                var employee = '',session='';
                if (employee_id == -1) {
                    employee = ' 1=1'
                }
                else {
                    employee = ` derv.employee_id = ` + employee_id
                }
                if(session_id == -1) {
                    session = ' 1=1'
                }
                else {
                    session = ` derv.session_id = ` + session_id
                }
                const list_Appointment = await client.query(`SELECT derv.* from (select a.appointment_id,(select employee_name from tbl_employee_master where employee_id=a.user_id) as created_by,a.patient_id,a.employee_id,a.appointment_date,a.fees,a.token_number,a.session_id,
                a.appointment_status_id,a.paymentstatus_id,a.patient_category_id,a.appointment_mode_id,a.height,a.weight,
                a.spo2,a.blood_pressure,a.temparature,a.bmi,a.cbg,a.pulse,b.date_of_birth,b.age_year,b.age_month,b.age_day,b.dob_type,
                b.gender_id,b.patient_name,b.uhid,b.guardian_name,b.tag_id,k.display_code,c.appointment_status,
                d.paymentstatus_name,e.patient_category_name,f.employee_name,f.specialization_id,f.employee_category_id,
                b.city_id,i.appointment_mode,j.gender_name,n.transaction_id,n.ref_no,n.voucher_no,n.account_id,n.created_time,
                n.module_id,n.total_amount as transaction_rate,o.city_name,STRING_AGG (r.specialization, ',') specialization, 
                STRING_AGG (cast(r.specialization_id as text), ',') specialization_id,  case when a.appointment_status_id = 2 
                then 1 when a.appointment_status_id = 3 then 2
                when a.appointment_status_id = 1 then 3 when a.appointment_status_id = 4 then 4 end as ordernumber, case when (select count(*) from tbl_appointment as ta where 
                            ta.patient_id=a.patient_id)>1 then 'OLD' else 'NEW' end as employee_type 
                from tbl_appointment as a left outer join  employee_specialization as p on p.employee_id=a.employee_id 
                left outer join tbl_def_specialization as r on r.specialization_id= p.specialization_id inner join 
                tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_appointment_status as c on 
                a.appointment_status_id=c.appointment_status_id inner join tbl_def_payment_status as d on 
                a.paymentstatus_id = d.paymentstatus_id inner join tbl_def_patient_category as e on 
                a.patient_category_id = e.patient_category_id inner join tbl_employee_master as f on 
                a.employee_id = f.employee_id  inner join tbl_def_appointment_mode as i on 
                a.appointment_mode_id = i.appointment_mode_id inner join tbl_def_gender as j on 
                b.gender_id = j.gender_id inner join tbl_def_tag as k on b.tag_id = k.tag_id inner join 
                tbl_def_city as o on b.city_id = o.city_id left outer join tbl_transaction as n 
                on a.appointment_id = n.ref_no group by a.appointment_id,b.patient_id,c.appointment_status,
                d.paymentstatus_name,e.patient_category_name,f.employee_id,i.appointment_mode,j.gender_name,
                k.display_code,n.transaction_id,o.city_name) as derv where module_id = 1 and to_char(derv.appointment_date,'YYYY-MM-DD') = $1 and `+ employee +` and `+ session +` order by ordernumber,token_number asc`, [start_date]);
               

                const totalvalue = await client.query(`select count(*) as count from tbl_appointment`);

                const consultation_status = await client.query(`SELECT a.appointment_status_id,appointment_status,count(b.*) from tbl_def_appointment_status as a left join 
                tbl_appointment as b on a.appointment_status_id=b.appointment_status_id and b.session_id = $1
                  group by a.appointment_status_id,a.appointment_status `, [session_id])

                const ongoingtoken = await client.query(`select token_number as count from tbl_appointment where session_id = ` + session_id + `and appointment_status_id=2 order by appointment_id limit 1`)
                const currentvalue = await client.query(`select COALESCE(max(COALESCE(token_number,0))+1,1) as token_number from tbl_appointment where session_id = ` + session_id)
                if (client) {
                    client.end();
                }
                var list_Appointmentarray = list_Appointment && list_Appointment.rows ? list_Appointment.rows : [];
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
                var ongoing_Token = ongoingtoken && ongoingtoken.rows[0] ? ongoingtoken.rows[0] : 0
                var current_Token = currentvalue && currentvalue.rows[0] ? currentvalue.rows[0] : 0
                response_Array = {
                    "AppointmentArray": list_Appointmentarray, "total_Count": total_Count, "consulted_Count": consulted_Count, "queue_Count": queue_Count, "skipped_Count": skipped_Count, "ongoing_Token": ongoing_Token, "current_Token": current_Token, "skipped_Count": skipped_Count
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "listAppointment");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Edit Appointment jwt 
module.exports.editloadAppointmentJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "editloadAppointmentJwt");
        throw new Error(error);
    }
}
//Edit Appointment List
module.exports.editloadAppointment = async (req) => {
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
                const edit_Appointment = await client.query(`select a.appointment_id,a.patient_id,a.employee_id,a.appointment_date,a.fees,a.tentative_time,a.token_number,a.appointment_type_id,a.appointment_mode_id,a.session_id,a.remarks,a.height,a.weight,a.spo2,a.review_date,a.blood_pressure,a.temparature,a.patient_category_id,a.bmi,a.cbg,a.pulse,b.patient_name,b.guardian_name,b.date_of_birth,b.uhid,b.mobile_number,c.appintment_type,b.gender_id,b.city_id,d.appointment_mode,e.patient_category_name,f.city_name,g.gender_name,h.employee_name from tbl_appointment as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_appointment_type as c on a.appointment_type_id=c.appointment_type_id inner join tbl_def_appointment_mode as d on a.appointment_mode_id = d.appointment_mode_id inner join tbl_def_patient_category as e on a.patient_category_id = e.patient_category_id inner join tbl_def_city as f on b.city_id = f.city_id inner join tbl_def_gender as g on b.gender_id = g.gender_id inner join tbl_employee_master as h on a.employee_id = h.employee_id where a.appointment_id = $1`, [appointment_id]);
                if (client) {
                    client.end();
                }
                let edit_Appointmentarray = edit_Appointment && edit_Appointment.rows ? edit_Appointment.rows : [];
                if (edit_Appointmentarray) {
                    return edit_Appointmentarray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "editloadAppointment");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Search Appointment jwt 
module.exports.searchPatientsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "searchPatientsJwt");
        throw new Error(error);
    }
}
//Search Appointment List
module.exports.searchPatients = async (req) => {
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
            const { search_Value,search_Type,from_Date,to_Date} = decoded.data;
            if (decoded) {
                var string="";
                if(search_Type ==='1'){
                    string = `(Lower(a.uhid)::text like '%`+ search_Value +`%' or Lower(a.patient_name) like '%`+ search_Value +`%' or a.mobile_number like '%`+ search_Value +`%' or Lower(a.old_patient_id) like '%`+ search_Value +`%')`;
                }
                if(search_Type ==='2'){
                    string = `(to_date(to_char(a.created_date,'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN to_date( '` + from_Date + `','YYYY-MM-DD') and to_date( '` + to_Date + `','YYYY-MM-DD'))`;
                }
                const search_Appointment = await client.query(`select a.patient_id,a.patient_name,a.guardian_name,a.date_of_birth,a.gender_id,a.city_id,a.mobile_number,a.uhid,a.old_patient_id,a.age_day,a.tag_id,a.age_month,a.age_year,a.dob_type,b.gender_name,c.city_name from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_city as c on a.city_id=c.city_id  where ` + string + ` and a.active_status = 1`);
                if (client) {
                    client.end();
                }
                let search_Appointmentarray = search_Appointment && search_Appointment.rows ? search_Appointment.rows : [];
                if (search_Appointmentarray) {
                    return search_Appointmentarray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "searchPatients");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Session jwt 
module.exports.createSessionJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "createSessionJwt");
        throw new Error(error);
    }
}
//Create Session
module.exports.createSession = async (req) => {
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
            const { session_id, user_id, start_time, end_time } = decoded.data;
            if (decoded) {
                var response = {}
                var makerid = await commonService.insertLogs(user_id, "Create Session");
                const max = await client.query(`select coalesce(max(session_id),0) + 1 as mr FROM tbl_session`)
                var maxsession = max && max.rows[0].mr;
                if (session_id == 0) {
                    const create_result = await client.query(`INSERT INTO "tbl_session"("session_id","start_time","end_time","maker_id","user_id") values ($1, $2, $3,$4,$5) `, [maxsession, start_time, end_time, makerid, user_id]);
                    if (client) {
                        client.end();
                    }
                    let create_session = create_result && create_result.rowCount ? create_result.rowCount : 0;
                    if (create_session == 1) {
                        return response = {
                            "session_id": maxsession, "message": constants.userMessage.STARTSESSION,
                        }
                    }
                    else { return '' }
                }
                else {
                    var id = await commonService.insertLogs(user_id, "Update Session");
                    const session_Count = await client.query(`select count(*) as count FROM tbl_session where session_id =` + session_id)
                    var count_Check = session_Count && session_Count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        await client.query(`UPDATE "tbl_appointment" set "appointment_status_id"=$1 where "session_id" = $2 and "appointment_status_id" IN (2,3)`, [4, session_id]);

                        var update_result = await client.query(`UPDATE "tbl_session" set "end_time"=$1,"maker_id"=$2,"user_id"=$3 where "session_id" = $4 `, [end_time, id, user_id, session_id]);

                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (update_code == 1) {
                            return constants.userMessage.ENDSESSION;
                        }
                        if (client) {
                            client.end();
                        }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "createSession");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Get Session jwt 
module.exports.getSessionidJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "getSessionidJwt");
        throw new Error(error);
    }
}
//Get Session jwt 
module.exports.getSessionid = async (req) => {
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
            const { user_id } = decoded.data;
            var response = {}
            if (decoded) {
                const max = await client.query(`select session_id,start_time FROM tbl_session 
                where end_time = 0 order by session_id desc limit 1`)

                if (client) {
                    client.end();
                }
                var maxsession = max && max.rows[0];

                if (maxsession) {
                    return response = { "getsession_id": maxsession, "status": true, }
                }
                else {
                    return response = { "message": constants.userMessage.NOTENDSESSION, "status": false }
                }

                // if(maxsession == 0){
                //     return  response =  {"message":constants.userMessage.NOTENDSESSION,"status":false}
                // }
                // else{
                //     return response = {"getsession_id":maxsession,"status":true,}
                // }
            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "getSessionid");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Skip Jwt
module.exports.skipResumePatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "skipResumePatientJwt");
        throw new Error(error);
    }
}
//Skip Patient
module.exports.skipResumePatient = async (req) => {
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
            var response = {}
            if (decoded) {
                const appointment_code = await client.query(`select appointment_status_id from tbl_appointment where appointment_id = ` + appointment_id)
                var previous_Check = appointment_code && appointment_code.rows[0].appointment_status_id
                if (previous_Check == 2) {
                    const update_result = await client.query(`UPDATE "tbl_appointment" set "appointment_status_id"=$1 where "appointment_id" = $2 `, [3, appointment_id]);
                    let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    if (update_code == 1) {
                        return response = { "message": constants.userMessage.SKIPPEDPATIENT, "status": false }
                    }
                    if (client) { client.end(); }
                }
                else if (previous_Check == 3) {
                    const queue_result = await client.query(`UPDATE "tbl_appointment" set "appointment_status_id"=$1 where "appointment_id" = $2 `, [2, appointment_id]);
                    let queue_code = queue_result && queue_result.rowCount ? queue_result.rowCount : 0;
                    if (queue_code == 1) {
                        return response = { "message": constants.userMessage.SKIPPEDRESUME, "status": true }
                    }
                    if (client) { client.end(); }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "skipResumePatient");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Get Token Jwt
module.exports.getTokenJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "getTokenJwt");
        throw new Error(error);
    }
}
//Get Token 
module.exports.getToken = async (req) => {
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
            const { session_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const currentvalue = await client.query(`select COALESCE(max(COALESCE(token_number,0))+1,1) as token_number from tbl_appointment where session_id = ` + session_id)

                // select COALESCE(max(COALESCE(token_number,0))+1,1) as token_number from tbl_appointment where session_id = `+ session_id
                if (client) {
                    client.end();
                }
                var current_Token = currentvalue && currentvalue.rows[0].token_number ? currentvalue.rows[0].token_number : 0
                response_Array = {
                    "current_Token": current_Token
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "getToken");

        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Get Sessions jwt 
module.exports.getSessionsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "getSessionsJwt");
        throw new Error(error);
    }
}
//Get Sessions jwt 
module.exports.getSessions = async (req) => {
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
            const { start_time } = decoded.data;
            var response = {}
            if (decoded) {
                const getsession = await client.query(`select session_id FROM tbl_session where TO_DATE(to_char(to_timestamp(start_time/1000),'yyyy-mm-dd'),'yyyy-mm-dd')= TO_DATE(to_char(to_timestamp($1::bigint/1000),'yyyy-mm-dd'),'yyyy-mm-dd')`, [start_time])
                if (client) { client.end(); }
                let create_session = getsession && getsession.rows ? getsession.rows : [];
                if (response) {
                    return response = {
                        "getSessions": create_session, "message": constants.userMessage.LIST_CREATED
                    }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "getSessions");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Prescription Upload service
module.exports.PrescriptionUpload = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {

        const { deleteArray, imageArray, patient_id, employee_id, prescription_id, appointment_id, user_id, active_status, uhid } = req;
        var temp_prescription_id = prescription_id;

        const count = await client.query(`select prescription_id FROM tbl_prescription where appointment_id = $1`, [appointment_id])
        if (count.rows.length > 0) {
            temp_prescription_id = count && count.rows[0].prescription_id;
        }
        else {
            temp_prescription_id = 0;
        }

        var createupdate_date = new Date().setHours(0, 0, 0, 0);

        if (temp_prescription_id == 0) {
            var makerid = await commonService.insertLogs(user_id, "Insert Prescription");
            const prescription_max = await client.query(`select coalesce (max(prescription_id),0) + 1 as mr FROM tbl_prescription`)
            const prescriptionid = prescription_max && prescription_max.rows[0].mr;
            await client.query(`INSERT INTO "tbl_prescription"("prescription_id","appointment_id","employee_id","user_id","maker_id","created_date","patient_id","active_status","updated_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$6) `, [prescriptionid, appointment_id, employee_id, user_id, makerid, createupdate_date, patient_id, active_status]);
            temp_prescription_id = prescription_max.rows[0].mr;
        }
        else {
            await client.query(`UPDATE "tbl_prescription" set "updated_date"=$1 where "prescription_id" = $2 `, [createupdate_date, prescription_id]);
        }

        var fs = require('fs');
        var direction = './images/Prescription/' + uhid;

        if (!fs.existsSync(direction)) {
            fs.mkdirSync(direction);
        }
        else {
            if (deleteArray && deleteArray.length > 0) {
                for (let i = 0; i < deleteArray.length; i++) {
                    await this.remove_file(direction, appointment_id, deleteArray[i]);
                }
            }
        }
        if (imageArray && imageArray.length > 0) {
            for (let i = 0; i < imageArray.length; i++) {
                await this.insert_image(direction, i, imageArray[i], temp_prescription_id, user_id)
            }
        }
        if (client) {
            client.end();
        }
        return { message: constants.userMessage.USER_UPLOAD, prescription_id: temp_prescription_id };
        // }
        // else
        // {
        //     if (client) { client.end(); }
        //         throw new Error(constants.userMessage.TOKEN_MISSING);
        // }
    }
    catch (error) {
        if (client) { client.end(); }
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "PrescriptionUpload");
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.remove_file = async function (direction, appointment_id, deleteArray) {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    try {
        await client.connect();
        var fs = require('fs');
        const path = require('path');
        if (fs.existsSync(direction + '/' + deleteArray.fileName)) {
            fs.unlink(direction + '/' + deleteArray.fileName, async (err) => {
                if (err) throw err;
                // if no error, file has been deleted successfully
                else {
                    console.log('File deleted!');
                }
            });
        } else {
            console.log("DOES NOT exist:");
        }
        var res = await client.query(`DELETE FROM tbl_prescription_images where image_id = $1`, [deleteArray.image_id])
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "remove_file");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

module.exports.insert_image = async function (direction, i, imageArray, prescription_id, user_id) {
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
        var createupdate_date = new Date().getTime();
        var dataString = imageArray.fileArray;
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        var type = response.type.split('/')
        var fileName = 'Prescription' + '_' + prescription_id + '_' + imageArray.fileName + '_' + [i + 1] + '.' + type[1];
        await fs.writeFile(direction + '/' + fileName, response.data, function (err) {
            console.log("The file was saved!");
        })
        await client.query(`INSERT INTO "tbl_prescription_images"("image_id","prescription_id","image_name","created_date","user_id") values ((select coalesce (max(image_id),0) + 1 from tbl_prescription_images),$1,$2,$3,$4) `, [prescription_id, fileName, createupdate_date, user_id]);
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "insert_image");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Prescription Upload Jwt
module.exports.ListPrescriptionImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "ListPrescriptionImagesJwt");
        throw new Error(error);
    }
}

//Prescription Upload service
module.exports.ListPrescriptionImages = async (req) => {
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
                const image_result = await client.query(`SELECT a.prescription_id,a.appointment_id,a.patient_id,a.employee_id,a.active_status,b.created_date as updated_date,b.image_name,b.image_id from tbl_prescription as a inner join tbl_prescription_images as b on a.prescription_id = b.prescription_id where patient_id = $1 `, [patient_id]);
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

            if (client) {
                client.end();
            }
            return constants.userMessage.USER_UPLOAD;
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    }
    catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "ListPrescriptionImages");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Prescription Upload Jwt
module.exports.editLoadPrescriptionImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "editLoadPrescriptionImagesJwt");
        throw new Error(error);
    }
}

//Prescription Upload service
module.exports.editLoadPrescriptionImages = async (req) => {
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
                const image_result = await client.query(`SELECT a.prescription_id,a.appointment_id,a.patient_id,a.employee_id,a.active_status,d.patient_name,d.uhid,b.image_name,b.image_id from tbl_prescription as a inner join tbl_prescription_images as b on a.prescription_id = b.prescription_id inner join tbl_appointment as c on c.appointment_id=a.appointment_id inner join tbl_patient as d on d.patient_id=c.patient_id where a.appointment_id = $1 `, [appointment_id]);
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
        if (client) {
            client.end();
        }
        return constants.userMessage.USER_UPLOAD;
    }
    catch (error) {
        if (client) { client.end(); }
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME, "Appointment", error, "editLoadPrescriptionImages");
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}