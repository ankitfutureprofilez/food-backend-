const routes = require("express").Router();
const { validateToken } = require("../controller/AuthController");
const {
  addProduct,

  productlist,
} = require("../controller/productsController");

routes.post("/uploadProduct", validateToken, addProduct);

// a to z products lists - done
routes.get("/productlist", productlist);


// resturent detail api - done 
routes.get("/restaurent/:res_id",  restaurantProducts);

// only my added products - 
routes.get("/my-products/:userId", validateToken, userproductlist);



module.exports = routes;
