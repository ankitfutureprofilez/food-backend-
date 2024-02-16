const routes = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const {
  addProduct,

  productlist,
} = require("../controller/productsController");

routes.post("/uploadProduct", validateToken, addProduct);

// a to z products lists - done
routes.get("/productlist", productlist);





module.exports = routes;
