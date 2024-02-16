const product = require("../db/Product");
const Restaurant = require("../db/Restaurant");
const catchAsync = require("../utils/catchAsync");

exports.addProduct = catchAsync(async (req, res) => {
  const userId = req?.user?.userId;
  const { name, price, category, description ,image} = req.body;
  if (!userId) {
    return res.status(400).json({
      message: "User information not found in the request or userId is undefined",
      status: false,
    });
  }
  try {
    const record = new product({
      name,
      price,
      category,
      description,
      image,
      userId,
    });
    const result = await record.save();
    res.status(200).json({
      data: result,
      message: "Product added successfully",
      status: true,
    });
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to add product",
      status: false,
    });

  }
});


exports.productlist = catchAsync (
  async (req, res) => {
    const record = await product.find({}).populate('userId').exec();
    console.log("record" ,record)
    res.json({
      data: record,
      status: 200,
    });
  }
)
 

