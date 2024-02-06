const mongoose = require("mongoose");

const restaurantschema = mongoose.Schema({
    O_name: String,
    r_name: String,
    description: String,
    image: String,
    userId: Number,
    resId: Number,
    location: String,
    category: String,
    staff: String,
    timing: String,
    codinator: String
    });

module.exports = mongoose.model("restaurant", restaurantschema);