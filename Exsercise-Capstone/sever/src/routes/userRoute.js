const express = require("express")
//config router
const userRoute = express.Router()
//require checktoken
const { verifyToken } = require("../utils/jwt")
const { updateUser, uploadImageUser, getUserById, getImageByUserId, getImageSaved, deleteImageSaved } = require("../controllers/userController");
const { diskStorage } = require('multer');

//require upload
const multer = require("multer");

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.cwd()}/public/user-images`)
    },
    filename: (req, file, cb) => {
        const d = new Date()
        const newName = d.getDate() + "_" + file.originalname
        cb(null, newName);
    }
})
const upload = multer({ storage })

userRoute.get("/getUserById/:id", verifyToken, getUserById)

userRoute.get("/getImageByUserId/:id", verifyToken, getImageByUserId)

userRoute.get("/getImageSaved/:id", verifyToken, getImageSaved)

userRoute.post("/uploadImagesUser/:id", upload.single("file"), uploadImageUser)

userRoute.put("/updateUser/:id", verifyToken, updateUser)

userRoute.delete("/deleteImageSaved", verifyToken, deleteImageSaved)
module.exports = userRoute