const mongoose = require("mongoose");
const schema = mongoose.Schema({
    ownername: String,
    restaurantname: String,
    description: String,
    image: String,
    userId: String,
    resId: String,
    location: String,
    category: String,
    staff: String,
    coordinator : String,
    opening_from : String, 
    opening_to : String
});

module.exports = mongoose.model("restaurants", schema);