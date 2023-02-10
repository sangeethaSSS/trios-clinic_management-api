const Joi = require('@hapi/joi');

module.exports.createPatientLabtestJwt = Joi.object().keys({ 
    lab_patient_id: Joi.number().required(), 
    employee_id: Joi.number().required(),
    appointment_id:Joi.number().required(),
    patient_id: Joi.number().required(), 
    lab_rate: Joi.number().required(), 
    module_id: Joi.number().required(),
    paymentstatus_id: Joi.number().required(), 
    user_id: Joi.number().required(), 
    active_status: Joi.number().required(), 
    employee_testArray:Joi.array().required().allow([]),
  });
  module.exports.createPatientLabtest = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadPatientLabDetailsJwt = Joi.object().keys({ 
    lab_patient_id:Joi.number().required(),
  });
  module.exports.editloadPatientLabDetails = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.getPaymentStatusJwt = Joi.object().keys({ 
    appointment_id:Joi.number().required(),
  });
  module.exports.getPaymentStatus = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.loadTestDetailsJwt = Joi.object().keys({ 
    lab_patient_id:Joi.number().required(),
  });
  module.exports.loadTestDetails = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });