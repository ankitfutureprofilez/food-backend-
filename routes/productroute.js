const routes = require("express").Router();
const usermiddelroute = require("../middleware/Auth")

const productcontroller = require("../controller/productcontroller")
const contactcontroller = require("../controller/contactcontroller")

routes.post("/uploadproduct", usermiddelroute, productcontroller.productadd);

routes.get('/productlist', usermiddelroute, productcontroller.productlist);

routes.post("/contact", contactcontroller.contacts)

module.exports = routes;