const routess = require("express").Router();
const userrouter =  require("../middleware/Auth")
const restaurantcontroller = require("../controller/restaurantcontorller");
routess.post("/add", userrouter,restaurantcontroller.addRestaurant);
module.exports = routess;