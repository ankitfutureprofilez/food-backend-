const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const AppError = require("../utils/AppError");

const SECRET_ACCESS = process.env && process.env.SECRET_ACCESS;
const key = process && process.env && process.env.SECRET_ACCESS;

const signToken = async (id) => {
  const token = jwt.sign(
    { id },
    SECRET_ACCESS,
    { expiresIn: '58m' }
  );
  return token
}

const signup = catchAsync(async (req, res) => {
  const { firstName,lastName, email, password, confirmPassword,image } = req.body;
  let isAlready = await User.findOne({ email: email });
  if (isAlready) {
    return res.status(400).json({
      message: "That user already exisits!",
      status: true,
    });
  }
  const lastuserid = await User.findOne({}, "userId").sort({ userId: -1 });
//  console.log("lastuserid", lastuserid);
  const newUserId = lastuserid ? lastuserid.userId + 1 : 1;
  //  console.log("newwws", newUserId);
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
      user: result,
      message: "Signup Successfully",
    });
  } else {
    res.json({
      status: false,
      error: result,
      message: "Failed to create user.",
    });
  }
});




const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and password is required !!", 401))
  }
  const user = await User.findOne({ email: email });
  const isPassword = await User.findOne({ password: password });
  console.log(user, isPassword)
  if (!user || !isPassword) {
      res.json({
          status: false,
          message: "Invalid login or password"
      });
  }
  const token = await signToken(user);
  res.json({
    status:200,
    message: "Login Successfully !!",
    user: user,
    token
  });
});


const validateToken = catchAsync(async (req, res, next) => {

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
    next(new AppError("Token is missing", 401));
  }
});


// const profile = catchAsync ( async (req, res) => {
//     res.json(req.user);
// });


// const forgotPassword = catchAsync ( async (req, res, next) => {
//   // 1. Check is email valid or not
//   const user = await User.findOne({email:req.body.email});
//   if(!user){
//      return next(new AppError("no user found associated with this email.", 404));
//   } 
//   // 2. Generate randow token string
//   const resetToken = await user.createPasswordResetToken();
//   await user.save({validateBeforeSave:false});
//   // 3. send token to email using nodemailer
//   const resetTokenUrl = `${req.protocol}://${req.get('host')}/user/resetpassword/${resetToken}`
//   const message = `Forgot your password. Click ${resetTokenUrl} the link to reset your password.`
//   console.log("resetTokenUrl", resetTokenUrl);
//   console.log("message", message);
//   try {
//     const send = await SendEmail({
//       email:user.email,
//       subject:"Reset your password.",
//       message
//     });
//     console.log('send', send);
//     res.status(200).json({message:"Password Reset link sent your email address."})
//   } catch (err){
//     user.passwordResetToken = undefined;
//     user.resetTokenExpire = undefined;
//     await user.save({ validateBeforeSave:false });
//     next(new AppError("Failed to send mail. Please try again later.", 500))
//   }
// });



// const resetpassword = catchAsync ( async (req, res, next) => {
//   // 1. get user token
//   const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

//   // 2. Find token user and set new password 
//   const user = await User.findOne({
//     passwordResetToken:hashToken,
//     resetTokenExpire : { $gt: Date.now()}
//   });
//   if(!user){ 
//       next(new AppError("Link expired or invalid token", 500))
//   }
//   user.password = req.body.password;
//   user.confirmPassword = req.body.password;
//   user.passwordResetToken = undefined;
//   user.resetTokenExpire = undefined;
//   await user.save({validateBeforeSave:false});

//   // 3. Update changedPassswordAt Property


//   // 4. login user in send JWT 
//   const token = await signToken(user._id);
//   res.json({
//     message:"Password changed successfully.",
//     token
//   }); 
// });






module.exports = { signup, login, validateToken };