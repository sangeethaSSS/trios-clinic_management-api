'use strict';

var express = require('express');
var radiology_Price = require('./radiologyPrice.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var radiology = require('./radiology.contoller');
const radiologyPriceSchema = require('../../apiSchema/radiologyPriceMgmtSchema');
const radiologySchema = require('../../apiSchema/RadiologyMgmtSchema');

var radiology_report = require('./radiologyReport.controller');
const radiologyReportMgmtSchema = require('../../apiSchema/radiologyReportMgmtSchema');

var router = express.Router();

//Create radiology price jwt 
router.post('/createRadiologyPriceJwt',
    joiSchemaValidation.validateBody(radiologyPriceSchema.createRadiologyPriceJwt),
    radiology_Price.createRadiologyPriceJwt
);

//Create radiology price
router.post('/createRadiologyPrice',
    joiSchemaValidation.validateBody(radiologyPriceSchema.createRadiologyPrice),
    radiology_Price.createRadiologyPrice
);

//Edit radiology price jwt 
router.post('/editloadRadiologyPriceJwt',
    joiSchemaValidation.validateBody(radiologyPriceSchema.editloadRadiologyPriceJwt),
    radiology_Price.editloadRadiologyPriceJwt
);

//Edit radiology price
router.post('/editloadRadiologyPrice',
    joiSchemaValidation.validateBody(radiologyPriceSchema.editloadRadiologyPrice),
    radiology_Price.editloadRadiologyPrice
);

//List radiology price jwt 
router.post('/listRadiologyPriceJwt',
    joiSchemaValidation.validateBody(radiologyPriceSchema.listRadiologyPriceJwt),
    radiology_Price.listRadiologyPriceJwt
);

//List radiology price
router.post('/listRadiologyPrice',
    joiSchemaValidation.validateBody(radiologyPriceSchema.listRadiologyPrice),
    radiology_Price.listRadiologyPrice
);


//Create radiology  jwt 
router.post('/createRadiologyJwt',
    joiSchemaValidation.validateBody(radiologySchema.createRadiologyJwt),
    radiology.createRadiologyJwt
);

//Create radiology 
router.post('/createRadiology',
    joiSchemaValidation.validateBody(radiologySchema.createRadiology),
    radiology.createRadiology
);

//Edit Load radiology  jwt 
router.post('/editloadRadiologyJwt',
    joiSchemaValidation.validateBody(radiologySchema.editloadRadiologyJwt),
    radiology.editloadRadiologyJwt
);

//Editload radiology 
router.post('/editloadRadiology',
    joiSchemaValidation.validateBody(radiologySchema.editloadRadiology),
    radiology.editloadRadiology
);

//get Radiology PaymentStatus jwt 
router.post('/getRadiologyPaymentStatusJwt',
    joiSchemaValidation.validateBody(radiologySchema.getRadiologyPaymentStatusJwt),
    radiology.getRadiologyPaymentStatusJwt
);

//get Radiology PaymentStatus 
router.post('/getRadiologyPaymentStatus',
    joiSchemaValidation.validateBody(radiologySchema.getRadiologyPaymentStatus),
    radiology.getRadiologyPaymentStatus
);

//Load radiology Details jwt 
router.post('/loadRadiologyDetailsJwt',
    joiSchemaValidation.validateBody(radiologySchema.loadRadiologyDetailsJwt),
    radiology.loadRadiologyDetailsJwt
);

//Load radiology Details
router.post('/loadRadiologyDetails',
    joiSchemaValidation.validateBody(radiologySchema.loadRadiologyDetails),
    radiology.loadRadiologyDetails
);

//Load radiology Report List Details jwt 
router.post('/listRadiologyReportJwt',
    joiSchemaValidation.validateBody(radiologyReportMgmtSchema.listRadiologyReportJwt),
    radiology_report.listRadiologyReportJwt
);

//Load radiology Report Details
router.post('/listRadiologyReport',
    joiSchemaValidation.validateBody(radiologyReportMgmtSchema.listRadiologyReport),
    radiology_report.listRadiologyReport
);

//Create radiology Report  Details
router.post('/CreateRadiologyReport',
    joiSchemaValidation.validateBody(radiologyReportMgmtSchema.CreateRadiologyReport),
    radiology_report.CreateRadiologyReport
);

//editLoad Radiology Images Jwt 
router.post('/editLoadRadiologyImagesJwt',
    joiSchemaValidation.validateBody(radiologyReportMgmtSchema.editLoadRadiologyImagesJwt),
    radiology_report.editLoadRadiologyImagesJwt
);

//editLoad Radiology Images
router.post('/editLoadRadiologyImages',
    joiSchemaValidation.validateBody(radiologyReportMgmtSchema.editLoadRadiologyImages),
    radiology_report.editLoadRadiologyImages
);

//editLoad Radiology Images Jwt 
router.post('/ListRadiologyImagesJwt',
    joiSchemaValidation.validateBody(radiologyReportMgmtSchema.ListRadiologyImagesJwt),
    radiology_report.ListRadiologyImagesJwt
);

//editLoad Radiology Images
router.post('/ListRadiologyImages',
    joiSchemaValidation.validateBody(radiologyReportMgmtSchema.ListRadiologyImages),
    radiology_report.ListRadiologyImages
);
module.exports = router;