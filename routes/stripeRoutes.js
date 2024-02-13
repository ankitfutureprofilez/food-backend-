const route = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const { createCheckout } = require("../controller/stripeController");


route.post("/create-checkout-session", validateToken, createCheckout);

module.exports = route;