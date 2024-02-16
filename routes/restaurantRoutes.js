const route = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const { addRestaurant, getRestaurant, updateCordinates } = require("../controller/resturantController");

route.post("/add", validateToken,  addRestaurant);

route.get("/get", getRestaurant); 

route.post("/update-status/:order_id/:type", updateCordinates); 

module.exports = route;