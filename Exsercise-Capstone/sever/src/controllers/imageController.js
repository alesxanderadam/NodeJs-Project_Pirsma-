const prisma = require("../config/prisma-require");
const { successCode, sendInternalServerErrorResponse, sendNotFoundResponse, sendBadRequestResponse, successCodeNoData } = require("../config/response-status");
const sharp = require('sharp');
const { format } = require('date-fns');


const getAllImages = async (req, res) => {
    const { keyword } = req.params
    try {
        let data = await prisma.hinh_anh.findMany({
            where: keyword ? {
                ten_hinh: {
                    contains: keyword
                }
            } : {},
            select: {
                hinh_id: true,
                ten_hinh: true,
                duong_dan: true,
                mo_ta: true,
            }
        });
        if (data && data.length > 0) {
            successCode(res, data, "Success code")
        } else {
            sendNotFoundResponse(res, req.body, "Not find data in database")
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Sever error")
    }
}

const createImage = async (req, res) => {
    const { id } = req.params
    let { ten_hinh, mo_ta } = req.body
    try {
        let user = await prisma.nguoi_dung.findUnique({
            where: {
                nguoi_dung_id: parseInt(id),
            },
        });
        if (user) {
            if (!req.file) {
                sendBadRequestResponse(res, "load file must be an image")
                return;
            }
            const fileName = await sharp(process.cwd() + "/public/images/" + req.file.filename)
                .resize({ width: 500 })
                .jpeg({ quality: 70 })
                .png({ quality: 70 })
                .toBuffer();
            if (fileName) {
                const url = process.env.DB_HOST + ":" + process.env.PORT_SERVER + "/images/" + req.file.filename
                const ngay_luu = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
                const hinhAnh = await prisma.hinh_anh.create({
                    data: {
                        ten_hinh, duong_dan: url, mo_ta, nguoi_dung: {
                            connect: { nguoi_dung_id: parseInt(id) }
                        }
                    }
                })

                await prisma.luu_anh.create({
                    data: {
                        nguoi_dung: {
                            connect: { nguoi_dung_id: parseInt(id) }
                        },
                        hinh_anh: {
                            connect: { hinh_id: hinhAnh.hinh_id }
                        },
                        ngay_luu: new Date(ngay_luu)
                    }
                })

                if (hinhAnh) {
                    successCode(res, { hinhAnh }, "upload image succeses")
                } else {
                    sendNotFoundResponse(res, hinhAnh, "Uploaded file must be an image")
                }
            }
        } else {
            sendNotFoundResponse(res, user, "User not found")
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Server error")
    }
}

const addCommentForImage = async (req, res) => {
    let { id } = req.params
    let { noi_dung } = req.body
    const ngay_luu = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const hinhAnh = await prisma.hinh_anh.findUnique({
        where: { hinh_id: parseInt(id) },
    });

    if (!hinhAnh) {
        successCodeNoData(res, `Image with id ${id} does not exist`)
        return;
    } else {
        try {
            const binhLuan = await prisma.binh_luan.create({
                data: {
                    hinh_anh: {
                        connect: {
                            hinh_id: parseInt(id)
                        }
                    },
                    nguoi_dung: {
                        connect: { nguoi_dung_id: req.user.data.nguoi_dung_id }
                    },
                    ngay_binh_luan: new Date(ngay_luu),
                    noi_dung
                }
            })
            successCode(res, binhLuan, "Comment success")
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

const getDetailImage = async (req, res) => {
    let { id } = req.params
    try {
        let infoImage = await prisma.hinh_anh.findUnique({
            where: {
                hinh_id: parseInt(id)
            }
        })
        if (infoImage) {
            let image = await prisma.hinh_anh.findMany({
                where: { hinh_id: parseInt(id) },
                select: {
                    ten_hinh: true,
                    duong_dan: true,
                    mo_ta: true,
                    nguoi_dung: {
                        select: {
                            ho_ten: true
                        }
                    }
                }
            })
            successCode(res, image, "Success code")
        } else {
            sendNotFoundResponse(res, "Not find data in database")
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Sever error")
        return;
    }
}

const getComment = async (req, res) => {
    let { id } = req.params
    try {
        let infoImage = await prisma.hinh_anh.findUnique({
            where: {
                hinh_id: parseInt(id)
            }
        })
        if (infoImage) {
            let comment = await prisma.binh_luan.findMany({
                where: { hinh_id: parseInt(id) }
            })
            successCode(res, comment, "Success code")
        } else {
            sendNotFoundResponse(res, "Not find data in database")
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Sever error")
        return;
    }
}


const checkedSaveImage = async (req, res) => {
    let { id } = req.params
    try {
        let image = await prisma.luu_anh.findUnique({
            where: {
                nguoi_dung_id_hinh_id: {
                    nguoi_dung_id: req.user.data.nguoi_dung_id,
                    hinh_id: Number(id),
                },
            },
        })
        if (image) {
            successCode(res, "Đã lưu", "Success code")
        } else {
            successCode(res, "Chưa lưu")
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Sever error")
        return;
    }
}

module.exports = {
    getAllImages,
    getComment,
    checkedSaveImage,
    getDetailImage,
    createImage,
    addCommentForImage
}