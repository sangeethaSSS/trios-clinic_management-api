const Joi = require('@hapi/joi');

  module.exports.searchPatientsJwt = Joi.object().keys({
    search_Value: Joi.string().required().allow(""),
    search_Type : Joi.string().required(),
    from_Date   : Joi.string().required().allow(""),
    to_Date   : Joi.string().required().allow("")
  });
  module.exports.searchPatients = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.saveBookingJwt = Joi.object().keys({ 
    patient_id : Joi.string().required().allow(""),
    user_id    : Joi.string().required().allow(""), 
    schedule_id: Joi.string().required().allow(""), 
    doctor_note: Joi.string().required().allow(""), 
    booking_date :Joi.string().required().allow(""),
    user_code : Joi.string().required().allow(""),
    employee_id : Joi.string().required().allow(""),

    patient_name : Joi.string().required().allow(""),
    area_name : Joi.string().required().allow(""),
    booking_type : Joi.number().required().allow("")
  });

  module.exports.saveBooking = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.updateBooking = Joi.object().keys({ 
    user_code : Joi.string().required(),
    schedule_id: Joi.string().required(), 
    doctor_note: Joi.string().required().allow(""), 
    booking_id :Joi.string().required(),
    booking_date:Joi.string().required(),
    employee_id :Joi.string().required(),
    area_name :Joi.string().required(),
    patient_name :Joi.string().required()
  });
  module.exports.listBooking = Joi.object().keys({
    current_Date : Joi.string().required(),
  });
  module.exports.listDoctor = Joi.object().keys({
    user_code : Joi.string().required().allow(""),
  });
  
  