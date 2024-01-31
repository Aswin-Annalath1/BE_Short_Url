const {shortUrl,allshortUrl,redir_to_origUrl} = require("../controller/shortURLCtrll")

const  router = require('express').Router()

// create a Short URL
router.post("/create",shortUrl)
// get all short URL
router.post("/all",allshortUrl)
// Redirect to original URL
router.get("/:shorturl",redir_to_origUrl)



module.exports = router