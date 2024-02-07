const route = require("express").Router();
const {validateToken} = require("../controller/userController");
const restaurantcontroller = require("../controller/resturantController");

route.post("/add", validateToken,restaurantcontroller.addRestaurant);

route.get("/get",restaurantcontroller.getRestaurant);



module.exports = route;