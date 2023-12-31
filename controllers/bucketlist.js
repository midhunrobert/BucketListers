const BucketList = require('../models/bucketlist')
const User = require('../models/user')
const opencage = require('opencage-api-client')
const maptoken = process.env.OPENCAGE_API_KEY
const axios = require('axios');


module.exports.index =  async (req,res)=>{
    const bucketlist = await BucketList.find({})
    res.render('bucketlists/index', {bucketlist})
}

module.exports.rernderForm = (req,res) =>{
    res.render('bucketlists/new')
}

module.exports.createBucketList = async (req, res, next) => {
    try {
        // Validate that req.body.bucketlist.location is present
        if (!req.body.bucketlist || !req.body.bucketlist.location) {
            console.log(req.body.bucketlist.location)
            res.status(400).send('Location is required');
            return;
        }

        // Geocode the provided location using OpenStreetMap Nominatim
        const address = encodeURIComponent(req.body.bucketlist.location);
        const nominatimEndpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
        const response = await axios.get(nominatimEndpoint);

        if (response.data && response.data.length > 0) {
            const place = response.data[0];

            // Extract relevant information from the geocoding response
            const { display_name, lat, lon } = place;

            // Create a new bucket list with the provided data
            const bucketListData = {
                ...req.body.bucketlist,
                location: {
                    name: display_name,
                    lat: lat,
                    lng: lon
                }
            };

            const bucketlist = new BucketList(bucketListData);

            // Set the author (assuming req.user._id is available)
            bucketlist.author = req.user._id;

            // Save the bucket list to the database
            await bucketlist.save();

            console.log(bucketlist);
            req.flash('success', 'Successfully made a new BucketList!');
            res.redirect(`/bucketlist/${bucketlist._id}`);
        } else {
            console.log('Geocoding response is empty or invalid');
            res.status(400).send('Invalid location');
        }
    } catch (error) {
        console.error('Error during geocoding:', error.message);
        // Handle other errors as needed
        res.status(500).send('Internal Server Error');
    }
};


module.exports.viewItem = async (req, res,) => {
    const bucketlist = await BucketList.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!bucketlist) {
        req.flash('error', 'Cannot find that bucketlist!');
        return res.redirect('/bucketlist');
    }
    res.render('bucketlists/viewItem', { bucketlist });
}
module.exports.editForm = async (req,res) => {
    const {id} = req.params
    const bucketlist = await BucketList.findById(id)
    res.render('bucketlists/edit', {bucketlist})
}

module.exports.updateBucketList = async (req, res, next) => {
    try {
        // Validate that req.body.bucketlist.location is present
        if (!req.body.bucketlist || !req.body.bucketlist.location) {
            console.log(req.body.bucketlist.location)
            res.status(400).send('Location is required');
            return;
        }

        // Geocode the provided location using OpenStreetMap Nominatim
        const address = encodeURIComponent(req.body.bucketlist.location);
        const nominatimEndpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
        const response = await axios.get(nominatimEndpoint);

        if (response.data && response.data.length > 0) {
            const place = response.data[0];

            // Extract relevant information from the geocoding response
            const { display_name, lat, lon } = place;

            // Create a new bucket list with the provided data
            const bucketListData = {
                ...req.body.bucketlist,
                location: {
                    name: display_name,
                    lat: lat,
                    lng: lon
                }
            };

            const bucketlist = new BucketList(bucketListData);

            // Set the author (assuming req.user._id is available)
            bucketlist.author = req.user._id;

            // Save the bucket list to the database
            await bucketlist.save();

            console.log(bucketlist);
            req.flash('success', 'Successfully made a updated BucketList!');
            res.redirect(`/bucketlist/${bucketlist._id}`);
        } else {
            console.log('Geocoding response is empty or invalid');
            res.status(400).send('Invalid location');
        }
    } catch (error) {
        console.error('Error during geocoding:', error.message);
        // Handle other errors as needed
        res.status(500).send('Internal Server Error');
    }
};
module.exports.cities = async (req,res) =>{
    const location = await BucketList.distinct('location.name')
    res.render('bucketlists/cities', {locations:location})
}

module.exports.sortCity = async (req,res) =>{
    const location = req.params .location
    const bucketlist = await BucketList.find({'location.name' :location}).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!bucketlist) {
        req.flash('error', 'Cannot find that bucketlist!');
        return res.redirect('/bucketlist');
    }
    res.render('bucketlists/index', {bucketlist})
}

module.exports.deleteBucketList = async (req, res) => {
    const { id } = req.params;
    await BucketList.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted bucketlist')
    res.redirect('/bucketlist');
}
