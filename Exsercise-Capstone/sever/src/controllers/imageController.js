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
            successCode(res, data, "Xử lý thành công")
        } else {
            sendNotFoundResponse(res, req.body, "Không tìm thấy dữ liệu trong database")
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Lỗi backend")
    }
}

const createImage = async (req, res) => {
    let { nguoi_dung_id } = req.user.data
    let { ten_hinh, mo_ta } = req.body
    try {
        if (!req.file) {
            sendBadRequestResponse(res, "File gửi lên phải là hình ảnh")
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
                        connect: { nguoi_dung_id: parseInt(nguoi_dung_id) }
                    }
                }
            })

            await prisma.luu_anh.create({
                data: {
                    nguoi_dung: {
                        connect: { nguoi_dung_id: parseInt(nguoi_dung_id) }
                    },
                    hinh_anh: {
                        connect: { hinh_id: hinhAnh.hinh_id }
                    },
                    ngay_luu: new Date(ngay_luu)
                }
            })

            if (hinhAnh) {
                successCode(res, { hinhAnh }, "tải ảnh thành công")
            } else {
                sendBadRequestResponse(res, "File gửi lên phải là hình ảnh")
            }
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Lỗi backend")
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
            res.status(500).json({ error: 'Lỗi backen' });
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
            successCode(res, image, "Xử lý thành công")
        } else {
            sendNotFoundResponse(res, "Không tìm thấy dữ liệu trong database")
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Lỗi backend")
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
            successCode(res, comment, "Xử lý thành công")
        } else {
            sendNotFoundResponse(res, "Không tìm thấy dữ liệu trong database")
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Lỗi backend")
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
            successCode(res, "Đã lưu", "Xử lý thành công")
        } else {
            successCode(res, "Chưa lưu")
            return;
        }
    } catch (err) {
        sendInternalServerErrorResponse(res, "Lỗi backend")
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