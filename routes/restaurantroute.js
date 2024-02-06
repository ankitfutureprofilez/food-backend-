const resturantoroute = require("express").Router();

const userrouter =  require("../middleware/Auth")

const {validateToken} = require("../controller/usercontroller")

const restaurantcontroller = require("../controller/restaurantcontorller");

resturantoroute.post("/add", userrouter,restaurantcontroller.addRestaurant);
module.exports = resturantoroute;