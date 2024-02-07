const router =  require("express").Router();
const usercontroller = require("../controller/AuthController")
const contactcontroller = require("../controller/AuthController")


router.post("/signup",usercontroller.signup);

router.post("/login",usercontroller.login);

router.post("/contact", contactcontroller.contacts);


module.exports= router;