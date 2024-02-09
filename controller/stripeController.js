const Order = require("../db/Order");
const catchAsync = require("../utils/catchAsync");
const Stripe = require("stripe");

 /***** payment getWay */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
 
exports.createCheckout = catchAsync(async (req, res) => {
  try {
    //  const session = await stripe.checkout.sessions.create({
    //     payment_method_types: ['card'],
    //     mode: "payment",
    //     success_url: `${process.env.FRONTEND_URL}/success`,
    //     cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    //     submit_type: 'pay',
    //     customer_email:'naveen@internetbusinesssolutionsindia.com',
    //     billing_address_collection: "auto",
    //     line_items: req.body.items.map((item) => {
    //       return {
    //         price_data: {
    //           currency: "usd", 
    //           product_data: {
    //             name: item.name,
    //             images: [item.image],
    //           },
    //           unit_amount: item.price * 100, 
    //         },
    //         quantity:1,
    //       };
    //     }),
    // });
    // Create website order
    const last_order_id = await Order.findOne({}, "order_id").sort({ order_id: -1 });
    const new_order_id = last_order_id ? last_order_id.order_id + 1 : 1;
    const order = new Order({
      order_id: new_order_id,
      userId:req.user.userId,
      order_items:req.body.items,
    });

    const saved_order= await order.save();
    res.status(200).json({
        msg:'Order has been placed successfully.',
        order:saved_order,
        status:'true'
      })
    // if(session){ 
    //   res.status(200).json({
    //     msg:'Order has been placed successfully.',
    //     order:order,
    //     status:'true'
    //   })
    // } else { 
    //   res.status(200).json({
    //     msg:'payment failed.',
    //     status:'false'
    //   })
    // }
  }
  catch (err) {
    res.status(err.statusCode || 500).json(err.message)
  }
})

 