const Restaurant = require("../db/Restaurant");
const catchAsync = require("../utils/catchAsync");

exports.addRestaurant = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).json({
            message: "User information not found in the request or userId is undefined",
            status: false,
        });
    }
    const { opening_from, opening_to, ownername, image, location, restaurantname, description, category, staff, coordinates } = req.body;
    const record = new Restaurant({
        restaurantname: restaurantname,
        ownername: ownername,
        location: location,
        description: description,
        image: image,
        resId: '1',
        userId: req.user && req.user._id,
        category: category,
        staff: staff,
        opening_from: opening_from,
        opening_to: opening_to,
        coordinates:coordinates
    });
    const result = await record.save();
    if (result) {
        res.status(200).json({
            data: result,
            status: true,
            message: "Restaurant added successfully !!.",
        });
    } else {
        res.status(500).json({
            error: error,
            message: "Failed to add restaurant",
            status: false,
        });
    }
});

exports.getRestaurant = catchAsync(async (req, res) => {
    try {
        const records = await Restaurant.findOne({"resId" : 1}).populate('userId').exec();
        res.json({
            record: records,
            status: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

