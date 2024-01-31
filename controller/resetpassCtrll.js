const bcrypt = require("bcrypt");

//To reset page
module.exports.resetpage = async(req,res) => {
    try{
        res.status(200).json({data: 'verified user', acknowledged: true});

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
}

// update new password
module.exports.updatepass = async(req,res) => {
    try{
        // check for empty data
        if(req.body.newPassword != req.body.confirmNewPassword){
            return res.status(400).json({error: 'Password does not match', acknowledged: false})
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        // saving updated password
        req.user.token = '' ;
        req.user.password = hashedPassword ;
        await req.user.save() ;

        res.status(200).json({message: 'new password updated', acknowledged: true});

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
}