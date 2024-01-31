const { genearateToken } = require('../auth/auth.js')
const { sentMail } = require('../utils/passresetMail.js')
const User = require('../models/user.js')


module.exports.forgotpass = async(req,res) => {
    try{
        // user exist
        const user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(404).json({error: 'user not found'});

        // generate token
        const token = genearateToken(user._id);
        // sent mail with token
        const sentedMail = await sentMail(req.body.email, user._id, token, req.body.link);
        // console.log(sentedMail);
        if(!sentedMail)  return res.status(400).json({error: 'error sending mail'});

        // save token in Database
        user.token = token;
        await user.save();

        res.status(200).json({message: 'Email Sent Successfully', valid: 'Email is valid for 15 mintues'})

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err.message});
    }
}
