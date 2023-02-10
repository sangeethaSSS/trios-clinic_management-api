const Joi = require('@hapi/joi');

module.exports.createConsultationJwt = Joi.object().keys({ 
    consultation_id: Joi.number().required(), 
    appointment_id:Joi.number().required(), 
    employee_id: Joi.number().required(), 
    user_id: Joi.number().required(), 
    patient_id: Joi.number().required(),
    doctor_notes:Joi.string().required().allow(""),
    review_date:Joi.string().required().allow(null),
    appointment_status_id: Joi.number().required(), 
    paymentstatus_id: Joi.number().required(), 
    module_id:Joi.number().required(), 
    prescriptionArray:Joi.array().required().allow([]),
  });

  module.exports.createConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.getDataConsultationJwt = Joi.object().keys({
    appointment_id: Joi.number().required(), 
  });
  module.exports.getDataConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listConsultationJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    session_id: Joi.number().required(),
    employee_id: Joi.number().required(),
    start_date:Joi.string().required() 
  });
  module.exports.listConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadConsultationJwt = Joi.object().keys({
    consultation_id: Joi.number().required()
  
  });
  module.exports.editloadConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.clinicHistoryJwt = Joi.object().keys({
    patient_id: Joi.number().required(), 
    offset: Joi.number().required(), 
    pagesize: Joi.number().required(), 
  });
  module.exports.clinicHistory = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.previousConsultationJwt = Joi.object().keys({
    appointment_id: Joi.number().required(), 
    session_id: Joi.number().required(), 
  });
  module.exports.previousConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.nextConsultationJwt = Joi.object().keys({
    session_id: Joi.number().required(),
  });
  module.exports.nextConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.updatePaymentStatusJwt = Joi.object().keys({
    appointment_id: Joi.number().required(), 
    paymentstatus_id: Joi.number().required(), 
    fees: Joi.number().required(),
    ref_no: Joi.number().required(), 
    account_id:Joi.number().required(),
    transaction_id:Joi.number().required(),
    module_id:Joi.number().required(),
    voucher_no:Joi.string().required(),
    user_id:Joi.number().required(),
    narration:Joi.string().required().allow(""), 
    employee_id:Joi.number().required().allow(0), 
    is_cashier:Joi.string().required(), 
  });
  module.exports.updatePaymentStatus = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  // module.exports.clinicalPhotographyJwt = Joi.object().keys({
  //   imageArray:Joi.array().required().allow([]),
  //   deleteArray:Joi.array().required().allow([]),
  //   patient_id: Joi.number().required(), 
  //   consultation_id: Joi.number().required(), 
  //   appointment_id: Joi.number().required(),
  //   user_id: Joi.number().required(),
  //   description_clinicalphotography:Joi.string().required().allow(""),
  // });
  module.exports.clinicalPhotography = Joi.object().keys({ 
    imageArray:Joi.array().required().allow([]),
    deleteArray:Joi.array().required().allow([]),
    patient_id: Joi.number().required(), 
    consultation_id: Joi.number().required(), 
    appointment_id: Joi.number().required(),
    user_id: Joi.number().required(),
    description_clinicalphotography:Joi.string().required().allow(""), 
  });
  module.exports.getConsultationclinicalImagesJwt = Joi.object().keys({
    consultation_id: Joi.number().required(), 
  });
  module.exports.getConsultationclinicalImages = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.getPatientclinicalImagesJwt = Joi.object().keys({
    patient_id: Joi.number().required(), 
  });
  module.exports.getPatientclinicalImages = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.getFinancial_yearJwt = Joi.object().keys({
    module_id: Joi.number().required(), 
  });
  module.exports.getFinancial_year = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.getAccountMasterJwt = Joi.object().keys({
    module_id: Joi.number().required(), 
  });
  module.exports.getAccountMaster = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.loadtest_DetailsJwt = Joi.object().keys({
    lab_test_id: Joi.number().required(), 
  });
  module.exports.loadtest_Details = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.getpatient_idJwt = Joi.object().keys({
    patient_id: Joi.number().required(), 
  });
  module.exports.getpatient_id = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.checkPaymentStatusJwt = Joi.object().keys({
    module_id: Joi.number().required(), 
    ref_no:Joi.number().required(),
  });
  module.exports.checkPaymentStatus = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  
  module.exports.onchangeDrugListJwt = Joi.object().keys({
    salt_name: Joi.string().required().allow(""), 
  });
  module.exports.onchangeDrugList = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.oldPrescriptionJwt = Joi.object().keys({
    old_prescription_id: Joi.number().required(), 
    user_id: Joi.number().required(), 
    patient_id: Joi.number().required(),
    doctor_notes:Joi.string().required().allow(""),
    prescription_date:Joi.string().required().allow(null),
    old_prescriptionArray:Joi.array().required().allow([]),
  });
  module.exports.oldPrescription = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editOldPrescriptionJwt = Joi.object().keys({
    patient_id: Joi.number().required(),
  });
  module.exports.editOldPrescription = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.reportPhotography = Joi.object().keys({
    imageArray:Joi.array().required().allow([]),
    patient_id:Joi.number().required(),
    user_id:Joi.number().required(),
    investigation_date:Joi.string().required().allow(null),
    type_id:Joi.number().required()
  })

  module.exports.getConsultationReportImagesJwt = Joi.object().keys({
    patient_id: Joi.number().required(),
  });
  module.exports.getConsultationReportImages = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editReportImagesJwt = Joi.object().keys({
    patient_id: Joi.number().required(),
    date: Joi.string().required(),
  });
  module.exports.editReportImages = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.updateReportImage = Joi.object().keys({
    imageArray:Joi.array().required().allow([]),
    patient_id:Joi.number().required(),
    investigation_date:Joi.string().required(),
    user_id:Joi.number().required(),
    type_id:Joi.number().required(),
    deleteArray:Joi.array().required().allow([]),
  })

  module.exports.deleteReportImageJwt = Joi.object().keys({
    deleteArray:Joi.array().required().allow([]),
    patient_id:Joi.number().required()
  });
  module.exports.deleteReportImage = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });