const route = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const { createCheckout, myorders, order_detail } = require("../controller/stripeController");

route.post("/create-checkout-session", validateToken, createCheckout);
route.get("/myorders", validateToken, myorders);
route.get("/order/:order_id", order_detail);

module.exports = route;