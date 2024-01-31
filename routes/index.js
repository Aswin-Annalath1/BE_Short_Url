//Here we are gathering all routes togather...

const userRouter = require('./userroutes.js')
const forgotRouter = require('./forgotpassroutes.js')
const resetRouter = require('./resetpassroutes.js')
const shortURLRouter = require('./shortURLroutes.js')

const  router = require('express').Router()

router.use('/signup' , userRouter);
router.use('/login', userRouter);
router.use('/forgot', forgotRouter);
router.use('/reset', resetRouter);
router.use('/shorturl', shortURLRouter);
router.use('/s', shortURLRouter)

module.exports = router

