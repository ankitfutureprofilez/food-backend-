const route = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const { createCheckout, myorders } = require("../controller/stripeController");


route.post("/create-checkout-session", validateToken, createCheckout);
route.get("/myorders", validateToken, myorders);

module.exports = route;