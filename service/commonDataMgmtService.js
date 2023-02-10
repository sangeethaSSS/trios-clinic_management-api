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
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create jwt 
module.exports.fetchcommonDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "fetchcommonDataJwt");
    throw new Error(error);
  }
}
//create Fetch Commonlist
module.exports.fetchcommonData = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const city_Result = await client.query(`select city_id,city_name,active_status from tbl_def_city where active_status = 1`);
        const state_Result = await client.query(`select state_id,state_name,active_status from tbl_def_state where active_status = 1`);
        const status_Result = await client.query(`select status_name,status_id from tbl_def_status`);
        const gender_Result = await client.query(`select gender_name,gender_id from tbl_def_gender where active_status = 1`);
        const tag_Result = await client.query(`select tag_name,tag_id from tbl_def_tag where active_status = 1`);
        const employeecatery_Result = await client.query(`select employee_category_name,employee_category_id from tbl_def_employee_category where active_status = 1`);
        const userrole_Result = await client.query(`select userrole_id,userrole_name from tbl_userrole_master where active_status = 1`);
        const modules_Result = await client.query(`select module_id,module_name,visibility_order from tbl_def_modules where active_status = 1 order by visibility_order`);
        const feestype_Result = await client.query(`select fees_type_id,fees_type_name from tbl_def_fees_type where active_status = 1`);
        const feescollector_Result = await client.query(`select fees_collector_id,fees_collector_name from tbl_def_fees_collector where active_status = 1`);
        const feescollection_Result = await client.query(`select fees_collection_id,fees_collection_name from tbl_def_fees_collection where active_status = 1`);
        const referby = await client.query(`select distinct(refered_by) from tbl_patient where refered_by !=''`);
        const condition_Result = await client.query(`select condition_id,condition_name from tbl_def_condition where active_status = 1`);
        const agetype_Result = await client.query(`select age_type_id, age_type_name from tbl_def_agetype where active_status = 1`);
        const radiology_Result = await client.query(`select radiology_id, radiology_name,dependency from tbl_def_radiology_type where active_status = 1`);
        const radiologypart_Result = await client.query(`select radiology_part_id, radiology_part_name,radiology_id from tbl_def_radiology_parts where active_status = 1`);
        const unit_of_measure_Result = await client.query(`select distinct(unit_name) from tbl_lab_test_master where unit_name !=''`);

        const reason_Result = await client.query(`select reason_id, reason_name,false as checked from tbl_def_reason_purpose where active_status = 1 order by order_id `);

        const RegistrationMenu_Result = await client.query(`select menu_id, menu_name,status from tbl_registration_menu order by menu_id asc`);

        const medicine_companymaster = await client.query(`select medicine_company_id,medicine_company_name from tbl_medicine_company_master where active_status = 1`)

         const type_Result = await client.query(`select type_id, type_name from tbl_def_report_type where active_status = 1 order by order_id `);

        const unit_master = await client.query(`select unit_id,unit_name,display_unit from tbl_def_unit where active_status = 1 order by order_id`)
        const route_master = await client.query(`select route_id,route_name from tbl_def_route where active_status = 1`)
        const referral_master = await client.query(`select referral_id,referral_name from tbl_def_referral where active_status = 1`)
        const duration_master = await client.query(`select duration_id,duration_name from tbl_def_duration where active_status = 1`)
        const drug_master = await client.query(`select drug_name,salt_name from tbl_drug_master where active_status = 1`)
        
        if (client) {
          client.end();
        }
        let Unit_List = unit_master && unit_master.rows ? unit_master.rows : [];
        let Route_List = route_master && route_master.rows ? route_master.rows : [];
        let Referral_List = referral_master && referral_master.rows ? referral_master.rows : [];
        let Duration_List = duration_master && duration_master.rows ? duration_master.rows : [];

        let City_Array = city_Result && city_Result.rows ? city_Result.rows : [];
        let state_Array = state_Result && state_Result.rows ? state_Result.rows : [];
        let status_Array = status_Result && status_Result.rows ? status_Result.rows : [];
        let gender_Array = gender_Result && gender_Result.rows ? gender_Result.rows : [];
        let tag_Array = tag_Result && tag_Result.rows ? tag_Result.rows : [];
        let employeecatery_Array = employeecatery_Result && employeecatery_Result.rows ? employeecatery_Result.rows : [];
        let modules_Array = modules_Result && modules_Result.rows ? modules_Result.rows : [];
        let userrole_Array = userrole_Result && userrole_Result.rows ? userrole_Result.rows : [];
        let feestype_Array = feestype_Result && feestype_Result.rows ? feestype_Result.rows : [];
        let feescollector_Array = feescollector_Result && feescollector_Result.rows ? feescollector_Result.rows : [];
        let feescollection_Array = feescollection_Result && feescollection_Result.rows ? feescollection_Result.rows : [];
        let refer_by = referby && referby.rows ? referby.rows : [];
        let condition_Array = condition_Result && condition_Result.rows ? condition_Result.rows : [];
        let agetype_Array = agetype_Result && agetype_Result.rows ? agetype_Result.rows : [];
        let radiologytype_Array = radiology_Result && radiology_Result.rows ? radiology_Result.rows : [];
        let radiologypart_Array = radiologypart_Result && radiologypart_Result.rows ? radiologypart_Result.rows : [];
        let unit_Array = unit_of_measure_Result && unit_of_measure_Result.rows ? unit_of_measure_Result.rows : [];
        let reason_Array = reason_Result && reason_Result.rows ? reason_Result.rows : [];
        let RegistrationMenu_Array = RegistrationMenu_Result && RegistrationMenu_Result.rows ? RegistrationMenu_Result.rows : [];
        let medicine_company_Array = medicine_companymaster && medicine_companymaster.rows ? medicine_companymaster.rows : [];
        let type_Array = type_Result && type_Result.rows ? type_Result.rows : [];
        let drug_Array = drug_master && drug_master.rows ? drug_master.rows : [];
        responseData = { "cityArray": City_Array, "stateArray": state_Array, "statusArray": status_Array, "genderArray": gender_Array, "tagArray": tag_Array, "employeecateryArray": employeecatery_Array, "userrole_Array": userrole_Array, "moduleArray": modules_Array, "feesTypeArray": feestype_Array, "feesCollectorArray": feescollector_Array, "feesCollectionArray": feescollection_Array, "referedbyArray": refer_by, "conditionArray": condition_Array, "agetypeArray": agetype_Array, "radiologyTypeArray": radiologytype_Array, "radiologyPartsArray": radiologypart_Array, "unit_Array": unit_Array,"reasonArray" :reason_Array,"RegistrationMenuArray":RegistrationMenu_Array,"Medicine_CompanyMaster" : medicine_company_Array,"UnitList":Unit_List,"RouteList":Route_List,"ReferralList":Referral_List,"DurationList":Duration_List,"ReportTypeList" : type_Array,"DrugList" : drug_Array}
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
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "fetchcommonData");
    if (client) { client.end(); }
    throw new Error(error);
  }

  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//create Doctor jwt 
