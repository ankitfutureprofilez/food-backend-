const mongoose = require("mongoose")
const restaturanet = mongoose.Schema({
    O_name: String,
    r_name: String,
    description: String,
    image: String,
    userId: Number,
    resId: Number,
    location: String,
    category:String,
    staff:String,
    timing:String,
    coordinates:String,
})

module.exports = mongoose.model("restaurant", restaturanet);