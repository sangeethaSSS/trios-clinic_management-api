const Joi = require('@hapi/joi');

module.exports.createTransactionJwt = Joi.object().keys({ 
    transaction_id: Joi.number().required(), 
    employee_id: Joi.number().required(),
    appointment_id:Joi.number().required(),
    patient_id: Joi.number().required(), 
    module_id: Joi.number().required(), 
    paymentstatus_id: Joi.number().required(), 
    total_amount:Joi.number().required(), 
    user_id: Joi.number().required(), 
    active_status: Joi.number().required(), 
    employee_testArray:Joi.array().required().allow([]),
  });
  module.exports.createTransaction = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });