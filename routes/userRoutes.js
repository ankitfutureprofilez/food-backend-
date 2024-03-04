const router =  require("express").Router();

const {user, signup, login, forgotPassword, resetPassword } = require("../controller/AuthController")
const { validateToken } = require("../controller/AuthController")
const { contacts, search } = require("../controller/userController")
const upload = require("../middleware/uploadFile");

router.get("", validateToken, user);

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgotPassword", forgotPassword);

router.post("/resetpassword", resetPassword);

router.post("/contact", contacts);

router.post("/search", search);

module.exports= router;