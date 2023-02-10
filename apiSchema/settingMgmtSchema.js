const Joi = require('@hapi/joi');

module.exports.createSettingJwt = Joi.object().keys({ 
    setting_id: Joi.number().required(), 
    fees_type_id:Joi.number().required(),  
    fees_collector_id:Joi.number().required().allow(0), 
    fees_collection_id:Joi.number().required(), 
    user_id: Joi.number().required(), 
  });

  module.exports.createSetting = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadSettingJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
  });
  module.exports.editloadSetting = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });