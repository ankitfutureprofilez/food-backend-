const router =  require("express").Router();
const usercontroller = require("../controller/AuthController")

router.post("/signup",usercontroller.signup);

router.post("/login",usercontroller.login);

router.post("/contact", usercontroller.contacts);

module.exports= router;