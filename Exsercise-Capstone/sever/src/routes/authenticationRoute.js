const express = require("express");
const { signIn } = require("../controllers/authenticationController");
const authenticationRoute = express.Router();

authenticationRoute.post("/signIn", signIn)

module.exports = authenticationRoute;