module.exports.fetchdoctorDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "fetchdoctorDataJwt");
    throw new Error(error);
  }
}
//create Fetch Commonlist
module.exports.fetchdoctorData = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const qualification_Result = await client.query(`select distinct(qualification) from tbl_employee_master where qualification !=''`);
        const specialization_Result = await client.query(`select specialization_id,specialization,active_status from tbl_def_specialization where active_status = 1`);
        const designation_Result = await client.query(`select designation,designation_id from tbl_def_designation where active_status = 1`);
        const department_Result = await client.query(`select department_name,department_id from tbl_def_department where active_status = 1`);
        if (client) {
          client.end();
        }
        let qualification_Array = qualification_Result && qualification_Result.rows ? qualification_Result.rows : [];
        let specialization_Array = specialization_Result && specialization_Result.rows ? specialization_Result.rows : [];
        let designation_Array = designation_Result && designation_Result.rows ? designation_Result.rows : [];
        let department_Array = department_Result && department_Result.rows ? department_Result.rows : [];
        responseData = { "qualificationArray": qualification_Array, "specializationArray": specialization_Array, "designationArray": designation_Array, "departmentArray": department_Array }
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

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "fetchdoctorData");
    if (client) { client.end(); }
    throw new Error(error);
  }

  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//create Patient jwt 
