const routes = require("express").Router();
 const {validateToken} = require("../controller/userController");
const productcontroller = require("../controller/productController")

routes.post("/",validateToken, productcontroller.addProduct);

routes.get('/productlist', productcontroller.productlist);



module.exports = routes;