const {resetpage,updatepass} = require("../controller/resetpassCtrll.js")

const  router = require('express').Router()
const jwt = require("jsonwebtoken")
const User = require('../models/user.js') 

// middleware verify user
const verifyUser = async (req, res, next) => {
    try{
        const { id, token } = req.params ;

        // check user
        const user = await User.findOne({ token: token })
        if(!user) return res.status(400).json({error: 'link invalid or expired', acknowledged: false})

        // JWT verify
        const jwtVerify = jwt.verify( token , process.env.SECRET_KEY );
        if(!jwtVerify) res.status(400).json({error: 'link invalid or expired', acknowledged: false})

        // attach user
        req.user = user;

        next();

    }catch(err){
        if(err.name === 'TokenExpiredError'){
            res.status(500).json({
                error: 'Token expired', message: 'create another token for password reset'
            });
        }else{
            res.status(500).json({error: 'Internal Server Error', message:err});
        }
    }
}

// to reset page
router.get("/:id/:token",verifyUser,resetpage)
// update new password
router.patch("/update/:id/:token",verifyUser,updatepass)

module.exports = router

