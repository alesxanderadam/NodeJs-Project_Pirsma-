const prisma = require("../config/prisma-require")
const bcrypt = require('bcrypt');
const { successCode, sendNotFoundResponse } = require('../config/response-status');


const signUp = async (req, res) => {
    let { email, mat_khau, ho_ten, tuoi } = req.body;

    let modalUser = {
        email,
        mat_khau: bcrypt.hashSync(mat_khau, 10),
        ho_ten,
        tuoi
    }

    let data = await prisma.nguoi_dung.create({ data: modalUser })
    if (data) {
        successCode(res, data, "Create user success")
    } else {
        sendNotFoundResponse(res, data, "404 NotFound")
    }
}

module.exports = {
    signUp
}