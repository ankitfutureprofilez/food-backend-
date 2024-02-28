const route = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const { payment_done, payment_cancel, createCheckout, myorders, allorders,  order_detail } = require("../controller/stripeController");

route.post("/create-checkout-session", validateToken, createCheckout);
route.get("/myorders", validateToken, myorders);
route.get("/allorder", validateToken, allorders);
route.get("/order/:order_id", order_detail);
route.get("/order-success/:order_id", payment_done);
route.get("/order-cancel/:order_id", payment_cancel);

module.exports = route;