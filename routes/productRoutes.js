const routes = require("express").Router();
 const {validateToken} = require("../controller/AuthController");

const { addProduct, productlist, userproductlist} = require("../controller/productsController");

routes.post("/",validateToken, addProduct);

routes.get('/productlist', productlist);

routes.get('/my-products', validateToken, userproductlist);

module.exports = routes;