const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');


//Search Appointment jwt 
module.exports.searchPatientsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Appointment", error, "searchPatientsJwt");
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
                var response_Array = {}
                var ARR =[];
                var String="";
                if(search_Type ==='1'){
                     ARR =[search_Value];
                     String = "(Lower(a.uhid)::text like '%'||$1||'%' or Lower(a.patient_name) like '%'||$1||'%' or a.mobile_number like '%'||$1||'%')";
                }
                if(search_Type ==='2'){
                    ARR =[from_Date,to_Date];
                    String = "(to_date(to_char(a.created_date,'YYYY-MM-DD'),'YYYY-MM-DD') BETWEEN to_date( $1,'DD-MM-YYYY') and to_date( $2,'DD-MM-YYYY') )";
                }
                const search_Appointment = await client.query('select a.patient_id,a.patient_name,a.guardian_name,a.date_of_birth,a.gender_id,a.city_id,a.mobile_number,a.uhid,a.age_day,a.age_month,a.age_year,a.dob_type,b.gender_name,c.city_name from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_city as c on a.city_id=c.city_id where '+String+' and a.active_status = 1 ', ARR);
                
                if (client) {
                    client.end();
                }
                let search_Appointmentarray = search_Appointment && search_Appointment.rows ? search_Appointment.rows : [];
                 response_Array = {"Searchlist_Array" :search_Appointmentarray}

                if (search_Appointmentarray) {
                    return response_Array;
                }
                else {
                    return response_Array;
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Appointment", error, "searchPatients");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//create Appointment service
module.exports.createBooking = async (req) => {
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

            const {patient_id, user_id, schedule_id,doctor_note,booking_date,user_code,employee_id,patient_name,area_name,booking_type} = decoded.data;

            var maker_id = await commonService.insertLogs(user_code, "Insert Appointment Booking");

            var response = {}
          //  var start_timedate = new Date().getTime();

            if (decoded) {
            
                //OLD
                // const create_result = await client.query(`INSERT INTO tbl_appointment_booking(booking_id,patient_id,user_id,schedule_id,doctor_note,created_date,booking_date,maker_id,employee_id) 
                // (SELECT coalesce(max(booking_id),0) + 1 as booking_id,$1 as patient_id,$2 as user_id, $3 as schedule_id,$4 as doctor_note,CURRENT_TIMESTAMP AS created_date,$5 as booking_date,$6 as maker_id ,$7 as employee_id FROM tbl_appointment_booking)`,
                // [patient_id,user_id,schedule_id,doctor_note,booking_date,maker_id,employee_id]);

                const create_result = await client.query(`INSERT INTO tbl_appointment_booking(booking_id,patient_id,user_id,schedule_id,doctor_note,created_date,booking_date,maker_id,employee_id,patient_name,area_name,booking_type) 
                (SELECT coalesce(max(booking_id),0) + 1 as booking_id,$1 as patient_id,$2 as user_id, $3 as schedule_id,$4 as doctor_note,CURRENT_TIMESTAMP AS created_date,$5 as booking_date,$6 as maker_id ,$7 as employee_id,(CASE WHEN $10 = 1 THEN (SELECT b.patient_name FROM tbl_patient as b WHERE b.patient_id = $1)  ELSE $8 END) as patient_name,(CASE WHEN $10 = 1 THEN (SELECT c.city_name FROM tbl_def_city as c WHERE c.city_id =(SELECT b.city_id FROM tbl_patient as b WHERE b.patient_id = $1)) ELSE $9 END) as areaname, $10 as booking_type FROM tbl_appointment_booking)`,
                [patient_id,user_id,schedule_id,doctor_note,booking_date,maker_id,employee_id,patient_name,area_name,booking_type]);
                
                let create_booking = create_result && create_result.rowCount ? create_result.rowCount : 0;

                if (create_booking == 1) {
                    return response = { "message": "success"}
                }else{
                    return response = { "message": "unsuccess"}
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
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Appointment", error, "createAppointment");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//  List Bookings
module.exports.listBooking = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        //if (req.jwtToken) {
            const decoded = " ";
          
          //  const { from_Date,to_Date} = decoded.data;
              const current_date =req.current_Date;
            if (decoded) {
                var response_Array = {}
               
                const Appointment_Booking = await client.query("SELECT a.booking_id,b.uhid,a.patient_id,(CASE WHEN a.booking_type = '1' THEN b.patient_name ELSE a.patient_name END ) as patient_name,b.gender_id,e.gender_name,c.city_id,(CASE WHEN a.booking_type = '1' THEN c.city_name ELSE a.area_name END ) as city_name,a.user_id,a.schedule_id,a.doctor_note,to_char(a.created_date,'YYYY-MM-DD') as created_date,to_char(a.booking_date,'YYYY-MM-DD') as booking_date,d.schedule_id,d.schedule_name,f.user_code,h.userrole_id,h.userrole_name,CONCAT('Dr.',i.employee_name) as employee_name,i.employee_id,a.booking_type as booking_type FROM tbl_appointment_booking as a left join tbl_patient as b on a.patient_id = b.patient_id  left join tbl_def_city as c on b.city_id = c.city_id  left join tbl_def_schedule as d on a.schedule_id = d.schedule_id left join tbl_def_gender as e on b.gender_id = e.gender_id left join tbluserlog as f on f.log_id = a.maker_id left join tbl_user_master as g on g.user_code = f.user_code left join tbl_userrole_master as h on h.userrole_id = g.userrole_id left join tbl_employee_master as i on i.employee_id = a.employee_id WHERE (to_date(to_char(a.booking_date,'YYYY-MM-DD'),'YYYY-MM-DD') = to_date($1,'DD-MM-YYYY')) ORDER BY a.booking_id DESC ", [current_date]);
                
                if (client) {
                    client.end();
                }
                let  Appointment_Booking_Array = Appointment_Booking && Appointment_Booking.rows ? Appointment_Booking.rows : [];
                 response_Array = {"Bookinglist_Array" :Appointment_Booking_Array}

                if (Appointment_Booking_Array) {
                    return response_Array;
                }
                else {Appointment_Booking_Array
                    return response_Array;
                }
            }
            else{
                if (client) {client.end();}
            }
       /* } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }*/
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Appointment", error, "Booking List");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//  List DOCTOR DATA
module.exports.listDoctor = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
            const decoded = " ";
            if (decoded) {
                var response_Array = {}
               
                const Doctorlist = await client.query("select employee_id,CONCAT('Dr.',employee_name) as employee_name,active_status from tbl_employee_master where active_status = 1 and employee_category_id = 1", []);
                
                if (client) {
                    client.end();
                }
                let  Doctorlist_Array = Doctorlist && Doctorlist.rows ? Doctorlist.rows : [];
                 response_Array = {"Doctorlist_Array" :Doctorlist_Array}

                if (Doctorlist_Array) {
                    return response_Array;
                }
                else {
            
                    return response_Array;
                }
            }
            else{
                if (client) {client.end();}
            }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Appointment", error, "Doctor List");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//update Appointment service
module.exports.updateBooking = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
            const decoded = " ";

            const schedule_id = req.schedule_id;
            const doctor_note =req.doctor_note;
            const booking_id = req.booking_id;
            const user_code = req.user_code;
            const booking_date = req.booking_date;
            const employee_id = req.employee_id;
            const area_name = req.area_name;
            const patient_name = req.patient_name;
         //   var maker_id = await commonService.insertLogs(user_code, "Update Appointment Booking");

            var response = {}
          //  var start_timedate = new Date().getTime();

            if (decoded) {
                
                const update_result = await client.query(`UPDATE tbl_appointment_booking SET doctor_note = $1 , schedule_id = $2 , booking_date =$3 ,employee_id = $4 ,area_name = $6 , patient_name = $7 WHERE booking_id = $5`,[doctor_note,schedule_id,booking_date,employee_id,booking_id,area_name,patient_name]);

                let update_booking = update_result && update_result.rowCount ? update_result.rowCount : 0;

                if (update_booking == 1) {
                    return response = { "message": "success"}
                }else{
                    return response = { "message": "unsuccess"}
                }
                 
            }
            else{
                if (client) {client.end();}
            }
    
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Appointment", error, "updateAppointment");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}