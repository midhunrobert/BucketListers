const User = require('../models/user')
const BucketList = require('../models/bucketlist')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('user/register')
}

module.exports.register = async (req,res)=>{
    try {
        const {username, email, password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', "Welcome to BucketListers") 
            res.redirect('bucketlist')
        })
    }catch(e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('user/login')
}

module.exports.login = (req,res) =>{
    req.flash('success', 'Welcome Back')
    const redirectUrl = req.session.returnTo || '/bucketlist'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.addToBucketList = async (req, res) => {
    const bucketlist = await BucketList.findById(req.params.id);
    bucketlist.likes += 1
    const user = req.user
    for (let bucketlistId of user.bucketlist) {
        if (bucketlistId.equals(bucketlist._id)) {
            req.flash('danger', 'Already added to your BucketList');
            res.redirect(`/bucketlist/${bucketlist._id}`);
            return; // Exit the function to prevent further execution
        }
    }
    
    user.bucketlist.push(bucketlist);
    await user.save();
    await bucketlist.save()
    req.flash('success', 'Added To Your BucektList');
    res.redirect('/myBucket')
    // res.redirect(`/bucketlist/${bucketlist._id}`);
}
module.exports.userBucketList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).populate('bucketlist');

        if (!user || !user.bucketlist || user.bucketlist.length === 0) {
            req.flash('error', 'No BucketLists');
            return res.redirect('/bucketlist');
        }

        res.render('user/userBucketList', { bucketlist: user.bucketlist });
    } catch (error) {
        // Handle errors appropriately, e.g., send an error response
        console.error(error);
        req.flash('error', 'Error retrieving BucketLists');
        res.redirect('/'); // Redirect to an error page or home page
    }
};

module.exports.deleteBucketList = async (req, res) => {
    try {
        const userId = req.user;
        const bucketlistIdToRemove = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { bucketlist: bucketlistIdToRemove } },
            { new: true }
        );

        if (!updatedUser) {
            req.flash('error', 'User not found');
            return res.redirect('/myBucket');
        }

        req.flash('success', 'Removed from your BucketList');
        res.redirect('/myBucket');
    } catch (error) {
        // Handle errors appropriately, e.g., send an error response
        console.error(error);
        req.flash('error', 'Error removing from BucketList');
        res.redirect('/myBucket');
    }
};



module.exports.logout = (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/bucketlist');
      });
    req.flash('success', 'See You Late!')
    res.redirect('/bucketlist')
}