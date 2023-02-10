const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create Employee jwt 
module.exports.createEmployeeJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "createEmployeeJwt");
        throw new Error(error);
    }
}
//create Employee service
module.exports.createEmployee = async (req) => {
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
            const { employee_id, employee_name, gender_id, mobile_number, whatsapp_number, reg_number, designation_id, specialization_id, email_id, street_name, area_name, pincode, employee_category_id, aadhar_number, consulting_duration, active_status, consulting_fees, department_id, user_id, qualification, city_id, consulting_hours, city_name, specialization_array } = decoded.data;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            if (decoded) {
                var maxCity_Check = 0;
                const maxcity = await client.query(`select coalesce(max(city_id),0) + 1 as mr FROM tbl_def_city`)
                maxCity_Check = maxcity && maxcity.rows[0].mr;
                if (city_id == 0) {
                    await client.query(`INSERT INTO "tbl_def_city"("city_id","city_name","active_status") values ($1,Upper($2),$3) `, [maxCity_Check, city_name, 1]);
                }
                else { maxCity_Check = city_id }
                if (employee_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Employee");
                    const max = await client.query(`select coalesce(max(employee_id),0) + 1 as mr FROM tbl_employee_master`)
                    var maxemployee = max && max.rows[0].mr;
                    const result = await client.query(`INSERT INTO "tbl_employee_master"("employee_id","employee_name","gender_id","mobile_number","whatsapp_number","reg_number","designation_id","specialization_id","email_id","street_name","area_name","pincode","employee_category_id","aadhar_number","consulting_duration","consulting_fees","department_id","active_status","maker_id","user_id","created_date","qualification","city_id") values ($1, Upper($2), $3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,Upper($22),$23) `, [maxemployee, employee_name, gender_id, mobile_number, whatsapp_number, reg_number, designation_id, specialization_id, email_id, street_name, area_name, pincode, employee_category_id, aadhar_number, consulting_duration, consulting_fees, department_id, active_status, makerid, user_id, createupdate_date, qualification, maxCity_Check]);
                    if (employee_category_id == 1) {
                        if (consulting_hours && consulting_hours.length > 0) {
                            for (let i = 0; i < consulting_hours.length; i++) {
                                const hours_max = await client.query(`select coalesce (max(consulting_hours_id),0) + 1 as mr FROM tbl_consulting_hours`)
                                var consulting_hours_max = hours_max && hours_max.rows[0].mr;
                                const consultingresult = await client.query(`INSERT INTO "tbl_consulting_hours"("consulting_hours_id","employee_id","session_id","start_time","end_time","active_status","day","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10) `, [consulting_hours_max, maxemployee, consulting_hours[i].session_id, consulting_hours[i].start_time, consulting_hours[i].end_time, consulting_hours[i].active_status, consulting_hours[i].day, makerid, user_id, createupdate_date]);
                                let consulting_code = consultingresult && consultingresult.rowCount ? consultingresult.rowCount : 0;
                                console.log(consulting_code)
                            }
                        }
                    }
                    if (specialization_array && specialization_array.length > 0) {
                        for (let i = 0; i < specialization_array.length; i++) {
                            const specialization_max = await client.query(`select coalesce (max(employee_specialization_id),0) + 1 as mr FROM employee_specialization`)
                            var specmax = specialization_max && specialization_max.rows[0].mr;
                            const specresult = await client.query(`INSERT INTO "employee_specialization"("employee_specialization_id","specialization_id","maker_id","user_id","created_date","employee_id") values ($1, $2, $3, $4, $5,$6) `, [specmax, specialization_array[i].specialization_id, makerid, user_id, createupdate_date, maxemployee]);
                            let spc_code = specresult && specresult.rowCount ? specresult.rowCount : 0;
                            console.log(spc_code)
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
                    var makerid = await commonService.insertLogs(user_id, "Update Employee");
                    const count = await client.query(`select count(*) as count FROM tbl_employee_master where employee_id =` + employee_id)
                    var count_Check = count && count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_employee_master" set "employee_name"= Upper($1), "gender_id"=$2,"mobile_number"=$3,"whatsapp_number"=$4,"reg_number"=$5,"designation_id"=$6,"specialization_id"=$7,"email_id"=$8,"street_name"=$9,"area_name"=$10,"pincode"=$11,"employee_category_id"=$12,"aadhar_number"=$13,"consulting_duration"=$14,"consulting_fees"=$15,"department_id"=$16,"active_status"=$17,"maker_id"=$18,"user_id"=$19,"updated_date"=$20,"qualification"=Upper($21),"city_id"=$22 where "employee_id" = $23 `, [employee_name, gender_id, mobile_number, whatsapp_number, reg_number, designation_id, specialization_id, email_id, street_name, area_name, pincode, employee_category_id, aadhar_number, consulting_duration, consulting_fees, department_id, active_status, makerid, user_id, createupdate_date, qualification, maxCity_Check, employee_id]);
                        if (employee_category_id == 1) {
                            await client.query(`DELETE FROM tbl_consulting_hours where employee_id=` + employee_id)
                            if (consulting_hours && consulting_hours.length > 0) {
                                for (let i = 0; i < consulting_hours.length; i++) {
                                    const hours_max = await client.query('select coalesce (max(consulting_hours_id),0) + 1 as mr FROM tbl_consulting_hours')
                                    var consulting_hours_max = hours_max && hours_max.rows[0].mr;
                                    const consultingresult = await client.query(`INSERT INTO "tbl_consulting_hours"("consulting_hours_id","employee_id","session_id","start_time","end_time","active_status","day","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10) `, [consulting_hours_max, employee_id, consulting_hours[i].session_id, consulting_hours[i].start_time, consulting_hours[i].end_time, consulting_hours[i].active_status, consulting_hours[i].day, makerid, user_id, createupdate_date]);
                                    let consulting_code = consultingresult && consultingresult.rowCount ? consultingresult.rowCount : 0;
                                    console.log(consulting_code)
                                }
                            }
                            if (specialization_array && specialization_array.length > 0) {
                                await client.query(`DELETE FROM employee_specialization where employee_id=$1`,
                                    [employee_id])
                                for (let i = 0; i < specialization_array.length; i++) {
                                    const specialization_max = await client.query(`select coalesce (max(employee_specialization_id),0) + 1 as mr FROM employee_specialization`)
                                    var specmax = specialization_max && specialization_max.rows[0].mr;
                                    const specresult = await client.query(`INSERT INTO "employee_specialization"("employee_specialization_id","specialization_id","maker_id","user_id","created_date","employee_id") values ($1, $2, $3, $4, $5,$6) `, [specmax, specialization_array[i].specialization_id, makerid, user_id, createupdate_date, employee_id]);
                                    let spc_code = specresult && specresult.rowCount ? specresult.rowCount : 0;
                                    console.log(spc_code)
                                }
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "createEmployee");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Delete Employee jwt 
module.exports.deleteEmployeeJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "deleteEmployeeJwt");
        throw new Error(error);
    }
}
//Delete Employee service
module.exports.deleteEmployee = async (req) => {
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
            const { employee_id, user_id } = decoded.data;
            if (decoded) {
                var response = {}
                await commonService.insertLogs(user_id, "Delete Employee");
                const usercount = await client.query(`select count(*) as usercount FROM tbl_user_master where employee_id =` + employee_id)
                var user_Check = usercount && usercount.rows[0].usercount
                if (user_Check > 0) {
                    return response = { "message": constants.userMessage.DUPLICATE_EMPLOYEE, "status": false }
                }

                //Check If employee exist in tbl_patient_lab_details (Forgine Key) 
                const employeecount = await client.query(`select count(*) as employeecount FROM tbl_patient_lab_details where employee_id =` + employee_id)
                var employee_Check = employeecount && employeecount.rows[0].employeecount
                if (employee_Check > 0) {
                    return response = { "message": constants.userMessage.DUPLICATE_EMPLOYEE, "status": false }
                }

                //Check If employee exist in Appointment (Forgine Key) 
                const appointmentcount = await client.query(`select count(*) as appointmentcount FROM tbl_appointment where employee_id =` + employee_id)
                var appointment_Check = appointmentcount && appointmentcount.rows[0].appointmentcount
                if (appointment_Check > 0) {
                    return response = { "message": constants.userMessage.DUPLICATE_EMPLOYEE, "status": false }
                }
                else {
                    const count = await client.query(`select count(*) as count FROM tbl_employee_master where employee_id =` + employee_id)
                    var count_Check = count && count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        await client.query(`DELETE FROM employee_specialization where employee_id=$1 `, [employee_id])
                        const result = await client.query(`DELETE FROM tbl_employee_master where employee_id=$1 `,
                            [employee_id]);
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
            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "deleteEmployee");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//List Employee jwt 
module.exports.listEmployeeJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "listEmployeeJwt");
        throw new Error(error);
    }
}
//List EmployeeList
module.exports.listEmployee = async (req) => {
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
            const { employee_id, active_status } = decoded.data;
            if (decoded) {
                var employee = '',status = '';
                if(employee_id == -1){
                    employee = '1=1'
                } 
                else {
                    employee = `a.employee_category_id = ` + employee_id
                }
                if(active_status == -1){
                    status = '1=1'
                } 
                else {
                    status = `a.active_status = ` + active_status
                }
                const list_Employee = await client.query(`select a.employee_name,a.employee_id,a.whatsapp_number,a.reg_number,a.mobile_number,a.aadhar_number,a.consulting_duration,a.consulting_fees,a.email_id,a.street_name,a.area_name,a.pincode,a.active_status,a.gender_id,a.designation_id,a.specialization_id,a.employee_category_id,a.department_id,a.qualification,a.city_id,b.gender_name,e.employee_category_name,g.designation,h.department_name,i.status_name,f.city_name,STRING_AGG (r.specialization, ',') specialization,STRING_AGG (cast(r.specialization_id as text), ',')specialization_id from tbl_employee_master as a left outer join  employee_specialization as p on p.employee_id=a.employee_id left outer join tbl_def_specialization as r on r.specialization_id= p.specialization_id 
                inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_city as f on f.city_id = a.city_id left outer join tbl_def_employee_category as e on e.employee_category_id = a.employee_category_id left outer join tbl_def_designation as g on g.designation_id = a.designation_id left outer join tbl_def_department as h on h.department_id = a.department_id inner join tbl_def_status as i on a.active_status = i.status_id where
                ` + employee + ` and  ` + status + `  group by a.employee_id,b.gender_name,e.employee_category_name,g.designation,h.department_name,i.status_name,f.city_name ORDER BY a.employee_id DESC `);
                if (client) {
                    client.end();
                }
                let list_Employeearray = list_Employee && list_Employee.rows ? list_Employee.rows : [];
                if (list_Employeearray) {
                    return list_Employeearray;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "listEmployee");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Editload Employee jwt 
module.exports.editloadEmployeeJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "editloadEmployeeJwt");
        throw new Error(error);
    }
}
//Editload Employee
module.exports.editloadEmployee = async (req) => {
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
            const { employee_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const edit_Employee = await client.query(`select a.employee_id,a.employee_name,a.whatsapp_number,a.reg_number,a.mobile_number,a.aadhar_number,a.consulting_duration,a.consulting_fees,a.email_id,a.street_name,a.area_name,a.pincode,a.active_status,
                a.gender_id,a.designation_id,a.specialization_id,a.employee_category_id,a.department_id,a.qualification,a.city_id,
				b.gender_name,e.employee_category_name,f.city_name,g.designation,h.department_name,i.status_name 
				from tbl_employee_master as a 
				inner join tbl_def_gender as b on a.gender_id = b.gender_id 
				inner join  tbl_def_employee_category as e on e.employee_category_id = a.employee_category_id 
				inner join tbl_def_city as f on f.city_id = a.city_id 
				inner join tbl_def_designation as g on g.designation_id = a.designation_id 
				inner join tbl_def_department as h on h.department_id = a.department_id 
				inner join tbl_def_status as i on a.active_status = i.status_id where a.employee_id  =  $1 `, [employee_id]);
                const consulting_hours = await client.query(`select consulting_hours_id,session_id,start_time,end_time,day from tbl_consulting_hours where employee_id = ` + employee_id)
                const employee_specialization = await client.query(`select a.specialization_id,a.employee_id,b.specialization from employee_specialization as a inner join tbl_def_specialization as b on a.specialization_id = b.specialization_id where employee_id = ` + employee_id)
                if (client) {
                    client.end();
                }
                let edit_Employeearray = edit_Employee && edit_Employee.rows ? edit_Employee.rows : [];
                let edit_consulting_hours = consulting_hours && consulting_hours.rows ? consulting_hours.rows : [];
                let edit_specialization = employee_specialization && employee_specialization.rows ? employee_specialization.rows : [];
                response_Array = {
                    "EmployeeArray": edit_Employeearray, "Consulting_hoursArray": edit_consulting_hours, "SpecializationArray": edit_specialization
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "editloadEmployee");
        if (client) { client.end(); }
        throw new Error(error);
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}

//register Number Checking  jwt 
module.exports.registerCheckingJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "registerCheckingJwt");
        throw new Error(error);
    }
}
//Register Number Checking 
module.exports.registerChecking = async (req) => {
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
            const { reg_number, employee_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const regnumcount = await client.query(`select count(*) as regnumcount FROM tbl_employee_master where reg_number = $1 and employee_id != $2`, [reg_number,employee_id] )
                var user_Check = regnumcount && regnumcount.rows[0].regnumcount
                if (user_Check > 0) {
                    return response = { "message": constants.userMessage.DUPLICATE_REGNUMBER, "status": false }
                }
                if (client) {
                    client.end();
                }
                return response = { "message": constants.userMessage.UNIQUE_REGNUMBER, "status": true }
            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Employee_Master", error, "registerChecking");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
