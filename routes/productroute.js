const routes = require("express").Router();
 const {validateToken} = require("../controller/usercontroller")
const productcontroller = require("../controller/productcontroller")
const contactcontroller = require("../controller/contactcontroller")

routes.post("/uploadproduct",productcontroller.productadd);

routes.get('/productlist', productcontroller.productlist);

routes.post("/contact", contactcontroller.contacts)

module.exports = routes;