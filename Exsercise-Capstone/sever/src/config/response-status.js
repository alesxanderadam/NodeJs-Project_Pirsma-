//200
const successCode = (res, data, message) => {
    res.status(200).json({
        message,
        content: data
    })

}
//400
const sendBadRequestResponse = (res, data, message) => {
    res.status(400).json({
        message,
        content: data
    })
}

//401
const sendUnauthorizedResponse = (res, data, message) => {
    res.status(401).json({
        message,
        content: data
    })
}

//404
const sendNotFoundResponse = (res, data, message) => {
    res.status(404).json({
        message,
        content: data
    })
}

//500
const sendInternalServerErrorResponse = (res, message) => {
    res.status(500).json({
        message,
    })
}

module.exports = {
    successCode, sendBadRequestResponse, sendUnauthorizedResponse, sendNotFoundResponse, sendInternalServerErrorResponse
}