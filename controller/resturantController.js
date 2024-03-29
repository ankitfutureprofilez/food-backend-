const Restaurant = require("../db/Restaurant");
const User = require("../db/User");
const Order = require("../db/Order");
const catchAsync = require("../utils/catchAsync");

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

exports.addRestaurant = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({
      message:
        "User information not found in the request or userId is undefined",
      status: false,
    });
  }
  if (req.user.resId == null) {
    return res.status(400).json({
      message:
        "You can not process this action. Only owner can update restaurent details. ",
      status: false,
    });
  }

  const {
    opening_from,
    opening_to,
    ownername,
    image,
    location,
    restaurantname,
    description,
    category,
    staff,
    coordinates,
  } = req.body;
  const isRestaurent = await Restaurant.findOne({ resId: "1" });
  if (isRestaurent) {
    isRestaurent.restaurantname = restaurantname;
    isRestaurent.ownername = ownername;
    isRestaurent.location = location;
    isRestaurent.coordinates = coordinates;
    isRestaurent.description = description;
    isRestaurent.image = image;
    isRestaurent.resId = "1";
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
      resId: "1",
      userId: req.user && req.user._id,
      category: category,
      staff: staff,
      opening_from: opening_from,
      opening_to: opening_to,
      coordinates: coordinates,
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
    const records = await Restaurant.findOne({ resId: 1 })
      .populate("userId")
      .exec();
    res.json({
      record: records,
      status: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.updateCordinates = catchAsync(async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const type = req.params.type;
    const order = await Order.findOne({ order_id: order_id });

    console.log("req.body.coordinates", req.body.coordinates);
    if (type == "accepted") {
      (order.order_status = "accepted"), await order.save();
      res.json({
        msg: "Order has been accepted !!",
        status: true,
      });
    }
    if (type == "picked") {
      (order.order_status = "picked"),
        (order.order_coordinates = JSON.stringify(req.body.coordinates)),
        await order.save();
      res.json({
        msg: "Order picked status has been updated !! ",
        status: true,
      });
    }

    if (type == "delivered") {
      const user = await User.findOne({ _id: order.user_id }); //Getting the user info
      (order.order_status = "delivered"),
        (order.deliveredAt = Date.now()),
        await order.save();
      const mailOptions = {
        from: process.env.USER, // sender address
        to: user.email, // list of receivers
        subject: `Order ${order.order_id} is delivered`, // Subject line
        text: `Hello user. Your order is delivered`, // plain text body
        html: `
                <html>
                <div align="left"> 
<img style="width: 40%; height: 10%;" src="https://food-fp.netlify.app/logo.png"><br>
<br> 
</div> 
<font face="arial"><font face="arial"> 
<br> 
Dear ${user.firstName},</font></font> 
<br> 
<font face="arial"><font face="arial"> 
<br> 
We wanted to let you know that your order${order.order_id} was delivered, according to our tracking information<br>  
<br> 
<b>Tracking Link:</b>&nbsp;<a href="http://localhost:3000/order_history">Click here</a><br> 
<br> 
</font></font><font face="arial"><font face="arial"> 
<br><b> 
Thank you for your order. If there’s anything we can do to improve your experience, please let us know!</b><br> 
<br> 
</b></font></font><b>Food Truck</b><br> 
<div> </div><b>Phone: <a href="tel:+01-888-843-9990" rel="nofollow">1234567890</a> </b> </div>
<div> <b>Email: <a href="mailto:support@incycle.com">support@foodtruck.com</a> </b> </div>
<div> </div><b>Website:</b> <a href="https://www.incycle.com">https://food-fp.netlify.app/</a> </b> </div>
                </html>
                `,
      };
      const sendMailResponse = await sendMail(transporter, mailOptions, res);
      res.json({
        msg: "Order picked status has been updated !! ",
        status: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
