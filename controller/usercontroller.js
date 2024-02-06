const users = require("../Model/User");
var jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");

const SECRET_ACCESS = process.env && process.env.SECRET_ACCESS;

const signToken = async (id) => {
  const token = jwt.sign({ id }, SECRET_ACCESS, { expiresIn: '58m' });
  return token
}

exports.usersignup = async (req, res) => {
  // console.log("req.body", req.body);
  try {
    const { firstName, lastName, email, password, confirmPassword, image } =
      req.body;
    const lastuserid = await users.findOne({}, "userId").sort({ userId: -1 });
    // console.log("lastuserid", lastuserid);
    const newUserId = lastuserid ? lastuserid.userId + 1 : 1;
    // console.log("newwws", newUserId);
    let isAlready = await users.findOne({ firstName: firstName });
    if (isAlready) {
      return res.status(400).json({
        msg: "That user already exisits!",
        status: true,
      });
    }
    const record = new users({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      userId: newUserId,
      image: image,
    });
    const result = await record.save();
    res.json({
      data: result,
      status: 200,
      msg: "user add",
    });
  } catch (error) {
    res.json({
      error: error,
      msg: "user not add",
      status: 500,
    });
  }
};

exports.Login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await users.find({ email: email });
    const isPassword = await users.find({ password: password });
    // console.log("user", user, "isPassword", isPassword);
    if (!user || !isPassword) {
      res.json({
        status: false,
        msg: "Invalid login or password",
      });
    }
    const token = await signToken(user._id);
    res.json({
      status: 200,
      user: user,
      msg: "Login successfully !!",
      token: token

    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
      msg: "Not Login",
      status: false,
    });
  }
};
