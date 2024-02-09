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
    
    const user = await User.findOne(req.user._id);
    const { opening_from, opening_to, ownername, location, restaurantname, description, image, category,staff, coordinates } = req.body;
    const lastRestaurant = await Restaurant.findOne({}, "resId").sort({ resId: -1 });
    let newUserId;
    if (lastRestaurant && lastRestaurant.resId !== undefined) {
        newUserId = lastRestaurant.resId + 1;
    } else {
        newUserId = 1;
    }
    const record = new Restaurant({
        restaurantname: restaurantname,
        ownername: ownername,
        location: location,
        description: description,
        image: image,
        resId: newUserId,
        userId: userId,
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
    const record = await Restaurant.find({});
    if (record) {
        res.json({
            list: record,
            status: true,
        });
    } else {
        res.json({
            list: [],
            status: true,
        });
    }
});


exports.getRestaurantData = catchAsync(async (req, res) => {
    const resId  =  req.params.resId 
    console.log("resId",resId)
    const record = await Restaurant.find({resId :resId});
    console.log("record",record)
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
})

