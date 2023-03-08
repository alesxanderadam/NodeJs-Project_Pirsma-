const prisma = require("../config/prisma-require")
const bcrypt = require('bcrypt');
const { successCode, sendNotFoundResponse, sendInternalServerErrorResponse } = require('../config/response-status');


const signUp = async (req, res) => {
    let { email, mat_khau, tuoi } = req.body;
    try {
        let checkEmail = await prisma.nguoi_dung.findFirst({
            where: {
                email
            }
        });
        if (checkEmail) {
            sendNotFoundResponse(res, `Email: ${checkEmail.email} đã tồn tại`)
            return;
        }
        if (tuoi > 100) {

            return
        }
        let data = await prisma.nguoi_dung.create({ data: { ...req.body, mat_khau: bcrypt.hashSync(mat_khau, 10) } })
        if (data) {
            successCode(res, data, "Tạo người dùng thành công")
        } else {
            sendNotFoundResponse(res, data, "Lỗi không tìm thấy!")
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Lỗi backend")
    }

}

module.exports = {
    signUp
}