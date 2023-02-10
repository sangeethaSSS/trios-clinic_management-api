const Joi = require('@hapi/joi');

module.exports.errorLog = Joi.object().keys({
    platform: Joi.string().required().allow(''),
    Module: Joi.string().required().allow(''), 
    error : Joi.string().required().allow(''), 
    functionality:Joi.string().required().allow(''),
  });