const {login,signup,reActi_by_Sesstok,reActi_by_email,activateAcc} = require("../controller/userCtrll.js")

const  router = require('express').Router()

router.post("/user",login)
router.post("/newuser",signup)
// Resend Activation email by session token
router.post("/resend",reActi_by_Sesstok)
// Resend Activation email by email
router.post("/resendemail",reActi_by_email)
//activate account
router.get("/activate/:token",activateAcc)

module.exports = router