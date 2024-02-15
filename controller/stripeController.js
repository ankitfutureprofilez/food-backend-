const Order = require("../db/Order");
const catchAsync = require("../utils/catchAsync");
const Stripe = require("stripe");

 /***** payment getWay */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

 
exports.createCheckout = catchAsync(async (req, res) => {
  try {
    // saved_order.order_id
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      submit_type: 'pay',
      customer_email:'naveen@internetbusinesssolutionsindia.com',
      billing_address_collection: "auto",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd", 
            product_data: {
              name: item.name,
              images: [item.permalink],
            },
            unit_amount: item.price * 100, 
          },
          quantity:1,
        };
      }),
    });

    if(session){ 
      // Create website order
      const last_order_id = await Order.findOne({}, "order_id").sort({ order_id: -1 });
      const new_order_id = last_order_id ? last_order_id.order_id + 1 : 1;
      const order = new Order({
        order_id: new_order_id,
        user_id:req.user._id,
        order_items:JSON.stringify(req.body.items),
      });
      await order.save();
      res.status(200).json({
        url:session.url,
        status:'true'
      });
    } else { 
      res.status(200).json({
        msg:'payment failed.',
        status:'false'
      })
    }
  }
  catch (err) {
    res.status(err.statusCode || 500).json(err.message)
  }
});

exports.myorders = catchAsync(async (req, res) => {
  try {
      const records = await Order.find({"user_id":req.user._id});
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


 