const mongoose = require("mongoose");
const schema = mongoose.Schema({
    ownername: {
        required:[true, 'Please enter owner name.'],
        type:String,
        minLength:3,
    },
    restaurantname: {
        required:[true, 'Please enter restaurant name.'],
        type:String,
        minLength:3,
    },
    description: String,
    image: {type:String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    resId: String,
    location: {
        required:[true, 'Please enter restaurant location.'],
        type:String,
        minLength:3,
    },
    userId: String,
    resId: String,
    location: {
        required:[true, 'Please enter restaurant location.'],
        type:String,
        minLength:3,
    },
    category: String,
    staff: {
        required:[true, 'Staff can not be empty.'],
        type:String,
        minLength:1,
    },
    coordinates : String,
    opening_from: {
        required:[true, 'Closing timing can not be empty.'],
        type:String,
        minLength:1,
    },
    opening_to: {
        required:[true, 'Opening timing can not be empty.'],
        type:String,
        minLength:1,
    },
});

// schema.virtual('banner_image').get(function() {
//     const APP_URL = process.env.APP_URL || 'https://food-backend-three.vercel.app/';
//     return `${APP_URL}/uploads/${this.image}`;
// });

// schema.set('toObject', { virtuals: true });
// schema.set('toJSON', { virtuals: true }); 

module.exports = mongoose.model("restaurants", schema);