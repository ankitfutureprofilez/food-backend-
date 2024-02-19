const Restaurant = require("../db/Restaurant");
const Order = require("../db/Order");
const catchAsync = require("../utils/catchAsync");

exports.addRestaurant = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).json({
            message: "User information not found in the request or userId is undefined",
            status: false,
        });
    }
    if (req.user.resId == null) {
        return res.status(400).json({
            message: "You can not process this action. Only owner can update restaurent details. ",
            status: false,
        });
    }

    const { opening_from, opening_to, ownername, image, location, restaurantname, description, category, staff, coordinates } = req.body;
    const isRestaurent = await Restaurant.findOne({"resId":'1'});
    if(isRestaurent){
        isRestaurent.restaurantname = restaurantname;
        isRestaurent.ownername = ownername;
        isRestaurent.location = location;
        isRestaurent.coordinates = coordinates;
        isRestaurent.description = description;
        isRestaurent.image = image;
        isRestaurent.resId = '1';
        isRestaurent.userId = req.user && req.user._id;
        isRestaurent.category = category;
        isRestaurent.staff = staff;
        isRestaurent.opening_from = opening_from;
        isRestaurent.opening_to = opening_to;
        await isRestaurent.save();
        res.status(200).json({
            data: isRestaurent,
            status: true,
            message: "Restaurant details updated successfully !!",
        });
    } else {
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

exports.updateCordinates = catchAsync(async (req, res) => {
    console.log(req,req.body)
    try {
        const order_id = req.params.order_id;
        const type = req.params.type;
        const order = await Order.findOne({"order_id" : order_id});
        console.log("req", req.body);

        

        if(type == 'accepted'){
            order. order_status = "accepted",
            await order.save();
            res.json({
                msg: "Order has been accepted !!",
                status: true,
            });
        }  

        if(type == 'picked'){
            order.order_coordinates = JSON.stringify(req.body.coordinates),
            console.log("req.body.coordinates",req.body.coordinates)
            await order.save();
            res.json({
                msg: "Order picked status has been updated !! ",
                status: true,
            });
        } 

        if(type == 'delivered'){
            order.deliveredAt = Date.now(),
            await order.save();
            res.json({
                msg: "Order picked status has been updatedssss !! ",
                status: true,
            });
        } 
       
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
   