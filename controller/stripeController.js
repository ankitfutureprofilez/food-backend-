const Order = require("../db/Order");
const User = require("../db/User");
const catchAsync = require("../utils/catchAsync");
const Stripe = require("stripe");

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

/***** payment getWay */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
exports.createCheckout = catchAsync(async (req, res) => {
  try {

    const last_order_id = await Order.findOne({}, "order_id").sort({ order_id: -1 });
    const new_order_id = last_order_id ? parseInt(+last_order_id.order_id + 1) : 1;
    const order = new Order({
      order_id: new_order_id,
      user_id:req.user._id,
      order_items:JSON.stringify(req.body.items),
      checkout_coordinates:JSON.stringify(req.body.coordinates),
      phone_no:req.body.phone,
      order_coordinates:JSON.stringify(req.body.order_coordinates),
    });
    await order.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success/${order.order_id}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel/${order.order_id}`,
      submit_type: 'pay',
      customer_email:'naveen@internetbusinesssolutionsindia.com',
      billing_address_collection: "auto",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd", 
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: item.price * 100, 
          },
          quantity:1,
        };
      }),
    });
    res.status(200).json({
      url:session.url,
      status:'true'
    });
  }
  catch (err) {
    res.status(err.statusCode || 500).json(err.message)
  }
});

exports.payment_done = catchAsync(async (req, res) => {
    const order_id = req.params.order_id;
    const order = await Order.findOne({"order_id" : order_id});
    const user=await User.findOne({"_id" : order.user_id});//Getting the user
    // console.log("user",user);
    if(order){
      if(order.order_status == 'initiated'){
        order.payment_status = "ok",
        await order.save();
  
          const orderItems = JSON.parse(order.order_items);
            // Calculate total amount
            let totalAmount = 0;
            orderItems.forEach(item => {
              totalAmount += parseFloat(item.total);
            });

            // Sending user Email
        const mailOptionsUser = {
          from: process.env.USER, // sender address
          to: user.email, // list of receivers
          subject: `Your Order is successful placed`, // Subject line
          // text: `Hello user. Your order is placed`, // plain text body
          html:`
          <html>
          <body style="font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
            <table style="margin:50px auto 10px;background-color:#fff;padding:50px;border-radius:3px;border-top:solid 10px green">
              <thead>
                <tr>
                  <th style="text-align:left;">
                  <a href="https://food-fp.netlify.app/order_history">
                  <img style="max-width: 150px;" src="https://food-fp.netlify.app/logo.png" alt="Food Truck">
                  </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="height:35px;"></td>
                </tr>
                <tr>
                  <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                    <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Order status</span><b style="color:green;font-weight:normal;margin:0">Success</b></p>
                    <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Transaction ID</span> ${order.order_id}</p>
                    <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Order amount</span> Rs. ${totalAmount}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">
                  Thank You for shopping with us. Your Order will be delivered shortly
                  </td>
                </tr>
              </tbody>
              <tfooter>
                <tr>
                  <td colspan="2" style="font-size:14px;padding:28px 15px 0 15px;">
                    <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Food Truck<br> Banipark, Pincode - 302006, Jaipur, Rajasthan, India<br><br>
                  </td>
                </tr>
              </tfooter>
            </table>
          </body>
          </html>
          `,
        };
        await sendMail(transporter, mailOptionsUser, res);

        // Sending Owner Email
        const mailOptionsOwner = {
          from: process.env.USER, // sender address
          to: "a.mathur@futureprofilez.com", // list of receivers
          subject: `Received a new order`, // Subject line
          // text: `Hello owner. You have a new order`, // plain text body
          html:`
          <html>
          <body style="font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
          <table style="margin:50px auto 10px;background-color:#fff;padding:50px;border-radius:3px;border-top:solid 10px green">
            <thead>
              <tr>
                <th style="text-align:left;">
                <a href="https://food-fp.netlify.app/order_history">
                <img style="max-width: 150px;" src="https://food-fp.netlify.app/logo.png" alt="Food Truck">
                </a>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="height:35px;"></td>
              </tr>
              <tr>
                <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                  <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Order status</span><b style="color:green;font-weight:normal;margin:0">Success</b></p>
                  <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Transaction ID</span> ${order.order_id}</p>
                  <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Order amount</span> Rs. ${totalAmount}</p>
                </td>
                </tr>
                <tr>
                  <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">
                  A new order has been received just now. Deliver it ASAP
                  </td>
                </tr>
              </tbody>
              <tfooter>
                <tr>
                  <td colspan="2" style="font-size:14px;padding:28px 15px 0 15px;">
                    <strong style="display:block;margin:0 0 10px 0;">Regards</strong> Food Truck<br> Banipark, Pincode - 302006, Jaipur, Rajasthan, India<br><br>
                  </td>
                </tr>
              </tfooter>
            </table>
          </body>
          </html>
          `,
        };
       await sendMail(transporter, mailOptionsOwner, res);

        res.json({
            msg: "Order has been placed successfully !!",
            status: true,
        });
      } else {
        res.json({
          msg: "Order has been updated already.",
          status: false,
        });
      }
    } else { 
      res.json({
        msg: "Order not found.",
        status: false,
      });
    }
});

exports.payment_cancel = catchAsync(async (req, res) => {
    const order_id = req.params.order_id;
    const order = await Order.findOne({"order_id" : order_id});
    if(order){
      if(order.order_status == 'initiated'){
        order.payment_status = "cancel",
        await order.save();
        res.json({
            msg: "Your payment for this order is failed.",
            status: true,
        });
      } else {
        res.json({
          msg: "Order has been updated already.",
          status: false,
        });
      }
    }
    else {
      res.json({
        msg: "Order not found.",
        status: false,
      });
    }
});

exports.myorders = catchAsync(async (req, res) => {
  try {
      const records = await Order.find({"user_id":req.user._id});    if (records.length > 0) {
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
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

exports.allorders = catchAsync(async (req, res) => {
  try {
      const records = await Order.find();    
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
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

exports.order_detail = catchAsync(async (req, res) => {
  const order_id  =  req.params.order_id 
  try {
      const records = await Order.findOne({"order_id":order_id});
      console.log("records", records)
      if (records) {
          res.json({
              order: records,
              status: true,
          });
      } else {
          res.json({
            msg: "Order not found !!",
            status: true,
          });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


 