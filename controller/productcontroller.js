const product = require("../Model/Product");
const catchAsync = require("../utils/catchAsync");


exports.addProduct = catchAsync(
  async (req, res) => {
    const userId = req?.user?.userId;
    const { name, price, category, description, image } = req.body;
    if (!userId) {
      return res.status(400).json({
        msg: "User information not found in the request or userId is undefined",
        status: false,
      });
    }
    const record = new product({
      name: name,
      price: price,
      category: category,
      description: description,
      image: image,
      userId: userId,
    });
    const result = await record.save();
    if (result) {
      res.status(200).json({
        data: result,
        msg: "Product added successfully",
        status: true,
      });
    } else {
      res.status(500).json({
        error: error,
        msg: "Failed to add product",
        status: false,
      });
    }
  }
)

exports.productlist = catchAsync (
  async (req, res) => {
    const record = await product.find({});
    res.json({
      data: record,
      msg: "product list",
      status: 200,
    });
  }
)


