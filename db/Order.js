const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  id: String,
  userId:String,
  order_items:String,
  order_status:{
    type: String,
    default :"placed" // delivered || placed
  },
  createdAt: {
    type: Date,
    default: Date.now()     
  },
});

module.exports = mongoose.model("payment_orders", orderSchema);
