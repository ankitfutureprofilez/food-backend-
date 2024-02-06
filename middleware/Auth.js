var jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");

require('dotenv').config();

const key = process && process.env && process.env.JWT_SECRET;


const validateToken = catchAsync(async (req, res, next) => {
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

module.exports =  validateToken ;
