const mongoose = require("mongoose");

const restaurantschema = mongoose.Schema({
    ownername: String,
    restaurantname: String,
    description: String,
    image: String,
    userId: Number,
    resId: Number,
    location: String,
    category: String,
    staff: String,
    timing: String,
    coordinator : String
    });

module.exports = mongoose.model("restaurant", restaurantschema);