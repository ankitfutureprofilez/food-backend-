const restaurant = require("../Model/Restaurant");
const catchAsync = require("../utils/catchAsync");

exports.addRestaurant = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { ownername, location, restaurantname, description, image, category,
        staff,
        timing, coordinator } = req.body;
    if (!userId) {
        return res.status(400).json({
            message: "User information not found in the request or userId is undefined",
            status: false,
        });
    }
    const lastRestaurant = await restaurant.findOne({}, "resId").sort({ resId: -1 });
    let newUserId;
    if (lastRestaurant && lastRestaurant.resId !== undefined) {
        newUserId = lastRestaurant.resId + 1;
    } else {
        newUserId = 1;
    }
    const record = new restaurant({
        restaurantname: restaurantname,
        ownername: ownername,
        location: location,
        description: description,
        image: image,
        resId: newUserId,
        userId: userId,
        category: category,
        staff: staff,
        timing: timing,
        coordinator: coordinator
    });
    const result = await record.save();
    if (result) {
        res.status(200).json({
            data: result,
            status: true,
            message: "Restaurant added successfully",
        });
    } else {
        res.status(500).json({
            error: error,
            message: "Failed to add restaurant",
            status: false,
        });
    }
}
)


exports.getRestaurant = catchAsync(async (req, res) => {
    const record = await restaurant.find({});
    if (record) {
        res.json({
            data: record,
            status: true,
            message: "Restaurant list"
        })
    }
})