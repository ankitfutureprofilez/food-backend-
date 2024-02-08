const express = require("express");
const app = express();
const cors = require("cors");
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
app.use("/stripe", require("./routes/stripeRoutes"));

const PORT = process.env.REACT_APP_SERVER_DOMIN;

app.get("/", (req, res) => {
  res.json({
    msg:'Okay',
    status:200
  })
})



// //server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
 