const User = require("../db/User");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const AppError = require("../utils/AppError");
const SECRET_ACCESS = process.env && process.env.SECRET_ACCESS;
const key = process && process.env && process.env.SECRET_ACCESS;

const signToken = async (payload) => {
  const token = jwt.sign(
    payload,
    SECRET_ACCESS,
    { expiresIn: '5h' }
  );
  return token
}

exports.signup = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword,image } = req.body;
  const lastuserId = await User.findOne({}, "userId").sort({ userId: -1 });
  let newUserId;
  if (lastuserId && lastuserId.userId !== undefined) {
      newUserId =  parseInt(lastuserId.userId + 1);
  } else {
      newUserId = 1;
  }
  let isAlready = await User.findOne({ email: email });
  if (isAlready) {
    return res.status(200).json({
      status: false,
      message: "That user already exisits!",
    });
  }
  const record = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    userId: newUserId,
    image: image,
  });
  const result = await record.save();
  if (result) {
    res.json({
      status: true,
      message: "You have been registred successfully !!.",
    });
  } else {
    res.json({
      status: false,
      error: result,
      message: "Failed to create user.",
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and password is required !!", 401))
  }
  const user = await User.findOne({ email: email });
  const isPassword = await User.findOne({ password: password });
  if (!user || !isPassword) {
    res.json({
      status: false,
      message: "Invalid Email or password"
    });
  }
  const token = await signToken({
    id: user && user._id 
  });

  res.json({
    status: true,
    message: "Login Successfully !!",
    user: user,
    token
  });
});

exports.validateToken = catchAsync(async (req, res, next) => {
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    let token = authHeader.split(" ")[1];
    if (!token) {
      next(new AppError("User is not authorized or token is missing", 403));
    }
    const decode = await promisify(jwt.verify)(token, key);
    if (decode) {
      let result = await User.findById(decode.id);
      req.user = result;
      next();
    } else {
      next(new AppError('User is not authorized', 401));
    }
  } else {
    next(res.status(401).json({ status: false, msg: 'Token is missing.' }));
  }
});

exports.user = catchAsync(async (req, res,) => {
  if (req.user) {
    res.json({
      status: true,
      user: req.user
    });
  } else {
    res.json({
      status: false,
      message: "You must be log in first !!.",
    });
  }
});
