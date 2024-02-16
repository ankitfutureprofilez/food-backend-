const route = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const { addRestaurant, getRestaurant } = require("../controller/resturantController");

// Add Restaurant 
route.post("/add", validateToken,  addRestaurant);

// Lists of all restaurant 
route.get("/get", getRestaurant); 

module.exports = route;