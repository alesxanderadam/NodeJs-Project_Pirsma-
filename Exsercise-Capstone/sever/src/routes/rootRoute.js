const express = require('express');
const authenticationRoute = require('./authenticationRoute');
const authozirationRoute = require('./authorizationRoute');
const imageRoute = require('./imageRoute');
const userRoute = require('./userRoute');
const rootRoute = express.Router();

rootRoute.use("/user", authozirationRoute)
rootRoute.use("/user", authenticationRoute)
rootRoute.use("/user", userRoute)
rootRoute.use("/image", imageRoute)

module.exports = rootRoute;