module.exports.fetchpatientDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "fetchpatientDataJwt");
    throw new Error(error);
  }
}
//create Fetch patientlist
module.exports.fetchpatientData = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const bloodgroup_Result = await client.query(`select blood_group_id,blood_group_name,active_status from tbl_def_blood_group where active_status = 1`);
        const patientcategory_Result = await client.query(`select patient_category_id,patient_category_name,active_status from tbl_def_patient_category where active_status = 1`);
        if (client) {
          client.end();
        }
        let bloodgroup_Array = bloodgroup_Result && bloodgroup_Result.rows ? bloodgroup_Result.rows : [];
        let patientcategory_Array = patientcategory_Result && patientcategory_Result.rows ? patientcategory_Result.rows : [];
        responseData = { "bloodgroupArray": bloodgroup_Array, "patientcategoryArray": patientcategory_Array }
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
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "fetchpatientData");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//create Consultation jwt 
module.exports.fetchconsultationDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "fetchconsultationDataJwt");
    throw new Error(error);
  }
}
//create Fetch consultationList
module.exports.fetchconsultationData = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const appointmenttype_Result = await client.query(`select appointment_type_id,appintment_type,active_status from tbl_def_appointment_type where active_status = 1`);
        const appointmentmode_Result = await client.query(`select appointment_mode_id,appointment_mode,active_status from tbl_def_appointment_mode where active_status = 1`);
        const appointmentstatus_Result = await client.query(`select appointment_status_id,appointment_status,active_status from tbl_def_appointment_status where active_status = 1`);
        const diagnosis_Result = await client.query(`select diagnosis_id,diagnosis_name,active_status from tbl_def_diagnosis where active_status = 1`);
        const paymentstatus_Result = await client.query(`select paymentstatus_id,paymentstatus_name,active_status from tbl_def_payment_status where active_status = 1`);
        const medicineintake_Result = await client.query(`select medicine_intake_id,intake_details,active_status from tbl_def_medicine_intake where active_status = 1`);
        const clinicalhistory_Result = await client.query(`select clinical_history_id,clinical_history_details,active_status,false as checked from tbl_def_clinical_history where active_status = 1 order by order_id`);
        const consultingdoctor_Result = await client.query(`select employee_id,CONCAT('Dr.',employee_name) as employee_name,active_status from tbl_employee_master where active_status = 1 and employee_category_id = 1`);
        const treatment_Result = await client.query(`select treatment_id,treatment_name,active_status,false as checked from tbl_def_treatment where active_status = 1 order by order_id`);
        const otherdetails_Result = await client.query(`select details_id,details_name,active_status,false as checked from tbl_def_other_details where active_status = 1 order by order_id`);
        
        if (client) {
          client.end();
        }
        let appointmenttype_Array = appointmenttype_Result && appointmenttype_Result.rows ? appointmenttype_Result.rows : [];
        let appointmentmode_Array = appointmentmode_Result && appointmentmode_Result.rows ? appointmentmode_Result.rows : [];
        let appointmentstatus_Array = appointmentstatus_Result && appointmentstatus_Result.rows ? appointmentstatus_Result.rows : [];
        let diagnosis_Array = diagnosis_Result && diagnosis_Result.rows ? diagnosis_Result.rows : [];
        let paymentstatus_Array = paymentstatus_Result && paymentstatus_Result.rows ? paymentstatus_Result.rows : [];
        let medicineintake_Array = medicineintake_Result && medicineintake_Result.rows ? medicineintake_Result.rows : [];
        let clinicalhistory_Array = clinicalhistory_Result && clinicalhistory_Result.rows ? clinicalhistory_Result.rows : [];
        let consultingdoctor_Array = consultingdoctor_Result && consultingdoctor_Result.rows ? consultingdoctor_Result.rows : [];
        let treatment_Array = treatment_Result && treatment_Result.rows ? treatment_Result.rows : [];
        let otherdetails_Array = otherdetails_Result && otherdetails_Result.rows ? otherdetails_Result.rows : [];
        responseData = { "appointmenttypeArray": appointmenttype_Array, "appointmentmodeArray": appointmentmode_Array, "appointmentstatusArray": appointmentstatus_Array, "diagnosisArray": diagnosis_Array, "paymentstatusArray": paymentstatus_Array, "medicineintakeArray": medicineintake_Array, "clinicalhistoryArray": clinicalhistory_Array, "consultingDoctorArray": consultingdoctor_Array,"treatmentArray":treatment_Array,"otherdetailsArray":otherdetails_Array}
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

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "fetchconsultationData");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//City jwt 
module.exports.bindCityDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "bindCityDataJwt");
    throw new Error(error);
  }
}
//Bind City  
module.exports.bindCityData = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const city_Result = await client.query(`select city_id,city_name,active_status from tbl_def_city where active_status = 1`);
        if (client) {
          client.end();
        }
        let City_Array = city_Result && city_Result.rows ? city_Result.rows : [];
        responseData = { "cityArray": City_Array }
        if (responseData) {
          return responseData;
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
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "bindCityData");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Doctor jwt 
module.exports.bindDoctorDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "bindDoctorDataJwt");
    throw new Error(error);
  }
}
//Bind Doctor 
module.exports.bindDoctorData = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const consultingdoctor_Result = await client.query(`select employee_id,employee_name,active_status from tbl_employee_master where active_status = 1 and employee_category_id = 1`);
        if (client) {
          client.end();
        }
        let consultingdoctor_Array = consultingdoctor_Result && consultingdoctor_Result.rows ? consultingdoctor_Result.rows : [];
        responseData = { "consultingDoctorArray": consultingdoctor_Array }
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

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "bindDoctorData");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

