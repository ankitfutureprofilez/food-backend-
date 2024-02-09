const routes = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const {
  addProduct,
  productlist,
  userproductlist,
} = require("../controller/productsController");
const upload = require("../middleware/uploadFile");

routes.post("/uploadProduct", validateToken, upload.single("file"), addProduct);

routes.get("/productlist", productlist);

routes.get("/my-products", validateToken, userproductlist);

module.exports = routes;
