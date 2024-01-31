const {forgotpass} = require("../controller/forgotpassCtrll")

const  router = require('express').Router()

// sent password reset email flow
router.post("/",forgotpass)

module.exports = router