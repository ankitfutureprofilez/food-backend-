const router =  require("express").Router();
const usercontroller = require("../controller/AuthController")
const { validateToken } = require("../controller/AuthController")

router.get("", validateToken, usercontroller.user);

router.post("/signup",usercontroller.signup);

router.post("/login",usercontroller.login);

router.post("/contact", usercontroller.contacts);

module.exports= router;