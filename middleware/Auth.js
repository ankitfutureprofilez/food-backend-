const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // Import the promisify function
const catchAsync = require("../utils/catchAsync");
const users = require("../Model/User"); 

require('dotenv').config();
const SECRET_ACCESS = process.env && process.env.SECRET_ACCESS;

const validateToken = catchAsync(async (req, res, next) => {
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        let token = authHeader.split(" ")[1];
        if (!token) {
            next(new AppError("User is not authorized or token is missing", 403));
        }
        const decode = await promisify(jwt.verify)(token, SECRET_ACCESS);
        if (decode) {
            let result = await users.findById(users.id);
            req.user = result;
            next();
        } else {
            next(new AppError('User is not authorized', 401));
        }
    } else {
        next(new AppError("Token is missing", 401));
    }
});

module.exports = validateToken;
