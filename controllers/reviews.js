const BucketList = require('../models/bucketlist');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const bucketlist = await BucketList.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    bucketlist.reviews.push(review);
    await review.save();
    await bucketlist.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/bucketlist/${bucketlist._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await BucketList.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/bucketlist/${id}`);
}
