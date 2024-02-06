const users = require("../Model/User");
var jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");
const { promisify } = require('util');
const SECRET_ACCESS = process && process.env && process.env.SECRET_ACCESS;
const key = process && process.env && process.env.SECRET_ACCESS;
// console.log("SECRET_ACCESS", SECRET_ACCESS)
// console.log("SkeyS", key)


if (!SECRET_ACCESS || !key) {
  console.error('Error: SECRET_ACCESS or JWT_SECRET environment variables are not set.');
  process.exit(1);
}
const signToken = async (id) => {
  const token = jwt.sign({ id }, SECRET_ACCESS, { expiresIn: '58m' });
  return token;
}


exports.validateToken = catchAsync(async (req, res, next) => {

  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    let token = authHeader.split(" ")[1];
    if (!token) {
      next(new AppError("User is not authorized or token is missing", 403));
    }
    const decode = await promisify(jwt.verify)(token, key);
    if (decode) {
      let result = await users.findById(decode.id);
      req.user = result;
      next();
    } else {
      next(new AppError('User is not authorized', 401));
    }
  } else {
    next(new AppError("Token is missing", 401));
  }
});


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
    // console.log("resultjson",result)
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
    // console.log("token", token)
    // console.log("uyser", user)
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
