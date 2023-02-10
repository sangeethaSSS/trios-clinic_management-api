
const constants = require('../../constants');
const commonDataMgmtService = require('../../service/commonDataMgmtService');


//Create JWt Module
module.exports.fetchcommonDataJwt = async (req, res) => {
    let response = {};
    try {
      const responseFromService = await commonDataMgmtService.fetchcommonDataJwt(req.body); 
      if(!responseFromService.token) {
        response.status = 200;
      }    
      response.body = responseFromService;
    } catch (error) {
      response.message = error.message;
    }
    return res.send(response);
  }

//Fetch Common Data Module
module.exports.fetchcommonData = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await commonDataMgmtService.fetchcommonData(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
      // response.message = constants.userMessage.USER_CREATED;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create Doctor JWt Module
module.exports.fetchdoctorDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.fetchdoctorDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Fetch Doctor Data Module
module.exports.fetchdoctorData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.fetchdoctorData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
    response.message = constants.userMessage.LIST_CREATED;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//Create Patient JWt Module
module.exports.fetchpatientDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.fetchpatientDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Fetch Patient Data Module
module.exports.fetchpatientData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.fetchpatientData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
    response.message = constants.userMessage.LIST_CREATED;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//Create Consultation JWt Module
module.exports.fetchconsultationDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.fetchconsultationDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Fetch Consultation Data Module
module.exports.fetchconsultationData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.fetchconsultationData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
    response.message = constants.userMessage.LIST_CREATED;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//Bind City jwt 
module.exports.bindCityDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.bindCityDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Bind City 
module.exports.bindCityData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.bindCityData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
    response.message = constants.userMessage.LIST_CREATED;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//Bind Doctor jwt 
module.exports.bindDoctorDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.bindDoctorDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Bind Doctor 
module.exports.bindDoctorData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.bindDoctorData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
    response.message = constants.userMessage.LIST_CREATED;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//get Financial year details jwt 
module.exports.getFinancialyearJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.getFinancialyearJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//get Financial year details
module.exports.getFinancialyear = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.getFinancialyear(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
    response.message = constants.userMessage.LIST_CREATED;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}

//Create JWt Module
module.exports.companyDataJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.companyDataJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Fetch Company Data Module
module.exports.companyData = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.companyData(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}


//List Telephone jwt  
module.exports.telephoneListJwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await commonDataMgmtService.telephoneListJwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}


//List Telephone
module.exports.telephoneList = async (req, res) => {
let response = {};
try {   
  const responseFromService = await commonDataMgmtService.telephoneList(req.body); 
  if(!responseFromService.token) {
    response.status = 200;
    response.message = constants.userMessage.LIST_CREATED;
  }    
  response.body = responseFromService;
} catch (error) {
  response.message = error.message;
}
return res.send(response);
}