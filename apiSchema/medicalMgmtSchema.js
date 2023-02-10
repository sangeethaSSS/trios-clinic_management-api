const Joi = require('@hapi/joi');

module.exports.creatMedicalJwt = Joi.object().keys({
  certificate_id: Joi.number().required(),
  patient_id: Joi.string().required(),
  patient_name: Joi.string().required().allow(""),
  mobile_number: Joi.string().required().allow(""),
  employee_id: Joi.number().required(),
  user_id: Joi.number().required(),
  active_status: Joi.number().required(),
  template_id: Joi.number().required(),
  custom_template_content: Joi.string().required().allow(0),
  medical_startdate: Joi.number().required(),
  medical_enddate: Joi.number().required().allow(0),
});
// {
//   "certificate_id":1,
//   "patient_id":1,
//   "patient_name":"prabha",
//   "mobile_number":"6789065434",
//   "employee_id":3,
//   "user_id":1,
//   "active_status":1,
//   "template_id":1,
//   "custom_template_content":"",
//   "medical_startdate":1637778600000,
//   "medical_enddate"

// }
module.exports.creatMedical = Joi.object().keys({
  jwtToken: Joi.string().required(),
});

// module.exports.listMedicalJwt = Joi.object().keys({
//   user_id: Joi.number().required(),
// });
// module.exports.listMedical = Joi.object().keys({
//   jwtToken: Joi.string().required(),
// });
// module.exports.editloadMedicalJwt = Joi.object().keys({
//   certificate_id: Joi.number().required(),
// });
// module.exports.editloadMedical = Joi.object().keys({
//   jwtToken: Joi.string().required(),
// });