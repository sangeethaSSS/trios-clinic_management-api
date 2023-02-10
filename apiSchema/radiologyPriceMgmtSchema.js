const Joi = require('@hapi/joi');

//Check input schema
module.exports.createRadiologyPriceJwt = Joi.object().keys({
  radiology_price_id: Joi.number().required(), 
  radiology_id: Joi.number().required(), 
  radiology_part_id: Joi.number().required(), 
  price:Joi.number().required(), 
  user_id:Joi.number().required(), 
  active_status:Joi.number().required(), 
});
module.exports.createRadiologyPrice = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

module.exports.editloadRadiologyPriceJwt = Joi.object().keys({
  radiology_price_id: Joi.number().required(), 
});
module.exports.editloadRadiologyPrice = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

module.exports.listRadiologyPriceJwt = Joi.object().keys({
  user_id: Joi.number().required(), 
});
module.exports.listRadiologyPrice = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});