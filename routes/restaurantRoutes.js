const route = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const { addRestaurant, getRestaurant, getRestaurantData } = require("../controller/resturantController");
const upload = require("../middleware/uploadFile");

// Add Restaurant 
route.post("/add", validateToken, upload.single("file"), addRestaurant);

// Lists of all restaurant 
route.get("/get", getRestaurant); 

// Restaurant detail 
route.get("/:resId" , getRestaurantData);

module.exports = route;