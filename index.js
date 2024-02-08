const express = require("express");
const app = express();
const cors = require("cors");
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

app.get("/", (req, res) => {
  res.json({
    msg:'Okay',
    status:200
  })
})


/*****payment getWay */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
app.post("/create-checkout-session", async (req, res) => {
  try {
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
                images: [item.image],
              },
              unit_amount: item.price * 100, 
            },
            quantity:1,
          };
        }),
    })
    if(session){ 
      res.status(200).json({
        msg:'success',
        url:session.url,
        status:'true'
      })
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
  
})
// //server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
 