const Joi = require('@hapi/joi');

//Check input schema
module.exports.createRadiologyJwt = Joi.object().keys({
    radiology_test_id: Joi.number().required(), 
    employee_id: Joi.number().required(), 
    appointment_id: Joi.number().required(), 
    patient_id: Joi.number().required(),
    paymentstatus_id:Joi.number().required(), 
    module_id:Joi.number().required(), 
    radiology_rate:Joi.number().required(), 
    user_id:Joi.number().required(), 
    active_status:Joi.number().required(), 
    radiology_Array:Joi.array().required().allow([]),
  });
  module.exports.createRadiology= Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.editloadRadiologyJwt= Joi.object().keys({ 
    radiology_test_id: Joi.number().required(), 
  });
  module.exports.editloadRadiology= Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.getRadiologyPaymentStatusJwt= Joi.object().keys({ 
    appointment_id: Joi.number().required(), 
  });
  module.exports.getRadiologyPaymentStatus= Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.loadRadiologyDetailsJwt= Joi.object().keys({ 
    radiology_test_id: Joi.number().required(), 
  });
  module.exports.loadRadiologyDetails= Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
