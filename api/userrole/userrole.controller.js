const constants = require('../../constants');
const userroleMgmtService = require('../../service/userroleMgmtService');

//List Main menu userrole JWt Module
module.exports.listMainMenuJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.listMainMenuJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//List Main menu userrole Module
module.exports.listMainMenu = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.listMainMenu(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Sub-menu userrole JWt Module
module.exports.listSubMenuJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.listSubMenuJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Sub-menu userrole Module
module.exports.listSubMenu = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.listSubMenu(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//create Userrole Jwt Module
module.exports.createUserroleJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.createUserroleJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//create Userrole Module
module.exports.createUserrole = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.createUserrole(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Userrole Jwt
module.exports.editUserroleJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.editUserroleJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Userrole
module.exports.editUserrole = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.editUserrole(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Userrole Jwt
module.exports.listUserroleJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.listUserroleJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Userrole
module.exports.listUserrole = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await userroleMgmtService.listUserrole(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}