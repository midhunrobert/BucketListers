const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const BucketList = require('../models/bucketlist');

mongoose.connect('mongodb://127.0.0.1:27017/bucketlist');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await BucketList.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const likes = Math.floor(Math.random() * 20) + 5;
        const image = Math.floor(Math.random() * 1000)
        const bucketlist = new BucketList({
            author: '65865d4111da9c9892d885e4',
            location: {
                name: `${cities[random1000].city}, ${cities[random1000].state}`,
                lat: cities[random1000].latitude,
                lng: cities[random1000].longitude
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price:price,
            likes:likes,
            image: `https://source.unsplash.com/random/${image}`
        })
        await bucketlist.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})