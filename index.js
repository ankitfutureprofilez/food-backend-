const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
}; 

const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors(corsOptions));
const dotenv = require("dotenv");
require("./mongoConfig");
dotenv.config();
const morgan = require('morgan')
app.use(morgan('dev')); 
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json({ limit: "10mb" }));

const path = require('path');
// app.use('/uploads', express.static(path.join(__dirname, 'storage')));

app.use('/storage', express.static(path.join(__dirname, 'storage')));

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
});

app.listen(PORT, () => console.log("Server is running at port : " + PORT));
 