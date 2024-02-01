const router =  require("express").Router();
const usercontroller = require("../controller/usercontroller")


router.post("/signup",usercontroller.usersignup);

router.post("/login",usercontroller.Login);


module.exports= router;