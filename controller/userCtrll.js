const User = require('../models/user.js')
const bcrypt = require("bcrypt");
const { genearateActiveToken, genearateSessionToken, genearateToken } = require("../auth/auth.js")
const { sendActivationMail }  = require("../utils/activationMail.js")

//Function logic to login
module.exports.login = async(req,res) => {
    try{
        // user exist
        const user = await User.findOne({ email: req.body.email })
        if(!user) return res.status(404).json({error: 'user not found'});

        //validating password
        const validPassword = await bcrypt.compare( req.body.password, user.password );

        if(!validPassword) return res.status(404).json({error: 'Incorrect password'});
        if(user.account === 'inactive') return res.status(404).json({error: 'verification not completed, verify your account to login' , active:true});

        // generate session token
        const sesToken = genearateSessionToken(user._id);
        if(!sesToken) res.status(404).json({error: 'user not found'});

        user.sessionToken = sesToken ;
        await user.save();

        res.status(200).json({data: 'logged in successfully' , sessionToken: sesToken})

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
}

//To send activation email Logic internally
async function activationMail(email){
    const actToken = genearateActiveToken(email);

    const activeMail = await sendActivationMail(email, actToken);

    if(!activeMail)  return {
        acknowledged: false
    };

    return {
        acknowledged: true,
        actToken
    };
}

//Function logic to singup
module.exports.signup = async (req, res) => {
    try {
        // Check if user already exists
        const checkUser = await User.findOne({ email : req.body.email });
        if (checkUser) return res.status(400).json({ error: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Log a message to indicate that the password hashing is successful
        console.log('Password hashed successfully');

        // Save new user
        const user = {
            ...req.body,
            password: hashedPassword,
        };

        // Send activation mail
        const actMailSent = await activationMail(user.email);

        // Log whether activation mail is sent successfully
        console.log('Activation mail sent:', actMailSent);

        if (!actMailSent.acknowledged) {
            return res.status(400).json({
                error: 'Error sending confirmation mail. Please check the mail address',
                acknowledged: false,
            });
        }

        // Save the new user after confirmation email
        const savedUser = await new User(user).save();
        savedUser.activationToken = actMailSent.actToken;
        await savedUser.save();

        // Log a success message
        console.log('User successfully registered');

        res.status(201).json({
            message: 'Successfully Registered',
            id: savedUser._id,
            email: 'Confirmation email is sent to your email address',
        });

    } catch (err) {
        // Log the error details for debugging
        console.error('Error during user registration:', err);

        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
};


//Resend Activation email by session token
module.exports.reActi_by_Sesstok = async(req,res) => {
    try{
        // check user
        const checkUser = await User.findOne({sessionToken: req.body.sessionToken})
        if(!checkUser) return res.status(400).json({error: 'user not found', acknowledged: false});

        // Send activation mail
        const actMailSent = await activationMail(checkUser.email);
        if(!actMailSent.acknowledged) return res.status(400).json({error: 'error sending confirmation mail Please check the mail address', acknowledged: false});

        checkUser.activationToken = actMailSent.actToken ;
        await checkUser.save();

        res.status(201).json({message: 'verification email is send to your email Address' , acknowledged: true});

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
}

// Resend Activation email by email
module.exports.reActi_by_email = async(req,res) => {
    try{
        // check user
        const checkUser = await User.findOne({ email: req.body.email });
        console.log(checkUser);
        if(!checkUser) return res.status(400).json({error: 'user not found', acknowledged: false});

        // Send activation mail
        const actMailSent = await activationMail(checkUser.email);
        if(!actMailSent.acknowledged) return res.status(400).json({error: 'error sending confirmation mail Please check the mail address', acknowledged: false});

        checkUser.activationToken = actMailSent.actToken ;
        await checkUser.save();

        res.status(201).json({message: 'verification email is send to your email Address' , acknowledged: true});

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
}

//Function logic to activate account
module.exports.activateAcc = async(req,res) => {
    try{
        // user exist
        const user = await User.findOne({activationToken: req.params.token});
        console.log(user);
        if(!user) return res.status(404).json({error: 'user not found'});
        if(user.account === 'active') return res.status(400).send('Your account is activated already');

        // change account status to active
        user.account = 'active' ;
        user.activationToken = '' ;
        await user.save();

        res.status(201).send('Your account has been activated');

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
}