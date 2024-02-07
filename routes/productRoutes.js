const routes = require("express").Router();
 const {validateToken} = require("../controller/AuthController");

const productcontroller = require("../controller/productsController");

routes.post("/",validateToken, productcontroller.addProduct);

routes.get('/productlist', productcontroller.productlist);

routes.get('/get', validateToken,productcontroller.userproductlist);



module.exports = routes;