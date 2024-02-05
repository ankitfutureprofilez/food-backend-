// middleware.js

const restureatent = require("../Model/restaurant");

const findUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        // console.log("userId", userId);
        const user = await restureatent.findOne({ userId });
        // console.log("user", user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.restaurant = user;
        next();
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = findUserById;
