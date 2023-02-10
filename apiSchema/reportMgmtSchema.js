const Joi = require('@hapi/joi');

//Get Consolidated Report 
module.exports.getConsolidatedReportJwt = Joi.object().keys({ 
    created_date: Joi.number().required(), 
    end_date: Joi.number().required(),
});

module.exports.getConsolidatedReport = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

//Detailed cash Report Module
module.exports.DetailedCashReportJwt = Joi.object().keys({ 
  created_date: Joi.number().required(), 
  end_date:Joi.number().required(), 
  module_id: Joi.number().required(),
});

module.exports.DetailedCashReport = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});