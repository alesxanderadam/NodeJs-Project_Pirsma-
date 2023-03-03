const prisma = require("../config/prisma-require")
const bcrypt = require('bcrypt');
const { successCode, sendNotFoundResponse, sendBadRequestResponse, sendInternalServerErrorResponse, sendUnauthorizedResponse } = require('../config/response-status');
const sharp = require('sharp');


const getUserById = async (req, res) => {
    let { id } = req.params
    try {
        const user = await prisma.nguoi_dung.findUnique({
            where: { nguoi_dung_id: parseInt(id) }
        })
        if (user) {
            let dataUserById = await prisma.nguoi_dung.findUnique({
                where: { nguoi_dung_id: parseInt(id) },
                select: {
                    nguoi_dung_id: true,
                    email: true,
                    ho_ten: true,
                    anh_dai_dien: true
                }
            })
            successCode(res, dataUserById, "Success code")
        } else {
            sendNotFoundResponse(res, "User not found")
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Secer error")
    }

}

const getImageByUserId = async (req, res) => {
    let { id } = req.params
    try {
        const user = await prisma.nguoi_dung.findUnique({
            where: { nguoi_dung_id: parseInt(id) }
        })
        if (user) {
            let dataUserById = await prisma.nguoi_dung.findUnique({
                where: { nguoi_dung_id: parseInt(id) },
                select: {
                    hinh_anh: true
                }
            })
            if (!dataUserById || !dataUserById.hinh_anh) {
                sendNotFoundResponse(res, "No photos have been added yet")
            } else {
                successCode(res, dataUserById, "Success code")
            }
        } else {
            sendNotFoundResponse(res, "User not found")
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Sever error")
    }

}

const getImageSaved = async (req, res) => {
    let { id } = req.params
    try {
        const user = await prisma.nguoi_dung.findUnique({
            where: { nguoi_dung_id: parseInt(id) }
        })
        if (user) {
            // luuAnhList này sẽ tìm tất cả ảnh của user id truyền vào => [hinh_id]
            const luuAnhList = await prisma.luu_anh.findMany({
                where: { nguoi_dung_id: parseInt(id) },
                select: { hinh_id: true }
            })
            // imageList sẽ dùng in để so sánh thằng hinh_id của hinh_anh có cái nào === với hinh_id của luuAnhList không nếu tìm thấy thì sẽ trả ra hình đó và include với user tương ứng với hình
            const imageList = await prisma.hinh_anh.findMany({
                where: { hinh_id: { in: luuAnhList.map(l => l.hinh_id) } },
                include: { nguoi_dung: true }
            })
            successCode(res, imageList, "Success code")
        } else {
            sendNotFoundResponse(res, "User not found")
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Sever error")
        return;
    }
}

const deleteImageSaved = async (req, res) => {
    let { hinh_id } = req.body
    try {
        const image = await prisma.hinh_anh.findUnique({
            where: { hinh_id: parseInt(hinh_id) },
        })
        if (image) {
            const luuAnh = await prisma.luu_anh.findMany({
                where: { hinh_id: parseInt(hinh_id), nguoi_dung_id: req.user.data.nguoi_dung_id },
            });
            const binhLuan = await prisma.binh_luan.findMany({
                where: { hinh_id: parseInt(hinh_id), nguoi_dung_id: req.user.data.nguoi_dung_id },
            });

            if (image.nguoi_dung_id === req.user.data.nguoi_dung_id) {
                if (luuAnh.length > 0 || binhLuan.length > 0) {
                    await prisma.binh_luan.deleteMany({
                        where: { hinh_id: parseInt(hinh_id), nguoi_dung_id: req.user.data.nguoi_dung_id }
                    });

                    await prisma.luu_anh.deleteMany({
                        where: { hinh_id: parseInt(hinh_id), nguoi_dung_id: req.user.data.nguoi_dung_id }
                    });
                }

                // Xóa ảnh
                await prisma.hinh_anh.delete({
                    where: { hinh_id: parseInt(hinh_id) }
                });
                successCode(res, "Đã xóa ảnh thành công")
            } else {
                sendUnauthorizedResponse(res, "Bạn không có quyền xóa ảnh này");
            }
        } else {
            sendNotFoundResponse(res, "Image not found");
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Sever error")
        return;
    }
}

const updateUser = async (req, res) => {
    let { id } = req.params
    let { email, mat_khau, ho_ten, tuoi } = req.body
    try {
        let user = await prisma.nguoi_dung.findUnique({
            where: {
                nguoi_dung_id: parseInt(id)
            }
        });
        if (user) {
            let modalUserUpdate = {
                email,
                mat_khau: bcrypt.hashSync(mat_khau, 10),
                ho_ten,
                tuoi
            }
            await prisma.nguoi_dung.update({
                where: {
                    nguoi_dung_id: parseInt(id),
                },
                data: modalUserUpdate
            });
            successCode(res, user, "update user success")
        } else {
            sendNotFoundResponse(res, req.body, "404 Not found")
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Server error")
    }
}


const uploadImageUser = async (req, res) => {
    let { id } = req.params
    try {
        let user = await prisma.nguoi_dung.findUnique({
            where: {
                nguoi_dung_id: parseInt(id),
            },
        });
        if (user) {
            if (!req.file) {
                sendBadRequestResponse(res, "pload file must be an image")
                return;
            }
            const fileName = await sharp(process.cwd() + "/public/user-images/" + req.file.filename)
                .resize({ width: 500 })
                .jpeg({ quality: 70 })
                .png({ quality: 70 })
                .toBuffer();
            if (fileName) {
                const url = process.env.DB_HOST + ":" + process.env.PORT_SERVER + "/user-images/" + req.file.filename
                await prisma.nguoi_dung.update({
                    where: {
                        nguoi_dung_id: parseInt(id)
                    },
                    data: { anh_dai_dien: url },
                })
                successCode(res, { anh_dai_dien: url }, "upload image user succeses")
            } else {
                sendBadRequestResponse(res, "Upload file must be an image");
            }
        } else {
            sendNotFoundResponse(res, "User not found");
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "sever error")
    }
}

module.exports = {
    getUserById,
    getImageByUserId,
    getImageSaved,
    updateUser,
    uploadImageUser,
    deleteImageSaved
}