const Restaurant = require("../db/Restaurant");
const User = require("../db/User");
const catchAsync = require("../utils/catchAsync");

exports.addRestaurant = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).json({
            message: "User information not found in the request or userId is undefined",
            status: false,
        });
    }
    if (req.user.resId) {
        return res.status(400).json({
            message: "You have already registred for restaurant.",
            status: false,
        });
    }
    const user = await User.findOne({userId:req.user.userId});
    console.log("user", user)
    const { opening_from, opening_to, ownername,image, location, restaurantname, description, category,staff, coordinates } = req.body;
    const lastRestaurant = await Restaurant.findOne({}, "id").sort({ id: -1 });
    let newUserId;
    if (lastRestaurant && lastRestaurant.id !== undefined || null) {
        newUserId = parseInt(+lastRestaurant.id + 1);
        user.resId = parseInt(+lastRestaurant.id + 1);
    } else {
        newUserId = 1;
        user.resId = 1;
    } 
    const record = new Restaurant({
        restaurantname: restaurantname,
        ownername: ownername,
        location: location,
        description: description,
        image: image,
        resId: newUserId,
        userId: req.user && req.user._id,
        category: category,
        staff: staff,
        opening_from: opening_from,
        opening_to: opening_to,
        coordinates:coordinates
    });
    const result = await record.save();
    user.role = 1;
    await user.save({validateBeforeSave:false});
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
        const records = await Restaurant.find({}).populate('userId').exec();
        if (records.length > 0) {
            res.json({
                list: records,
                status: true,
            });
        } else {
            res.json({
                list: [],
                status: true,
            });
        }
    } catch (err) {
        console.error(err);
        // Handle error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.getRestaurantData = catchAsync(async (req, res) => {
    const resId  =  req.params.resId 
    const record = await Restaurant.find({resId :resId}).populate('userId').exec();;
    if (record) {
        res.json({
            record: record,
            status: true,
        });
    } else {
        res.json({
            msg: "Record not found !!.",
            status: false,
        });
    }
});

