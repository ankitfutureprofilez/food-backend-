const routes = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const {
  addProduct,
  productlist,
  userproductlist,
  restaurantProducts
} = require("../controller/productsController");

const upload = require("../middleware/uploadFile");

routes.post("/uploadProduct", validateToken, upload.single("file"), addProduct);

// a to z products lists - done
routes.get("/productlist", productlist);

// only my added products - 
routes.get("/my-products/:userId", validateToken, userproductlist);

// resturent detail api - done 
routes.get("/restaurent/:res_id",  restaurantProducts);

module.exports = routes;
