const Joi = require('@hapi/joi');

module.exports.listCashModuleJwt = Joi.object().keys({ 
  created_date: Joi.number().required(), 
  end_date:Joi.number().required(), 
  module_id: Joi.number().required(),
  });
  module.exports.listCashModule = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });