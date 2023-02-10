const Joi = require('@hapi/joi');

//Check input schema
module.exports.sheduleCheck = Joi.object().keys({
  current_date : Joi.string().allow("")
  });