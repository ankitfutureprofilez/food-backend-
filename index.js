const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
require("./Config");
dotenv.config();

const morgan = require('morgan')
app.use(morgan('dev')); 

app.use(cors({credentials:true}));
app.use(express.json({ limit: "10mb" }));

app.use("/product", require("./routes/productRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/restaurant", require("./routes/restaurantRoutes"));
app.use("/stripe", require("./routes/stripeRoutes"));

const PORT = process.env.REACT_APP_SERVER_DOMIN;

app.get("/", (req, res) => {
  res.json({
    msg:'Okay',
    status:200
  })
})


app.listen(PORT, () => console.log("Server is running at port : " + PORT));
 