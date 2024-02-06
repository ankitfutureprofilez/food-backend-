const routess = require("express").Router();
const validateToken =  require("../middleware/Auth")

const restaurantcontroller = require("../controller/restaurantcontorller");
routess.post("/add",restaurantcontroller.addRestaurant);
module.exports = routess;