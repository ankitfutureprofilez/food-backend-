const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Stripe = require("stripe");
const dotenv = require("dotenv");
require("./Config");
dotenv.config();
// app.use(cors());
app.use(cors({credentials:true}));
app.use(express.json({ limit: "10mb" }));

const producturl = require("./routes/productRoutes");
app.use("/product", producturl);

const userurl = require("./routes/userRoutes");
app.use("/user", userurl);

const returaneturl = require("./routes/restaurantRoutes");

app.use("/restaurant", returaneturl);

const PORT = process.env.REACT_APP_SERVER_DOMIN;

/*****payment getWay */


app.get("/", (req, res) => {
  res.json("hello weeje")
})
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
//  console.log("stripe",stripe)
app.post("/create-checkout-session", async (req, res) => {
  console.log("req", req)
  try {
    const params = {
      submit_type: 'pay',
      mode: "payment",
      payment_method_types: ['card'],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1NtBj1SDZC0xqkr7pgrkK0QI" }],

      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              images: [item.image]
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty
        }
      }),

      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,

    }
    // console.log("params",params)

    const session = await stripe.checkout.sessions.create(params)
    // console.log("session",session)
    res.status(200).json(session.id)
  }
  catch (err) {
    res.status(err.statusCode || 500).json(err.message)
  }

})
// //server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
