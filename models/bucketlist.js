const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema


const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const BucketListSchema = new Schema({
    title:String,
    image:String,
    description:String,
    location:{
        name:String,
        lat:Number,
        lng:Number
    },
    likes:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}) 

BucketListSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('BucketList', BucketListSchema)