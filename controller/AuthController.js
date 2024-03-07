const User = require("../db/User");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const AppError = require("../utils/AppError");
const SECRET_ACCESS = process.env && process.env.SECRET_ACCESS;
const key = process && process.env && process.env.SECRET_ACCESS;



// Email logic
const nodemailer = require("nodemailer");
const Password = require("../db/Password");
const transporter = nodemailer.createTransport({
  service: "gmail",
  // host: "smtp.forwardemail.net",
  port: 25,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async (transporter, mailOptions, res) => {
  try {
    const test = await transporter.sendMail(mailOptions);
    if (test.messageId) {
       return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("mail error ", error);
    return false;
  }
};

const signToken = async (payload) => {
  const token = jwt.sign(payload, SECRET_ACCESS, { expiresIn: "5h" });
  return token;
};

exports.signup = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, image } =
    req.body;
  const lastuserId = await User.findOne({}, "userId").sort({ userId: -1 });
  let newUserId;
  if (lastuserId && lastuserId.userId !== undefined) {
    newUserId = parseInt(lastuserId.userId + 1);
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
  // console.log("email",email)
  if (!email || !password) {
    return next(new AppError("Email and password is required !!", 401));
  }
  const user = await User.findOne({email:email , password: password });
  // console.log("user",user)
  // console.log("userPassword",user.password)
  // const isPassword = await User.findOne({ password: password });
  // console.log("user",user)
  // console.log("user email",user.email)
  if (!user ) {
    res.json({
      status: false,
      message: "Invalid Email or password",
    });
  }
  const token = await signToken({
    id: user && user._id,
  });

  res.json({
    status: true,
    message: "Login Successfully !!",
    user: user,
    token,
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
      next(new AppError("User is not authorized", 401));
    }
  } else {
    next(res.status(401).json({ status: false, msg: "Token is missing." }));
  }
});

exports.user = catchAsync(async (req, res) => {
  if (req.user) {
    res.json({
      status: true,
      user: req.user,
    });
  } else {
    res.json({
      status: false,
      message: "You must be log in first !!.",
    });
  }
});

// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  console.log("req",req);
  
  if (!email) {
    return res.status(401).json("Email is required !!");
  }
  
  const user = await User.findOne({ email: email });
  
  if (!user) {
    return res.json({
      status: false,
      message: "Invalid Email",
    });
  }
  let code = Math.floor(100000 + Math.random() * 900000);
  // const htmlContent = PasswordResetEmail;
 let link=`http://localhost:3000/resetpassword/${code}`;
  const mailOptions = {
    from: process.env.USER, // sender address
    to: user.email, // list of receivers
    subject: "Password Reset Request", // Subject line
    // text: `Hello ${user.firstName}. Please click on this link to change pasword- ${link}`, // plain text body

    html: `
    <html lang="en-US">
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:8px;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
    <a href="https://food-fp.netlify.app/" title="logo" target="_blank">
    <img width="60" src="https://food-fp.netlify.app/logo.png" title="logo" alt="logo" />
  </a>
    </div>
    <p style="font-size: 1.2rem">Hi ${user.firstName},</p>
    <p style="font-size: 1.2rem">Click on the link and enter the OTP available below to change password</p>
    <p>
    <a
                            href=${link}
                            style={{
                              background: '#20e277',
                              textDecoration: 'none',
                              fontWeight: '500',
                              marginTop: '35px',
                              color: '#fff',
                              textTransform: 'uppercase',
                              fontSize: '14px',
                              padding: '10px 24px',
                              display: 'inline-block',
                              borderRadius: '50px',
                            }}
                          >
                            Reset Password
                          </a>
    </p>
    <h2 style="background: #00466a;margin: 28px 0;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
    <p style="font-size:0.9em;">Regards,<br />Food Truck</p>
    <hr style="border:none;border-top:1px solid #eee" />
  </div>
</div>
    </html>
    `,
  };
  // Send email
  try {
   const sendMailResponse= await sendMail(transporter, mailOptions, res);
   if(sendMailResponse===false){throw error;} 
   const record = new Password({
      email: user.email,
      otp: code,
    });
    await record.save();
    res.json({
      status: true,
      message: "Mail sent !!",
      token:code,
    });
  } catch (error) {
    // console.error("Failed to send password reset email:", error);
    res.json({
        status:false,
        message: "Failed to send password reset email. Please try again later.",
      });
  }
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return next(new AppError("Email, OTP and password are required !!", 401));
  }
  const mail = await Password.findOne({ email: email });
  const code = await Password.findOne({ otp: otp });
  if (mail.id != code.id) {
    res.json({
      status: false,
      message: "Invalid Email or OTP",
    });
  }
  const result = await User.findOneAndUpdate(
    { email: email }, // Filter
    { $set: { password: password } }, // Update
    { new: true } // Options: return the updated document
  );
  if (result) {
    await Password.findOneAndDelete({ email: email });
    res.json({
      status: true,
      message: "Password Updated Successfully!!",
      user: result,
    });
  } else {
    res.json({
      status: false,
      message: "Password not updated. Server Error",
    });
  }
});
