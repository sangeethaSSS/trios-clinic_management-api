const constants = require('../../constants');
const ConsultationMgmtService = require('../../service/ConsultationMgmtService');

//Create Consultation JWt Module
module.exports.createConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.createConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Create Consultation Module
module.exports.createConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.createConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get Data Consultation Jwt Module
module.exports.getDataConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getDataConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get Data Consultation Module
module.exports.getDataConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getDataConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
// List Consultation Jwt Module
module.exports.listConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.listConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//List Consultation  Module
module.exports.listConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.listConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Edit  Consultation Jwt  Module
module.exports.editloadConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.editloadConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Edit Consultation  Module
module.exports.editloadConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.editloadConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Clinic History Jwt Jwt  Module
module.exports.clinicHistoryJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.clinicHistoryJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Clinic History   Module
module.exports.clinicHistory = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.clinicHistory(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Previous Consultation Jwt Module
module.exports.previousConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.previousConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Previous Consultation Module
module.exports.previousConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.previousConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Next Consultation  Jwt Module
module.exports.nextConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.nextConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Next Consultation  Module
module.exports.nextConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.nextConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Update payement Jwt Module
module.exports.updatePaymentStatusJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.updatePaymentStatusJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Update payement Module
module.exports.updatePaymentStatus = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.updatePaymentStatus(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// //clinical Photography Jwt Module
// module.exports.clinicalPhotographyJwt = async (req, res) => {
//     let response = {};
//     try {
//         const responseFromService = await ConsultationMgmtService.clinicalPhotographyJwt(req.body);
//         if (!responseFromService.token) {
//             response.status = 200;
//         }
//         response.body = responseFromService;
//     } catch (error) {
//         response.message = error.message;
//     }
//     return res.send(response);
// }
//clinical Photography Module
module.exports.clinicalPhotography = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.clinicalPhotography(req.body);
        console.log(responseFromService,"comtroller")
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Consultation clinicalImages Jwt  Module
module.exports.getConsultationclinicalImagesJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getConsultationclinicalImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Consultation clinicalImages Module
module.exports.getConsultationclinicalImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getConsultationclinicalImages(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Patient clinicalImages Jwt  Module
module.exports.getPatientclinicalImagesJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getPatientclinicalImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Patient clinicalImages Module
module.exports.getPatientclinicalImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getPatientclinicalImages(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Financial Year setting checking Jwt  Module
module.exports.getFinancial_yearJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getFinancial_yearJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Financial Year setting checking
module.exports.getFinancial_year = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getFinancial_year(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Account Master setting checking Jwt  Module
module.exports.getAccountMasterJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getAccountMasterJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Account Master setting checking
module.exports.getAccountMaster = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getAccountMaster(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//lab Report Details Jwt  Module
module.exports.loadtest_DetailsJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.loadtest_DetailsJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//lab Report Details Module
module.exports.loadtest_Details = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.loadtest_Details(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//get Patient Id Jwt  Module
module.exports.getpatient_idJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getpatient_idJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//get Patient Id Module
module.exports.getpatient_id = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getpatient_id(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Update payement Jwt Module
module.exports.checkPaymentStatusJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.checkPaymentStatusJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Update payement Module
module.exports.checkPaymentStatus = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.checkPaymentStatus(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//onchange Drug List Jwt Module
module.exports.onchangeDrugListJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.onchangeDrugListJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//onchange Drug List Module
module.exports.onchangeDrugList = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.onchangeDrugList(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create OLd Prescription Medicine JWt Module
module.exports.oldPrescriptionJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.oldPrescriptionJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Create OLd Prescription Medicine Module
module.exports.oldPrescription = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.oldPrescription(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Old Prescription Jwt
module.exports.editOldPrescriptionJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.editOldPrescriptionJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Edit Old Prescription
module.exports.editOldPrescription = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.editOldPrescription(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Report Photography service
module.exports.reportPhotography = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.reportPhotography(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Consultation Report Image jwt 
module.exports.getConsultationReportImagesJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getConsultationReportImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Consultation Report Image
module.exports.getConsultationReportImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getConsultationReportImages(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Report Image jwt 
module.exports.editReportImagesJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.editReportImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Edit Report Image
module.exports.editReportImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.editReportImages(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Update Report Image
module.exports.updateReportImage = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.updateReportImage(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Report Image Jwt
module.exports.deleteReportImageJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.deleteReportImageJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Report Image
module.exports.deleteReportImage = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.deleteReportImage(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}