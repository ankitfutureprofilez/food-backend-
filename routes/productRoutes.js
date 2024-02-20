const routes = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const {
  addProduct,
newproduct,
  productlist,
} = require("../controller/productsController");

routes.post("/uploadProduct", validateToken, addProduct);

// a to z products lists - done
routes.get("/productlist", productlist);

routes.get("/newproduct", newproduct);






module.exports = routes;
