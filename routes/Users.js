const router = require("express").Router()

const Users = require("../Model/user");

const userController = require("../controller/usercontroller");

router.post("/signup",userController.signup);
router.post("/login",userController.Login);
router.get('/list',userController.userList);

module.exports = router;