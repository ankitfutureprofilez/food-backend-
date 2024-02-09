const express = require("express");
const app = express();
var bodyParser =  require("body-parser")
const cors = require("cors");
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};
app.use(cors(corsOptions));

const dotenv = require("dotenv");
require("./mongoConfig");
dotenv.config();

const morgan = require('morgan')
app.use(morgan('dev')); 

app.use(cors({
  origin: "*", 
  credentials: true, 
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "mode"] // Allow additional headers, including "mode"
}));


app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


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
 