const express = require("express")
const { signUp } = require("../controllers/authorizationController")
const authozirationRoute = express.Router()

authozirationRoute.post("/signUp", signUp)
module.exports = authozirationRoute