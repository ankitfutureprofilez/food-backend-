const Order = require("../db/Order");
const catchAsync = require("../utils/catchAsync");
const Stripe = require("stripe");

// Email logic
const nodemailer = require("nodemailer");
const Password = require("../db/Password");
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
    const mailOptions = {
      from: process.env.USER, // sender address
      to: user.email, // list of receivers
      subject: "Order Placed", // Subject line
      // text: `Hello ${user.firstName}. Please click on this link to change pasword- ${link}`, // plain text body
  
      html: `
      <html lang="en-US">
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
      <a href="https://food-fp.netlify.app/" title="logo" target="_blank">
      <img width="60" src="https://food-fp.netlify.app/logo.png" title="logo" alt="logo" />
    </a>
      </div>
      <p style="font-size:1.1em">Hi user,</p>
      <p>Your Order is placed</p>
    </div>
  </div>
      </html>
      `,
    };
    if(order){
      if(order.order_status == 'initiated'){
        order.payment_status = "ok",
        await order.save();
        const sendMailResponse= await sendMail(transporter, mailOptions, res);//Email sent
        res.json({
            msg: "Order has been placed successfully and email also sent!!",
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


 