const router =  require("express").Router();

const {user, signup, login} = require("../controller/AuthController")
const { validateToken } = require("../controller/AuthController")
const { contacts, search } = require("../controller/userController")
const upload = require("../middleware/uploadFile");

router.get("", validateToken, user);

router.post("/signup",upload.single("image") , signup);

router.post("/login", login);

router.post("/contact", contacts);

router.post("/search", search);



module.exports= router;