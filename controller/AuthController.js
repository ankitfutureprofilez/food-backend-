const User = require("../db/User");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const AppError = require("../utils/AppError");
const SECRET_ACCESS = process.env && process.env.SECRET_ACCESS;
const key = process && process.env && process.env.SECRET_ACCESS;

// Email template
function PasswordResetEmail() {
  return `
    <html lang="en-US">
      <head>
        <meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
        <meta name="description" content="Reset Password Email Template." />
        <style>
          
        </style>
      </head>
      <body style={{ margin: '0px', backgroundColor: '#f2f3f8' }}>
        {/* 100% body table */}
        <table
          cellSpacing="0"
          border="0"
          cellPadding="0"
          width="100%"
          bgcolor="#f2f3f8"
          style={{
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          <tr>
            <td>
              <table
                style={{
                  backgroundColor: '#f2f3f8',
                  maxWidth: '670px',
                  margin: '0 auto',
                }}
                width="100%"
                border="0"
                align="center"
                cellPadding="0"
                cellSpacing="0"
              >
                <tr>
                  <td style={{ height: '80px' }}>&nbsp;</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <a href="https://rakeshmandal.com" title="logo" target="_blank">
                      <img width="60" src="https://food-fp.netlify.app/logo.png" title="logo" alt="logo" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ height: '20px' }}>&nbsp;</td>
                </tr>
                <tr>
                  <td>
                    <table
                      width="95%"
                      border="0"
                      align="center"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        maxWidth: '670px',
                        backgroundColor: '#fff',
                        borderRadius: '3px',
                        textAlign: 'center',
                        boxShadow: '0 6px 18px 0 rgba(0,0,0,.06)',
                      }}
                    >
                      <tr>
                        <td style={{ height: '40px' }}>&nbsp;</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0 35px' }}>
                          <h1 style={{ color: '#1e1e2d', fontWeight: 500, margin: '0', fontSize: '32px', fontFamily: 'Rubik, sans-serif' }}>
                            You have requested to reset your password
                          </h1>
                          <span
                            style={{
                              display: 'inline-block',
                              verticalAlign: 'middle',
                              margin: '29px 0 26px',
                              borderBottom: '1px solid #cecece',
                              width: '100px',
                            }}
                          />
                          <p style={{ color: '#455056', fontSize: '15px', lineHeight: '24px', margin: '0' }}>
                            We cannot simply send you your old password. A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.
                          </p>
                          <a
                            href="javascript:void(0);"
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
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: '40px' }}>&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ height: '20px' }}>&nbsp;</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: 'rgba(69, 80, 86, 0.7411764705882353)', lineHeight: '18px', margin: '0 0 0' }}>
                      &copy; <strong>www.rakeshmandal.com</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style={{ height: '80px' }}>&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        {/* /100% body table */}
      </body>
    </html>
    `
}



// Email logic
const nodemailer = require("nodemailer");
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
    rejectUnauthorized: false
  }
});

const sendMail = async(transporter, mailOptions)=>{
  try{
    const test = await transporter.sendMail(mailOptions);
    if(test.messageId){
       res.json({
        status: true,
        message: "Mail sent !!",
      });
    } else {
      res.json({
        status: false,
        error: test,
      });
    }
  } catch(error){
    console.log("mail error ", error);
  }
}





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
  if (!email || !password) {
    return next(new AppError("Email and password is required !!", 401));
  }
  const user = await User.findOne({ email: email });
  const isPassword = await User.findOne({ password: password });
  if (!user || !isPassword) {
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

  const token = jwt.sign({ userId: user._id }, "your_secret_key", {
    expiresIn: "1h",
  });

  const link = `${process.env.APP_URL}/passwordReset?token=${token}&id=${user._id}`;
  const htmlContent = PasswordResetEmail;
  const mailOptions = {
    from: process.env.USER, // sender address
    to: user.email, // list of receivers
    subject: "Password Reset Request", // Subject line
    // text: `Hello ${user.firstName}. Please click on this link to change pasword- ${link}`, // plain text body
    html: htmlContent, // HTML body
  }
  // Send email
  try {
   await sendMail(transporter, mailOptions);
   res.json({
    status: true,
    message: "Mail sent !!",
  });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    res.status(500).json({ message: "Failed to send password reset email. Please try again later." });
  }
});

