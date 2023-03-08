const prisma = require("../config/prisma-require")
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt')
const { sendInternalServerErrorResponse, sendNotFoundResponse, sendBadRequestResponse, successCode } = require('../config/response-status');

const signIn = async (req, res) => {
    let { email, mat_khau } = req.body;
    try {
        if (!email || !mat_khau) {
            return sendBadRequestResponse(res, "Email or password is missing");
        }
        const user = await prisma.nguoi_dung.findFirst({
            where: {
                email
            }
        });
        if (user) {
            let checkPassword = bcrypt.compare(mat_khau, user.mat_khau);
            if (checkPassword) {
                let token = generateToken(user)
                successCode(res, token, "Login user success");
                return;
            }
            else {
                sendNotFoundResponse(res, { email, mat_khau }, "Sai mật khẩu")
                return;
            }
        } else {
            sendNotFoundResponse(res, { email, mat_khau }, "Email khong ton tai")
            return;
        }
    } catch (error) {
        sendInternalServerErrorResponse(res, "Lỗi backend")
        return;
    }

}

module.exports = {
    signIn
}
