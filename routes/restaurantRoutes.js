const route = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const { addRestaurant, getRestaurant, getRestaurantData } = require("../controller/resturantController");

// Add Restaurant 
route.post("/add", validateToken, addRestaurant);

// Lists of all restaurant 
route.get("/get", getRestaurant); 

// Restaurant detail 
route.get("/:resId", getRestaurantData);

module.exports = route;