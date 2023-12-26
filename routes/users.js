const express = require('express')
const router = express.Router()
const { isLoggedIn, isAuthor } = require('../middleware');
const passport = require('passport')
const users = require('../controllers/user')


router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.register)

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), users.login)

router.route('/:id/addToBucketList')
    .post(isLoggedIn,users.addToBucketList)

router.route('/myBucket')
    .get(isLoggedIn, users.userBucketList)

router.route('/deleteBucketList/:id')
    .post(isLoggedIn,isAuthor,users.deleteBucketList)

router.get('/logout', users.logout)
    



module.exports = router