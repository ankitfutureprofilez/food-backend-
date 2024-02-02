const Products= require("express").Router();
const verifyUserToken = require('../middleware/Auth');
const productcontroller = require("../controller/Productcontroller")


Products.post("/product/add",verifyUserToken,productcontroller.productadd);
Products.get('/product/show',verifyUserToken,productcontroller.productshow);
Products.put('/product/update/:id',productcontroller.prouctupdate)
Products.delete('/product/delete/:id',productcontroller.productdelete)


module.exports=Products;