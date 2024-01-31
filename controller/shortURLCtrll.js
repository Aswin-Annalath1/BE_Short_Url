const { verifyToken } = require('../auth/auth.js')
const User = require('../models/user.js')
const ShortURL  = require('../models/shortURL.js')

// create a Short URL
module.exports.shortUrl = async(req,res) => {
    try{
        // get user by session token
        const validUser = await User.findOne({sessionToken: req.body.sessionToken});
        if(!validUser) return res.status(404).json({error: 'user not found', acknowledged: false});
        if(validUser.account === 'inactive') return res.status(404).json({error: 'account not verified', acknowledged: false, inactive: true});

        // verifing token
        const verifiedToken = verifyToken(validUser.sessionToken);
        if(!verifiedToken) res.status(400).json({error: 'Session expired login again', acknowledged: false})

        // creating new URL Short link
        const newURL = await new ShortURL({ fullURL:req.body.fullURL, user:validUser._id }).save();
        if(!newURL) return res.status(400).json({
            message: 'Error while updating data' ,
            acknowledged: false
        });
        res.status(201).json({message: 'Short URL created', acknowledged: true, newURL});

    }catch(err){
        res.status(500).json({
            message: 'Internal server error',
            acknowledged: false,
            error: err.message
        });
    }
}

// get all short URL
module.exports.allshortUrl = async(req,res) => {
    try{
        // get user by session token
        const validUser = await User.findOne({sessionToken: req.body.sessionToken});
        if(!validUser) return res.status(404).json({error: 'user not found', acknowledged: false});

        if(validUser.account === 'inactive') return res.status(404).json({error: 'account not verified', acknowledged: false, inactive: true});

        const allShortUrl = await ShortURL.find({user: validUser._id});

        res.status(201).json({data: allShortUrl , acknowledged: true});

    }catch(err){
        res.status(500).json({
            message: 'Internal server error',
            acknowledged: false,
            error: err
        });
    }
}

// Redirect to original URL
module.exports.redir_to_origUrl = async(req,res) => {
    try{
        // get data using ShortURL
        const URL = await ShortURL.findOne({shortURL: req.params.shorturl});
        if(!URL) return res.status(404).json({
            message: 'URL does not exist' ,
            acknowledged: false
        });
        // Update the count
        URL.count++;
        await URL.save();
        
        res.redirect(URL.fullURL);

    }catch(err){
        res.status(500).json({
            message: 'Internal server error',
            acknowledged: false,
            error: err.message
        });
    }
}