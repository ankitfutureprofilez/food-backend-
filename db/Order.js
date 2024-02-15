const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  order_id: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  order_items:String,
  order_status:{
    type: String,
    default :"initiated" // delivered || placed || initiated
  },
  createdAt: {
    type: Date,
    default: Date.now()     
  },
});

module.exports = mongoose.model("payment_orders", orderSchema);
