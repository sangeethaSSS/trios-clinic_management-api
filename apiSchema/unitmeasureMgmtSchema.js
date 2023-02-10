const Joi = require('@hapi/joi');

module.exports.createUnitmeasureJwt = Joi.object().keys({
    unit_id: Joi.number().required(),
    unit_name: Joi.string().required(),
    user_id: Joi.number().required(),
    active_status: Joi.number().required(),
});
module.exports.createUnitmeasure = Joi.object().keys({
    jwtToken: Joi.string().required(),
});
module.exports.listUnitmeasureJwt = Joi.object().keys({
    user_id: Joi.number().required(),
  });
  module.exports.listUnitmeasure = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.editloadUnitmeasureJwt = Joi.object().keys({
    unit_id: Joi.number().required(),
  });
  module.exports.editloadUnitmeasure = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.deleteUnitmeasureJwt = Joi.object().keys({ 
    unit_id: Joi.number().required(),
    user_id: Joi.number().required(), 

  });
  module.exports.deleteUnitmeasure = Joi.object().keys({
    jwtToken: Joi.string().required(), 
  });