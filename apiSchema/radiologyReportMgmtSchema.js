const Joi = require('@hapi/joi');

//Get Consolidated Report 
module.exports.listRadiologyReportJwt = Joi.object().keys({ 
  user_id: Joi.number().required(), 
  created_date: Joi.number().required(), 
  end_date : Joi.number().required(), 
});

module.exports.listRadiologyReport = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

module.exports.CreateRadiologyReport = Joi.object().keys({ 
  report_id: Joi.number().required().allow(0),
  transaction_id: Joi.number().required().allow(0),
  employee_id: Joi.number().required(),
  patient_id: Joi.number().required(),
  user_id: Joi.number().required(),
  radiology_test_id: Joi.number().required(),
  imageArray:Joi.array().required().max( 2 * 1024 * 1024).allow([]),
  deleteArray:Joi.array().required().allow([]),
  active_status: Joi.number().required(),
  uhid:Joi.string().required(), 
});

//Get Consolidated Report 
module.exports.editLoadRadiologyImagesJwt = Joi.object().keys({ 
  transaction_id: Joi.number().required(), 
});

module.exports.editLoadRadiologyImages = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});


//Get Consolidated Report 
module.exports.ListRadiologyImagesJwt = Joi.object().keys({ 
  patient_id: Joi.number().required(), 
});

module.exports.ListRadiologyImages = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});