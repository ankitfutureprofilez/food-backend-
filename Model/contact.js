const mongoose = require("mongoose")

const contactschema = mongoose.Schema({
    email: String,
    name: String,
    message: String
})

module.exports = mongoose.model("contact", contactschema)