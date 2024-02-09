const mongoose = require("mongoose");
const schema = mongoose.Schema({
    ownername: String,
    restaurantname: String,
    description: String,
    image: {
        type:String,
    },
    userId: String,
    resId: String,
    location: String,
    category: String,
    staff: String,
    coordinates : String,
    opening_from : String, 
    opening_to : String
});

schema.virtual('banner_image').get(function() {
    const APP_URL = process.env.APP_URL || 'http://localhost:8000';
    return `${APP_URL}/storage/${this.image}`;
});

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true }); 

module.exports = mongoose.model("restaurants", schema);