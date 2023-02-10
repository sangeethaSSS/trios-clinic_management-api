const Joi = require('@hapi/joi');

module.exports.listLabReportJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    created_date: Joi.number().required(), 
    end_date : Joi.number().required(), 
  });
  module.exports.listLabReport = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.editloadLabReportgroupJwt = Joi.object().keys({
      transaction_id: Joi.number().required(), 
  });
  module.exports.editloadLabReportgroup = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.createLabreportgroupJwt = Joi.object().keys({
    report_id: Joi.number().required(), 
    lab_test_id: Joi.number().required(), 
    user_id: Joi.number().required(), 
    transaction_id:Joi.number().required(), 
    reported_date:Joi.number().required(),
    labreport_Array:Joi.array().required().allow([]),
  });
  module.exports.createLabreportgroup = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.createLabReport = Joi.object().keys({
    report_id: Joi.number().required().allow(0),
    transaction_id: Joi.number().required(),
    lab_test_id: Joi.number().required(),
    amount: Joi.number().required().allow(0),
    patient_id:Joi.number().required(),
    user_id: Joi.number().required(),
    imageArray:Joi.array().required().max( 2 * 1024 * 1024).allow([]),
    deleteArray:Joi.array().required().allow([]),
    uhid: Joi.string().required(), 
  });

  module.exports.editLoadLabReportImagesJwt = Joi.object().keys({
    transaction_id: Joi.number().required(), 
  });
  module.exports.editLoadLabReportImages = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

module.exports.ListLabImagesJwt = Joi.object().keys({ 
  patient_id: Joi.number().required(), 
});

module.exports.ListLabImages = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});