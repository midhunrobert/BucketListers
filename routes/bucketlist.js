const express = require('express')
const router = express.Router()
const bucketlists = require('../controllers/bucketlist')
const { isLoggedIn, isAuthor } = require('../middleware');


router.route('/')
    .get(bucketlists.index)

router.route('/new')
    .get(isLoggedIn,bucketlists.rernderForm)
    .post(isLoggedIn,bucketlists.createBucketList)

router.route('/:id')
    .get(bucketlists.viewItem)    
    .delete(isAuthor,bucketlists.deleteBucketList)

router.route('/:id/edit')
    .get(isLoggedIn,isAuthor,bucketlists.editForm)
    .put(isLoggedIn,isAuthor,bucketlists.updateBucketList)


module.exports = router