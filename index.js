const express = require("express");
const app = express();
//152.58.17.147/32
const cors = require("cors");
const mongoose = require("mongoose");
const Stripe = require("stripe");
const dotenv = require("dotenv");
require("./Config");

dotenv.config();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const producturl = require("./routes/productroute");
app.use("/product", producturl);

const userurl = require("./routes/userroute");
app.use("/user", userurl);

const PORT = process.env.REACT_APP_SERVER_DOMIN;

//mongodb connection
// mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then(() => console.log("Connected to Databse"))
//   .catch((err) => console.log(err));

//schema
// const userSchema = mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: String,
//   confirmPassword: String,
//   // image: String,
// });

// const userModel = mongoose.model("user", userSchema);

//api
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// sign up
// app.post("/signup", async (req, res) => {
//   //console.log(req.body);
//   const { email } = req.body;

//   userModel
//     .findOne({ email: email })
//     .then((result) => {
//       if (result) {
//         res.send({ message: "Email id is already registered", alert: false });
//       } else {
//         const data = new userModel(req.body);
//         // console.log("data",data)
//         return data.save();
//       }
//     })
//     .then(() => {
//       res.send({ message: "Successfully signed up", alert: true });
//     })
//     .catch((err) => {
//       //console.log(err);
//       res.send({ message: "Error occurred", alert: false });
//     });
// });

// ///api login
// app.post("/login", async (req, res) => {
//   // console.log("req.body", req.body);
//   const { email } = req.body;
//   await userModel.findOne({ email: email }).then((result) => {
//     if (result) {
//       const dataSend = {
//         _id: result._id,
//         firstName: result.firstName,
//         lastName: result.lastName,
//         email: result.email,
//         // image: result.image,
//       };
//    //   console.log("dataSend", dataSend);
//       res.send({
//         message: "Login is successfully",
//         alert: true,
//         data: dataSend,
//       });
//     } else {
//       res.send({
//         message: "Email is not available, please sign up",
//         alert: false,
//       });
//     }
//   });
// });

//product section

// const schemaProduct = mongoose.Schema({
//   name: String,
//   category: String,
//   // image: String,
//   price: String,
//   description: String,
// });
// const productModel = mongoose.model("product", schemaProduct);

// //save product in data
// //api
// app.post("/uploadProduct", async (req, res) => {
//  // console.log("req.body", req.body);
//   const data = await productModel(req.body);
//   const datasave = await data.save();
// //console.log("datasave", datasave);
//   res.send({ message: "Upload successfully" });
// });

// //
// app.get("/product", async (req, res) => {
//   const data = await productModel.find({});
//   res.send(JSON.stringify(data));
// });

/*****payment getWay */
// console.log(process.env.STRIPE_SECRET_KEY)
// console.log(process.env.FRONTEND_URL)

app.get("/",(req,res)=>{
  res.json("hello weeje")
})
const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY)
// console.log("stripe",stripe)

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  // Create a Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: 'https://food-delivery-websitess.netlify.app/success',
    cancel_url: 'https://food-delivery-websitess.netlify.app/cancel',
  });

  res.json({ sessionId: session.id });
});
// //server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
