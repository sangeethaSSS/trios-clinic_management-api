const Joi = require('@hapi/joi');

module.exports.createEmployeeJwt = Joi.object().keys({
    employee_id: Joi.number().required(), 
    employee_name: Joi.string().required(), 
    gender_id: Joi.number().required(), 
    mobile_number: Joi.string().required(), 
    whatsapp_number: Joi.string(), 
    reg_number: Joi.string().allow(""),
    designation_id: Joi.number().required(), 
    specialization_id: Joi.number().required(), 
    specialization_array: Joi.array().required().allow([]), 
    email_id: Joi.string().allow(""), 
    street_name: Joi.string().allow(""), 
    area_name: Joi.string().allow(""), 
    pincode: Joi.string().allow(""), 
    employee_category_id: Joi.number().required(), 
    aadhar_number: Joi.number(), 
    consulting_duration: Joi.number().required(), 
    active_status: Joi.number().required(), 
    consulting_fees: Joi.number().required(), 
    department_id: Joi.number().required(),
    city_id: Joi.number().required(),
    qualification: Joi.string().required(),
    user_id: Joi.number().required(), 
    city_name:Joi.string().allow(""),
    consulting_hours:Joi.array().allow([]),
  });
  module.exports.createEmployee = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  
  module.exports.deleteEmployeeJwt = Joi.object().keys({
    employee_id: Joi.number().required(), 
    user_id: Joi.number().required(),
  });
  module.exports.deleteEmployee = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.listEmployeeJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    employee_id: Joi.number().required(),
    active_status: Joi.number().required(),
  });
  module.exports.listEmployee = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.editloadEmployeeJwt = Joi.object().keys({ 
    employee_id: Joi.number().required(), 
  });
  module.exports.editloadEmployee = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.registerCheckingJwt = Joi.object().keys({ 
    reg_number: Joi.string().required(), 
    employee_id: Joi.number().required(), 
  });
  module.exports.registerChecking = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });