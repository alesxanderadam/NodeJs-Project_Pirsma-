const express = require("express");
const { getAllImages, createImage, getDetailImage, getComment, checkedSaveImage, addCommentForImage } = require("../controllers/imageController");
const { diskStorage } = require('multer');

const imageRoute = express.Router();

const multer = require("multer");
const { verifyToken } = require("../utils/jwt");

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.cwd()}/public/images`)
    },
    filename: (req, file, cb) => {
        const d = new Date()
        const newName = d.getDate() + "_" + file.originalname
        cb(null, newName);
    }
})
const upload = multer({ storage })

imageRoute.get("/getAllImages/:keyword?", getAllImages);
imageRoute.get("/getComment/:id", getComment);
imageRoute.get("/getDetailImage/:id", getDetailImage);
imageRoute.get("/checkedSaveImage/:id", verifyToken, checkedSaveImage);
imageRoute.post("/createImages", verifyToken, upload.single("file"), createImage);
imageRoute.post("/addCommentForImage/:id", verifyToken, addCommentForImage);

module.exports = imageRoute;