//Financial year checking jwt 
module.exports.getFinancialyearJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "getFinancialyearJwt");
    throw new Error(error);
  }
}

//Financial year checking 
module.exports.getFinancialyear = async (req) => {
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
      var responseData = {},message ='';
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        
        var Registration = await commonService.getVoucherId(2);   //Registration Finacial year checking
        var Outpatient = await commonService.getVoucherId(1);     //Outpatient Finacial year checking
        var ECG = await commonService.getVoucherId(3);            //ECG Finacial year checking
        var Lab = await commonService.getVoucherId(4);            //Lab Finacial year checking
        var EEG = await commonService.getVoucherId(6);            //Lab Finacial year checking
        if (client) {
          client.end();
        }
        if( Registration.status == false )
            message= Registration.message
        if(Outpatient.status == false)
            message=Outpatient.message
        if(ECG.status == false)
            message=ECG.message
        if(Lab.status == false)
            message=Lab.message
        if(EEG.status == false)
            message=EEG.message  
        
        responseData = { "Registration": Registration.status, "Outpatient": Outpatient.status, "ECG": ECG.status,"Lab": Lab.status,"EEG": EEG.status,"Message":message}
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

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "bindDoctorData");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

//create Company jwt 
module.exports.companyDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "companyDataJwt");
    throw new Error(error);
  }
}

//Bind Doctor 
module.exports.companyData = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const Company_Result = await client.query(`select company_id,company_name,logo_url from tbl_company_master `);
        if (client) {
          client.end();
        }
        let Company_Array = Company_Result && Company_Result.rows ? Company_Result.rows : [];
        responseData = { "CompanyArray": Company_Array }
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

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "bindDoctorData");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}

//List Telephone jwt 
module.exports.telephoneListJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "telephoneListJwt");
    throw new Error(error);
  }
}

//List Telephone
module.exports.telephoneList = async (req) => {
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
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      const { start_date, end_date,employee_id } = decoded.data;
      if (decoded) {
       var datediff = '',employee='';
        if (start_date && end_date) {
          datediff = `to_char(a.booking_date,'YYYY-MM-DD') :: date BETWEEN `
              .concat(`to_date('` + start_date + `','YYYY-MM-DD') AND to_date('` + end_date + `','YYYY-MM-DD')`);
          }
          if (employee_id == -1) {
            employee = ' 1=1'
        }
        else {
          employee = ` a.employee_id = ` + employee_id
        }
       

       

        const appointment_Result = await client.query(`SELECT b.uhid,a.patient_id,(CASE WHEN a.booking_type = '1' THEN b.patient_name ELSE a.patient_name END ) as patient_name,a.schedule_id,a.doctor_note,(select employee_name from tbl_employee_master where employee_id = (select employee_id from tbl_user_master where user_code = (select user_code from tbluserlog  where log_id = a.maker_id limit 1))) as employeename,(select to_timestamp(created_date/1000) from tbluserlog where log_id = a.maker_id limit 1) as createddate,to_char(a.booking_date,'YYYY-MM-DD') as booking_date,d.schedule_name,CONCAT('Dr.',i.employee_name) as employee_name FROM tbl_appointment_booking as a left join tbl_patient as b on a.patient_id = b.patient_id left join tbl_def_schedule as d on a.schedule_id = d.schedule_id  left join tbl_employee_master as i on i.employee_id = a.employee_id where ` + datediff + ` and `+ employee +` `);
        if (client) {
          client.end();
        }
        let BookingList = appointment_Result && appointment_Result.rows ? appointment_Result.rows : [];
        responseData = { "TelephoneList": BookingList }
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

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Bind_Default", error, "telephoneList");
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}