const routes = require("express").Router();
const productcontroller = require("../controller/productcontroller")


routes.post("/uploadproduct", productcontroller.productadd);

routes.get('/productlist' ,productcontroller.productlist)

module.exports = routes;