const product = require("../Model/Product");
exports.productadd = async (req, res) => {
  try {
    const userId = req.user[0].userId;
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
    res.status(200).json({
      data: result,
      msg: "Product added successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: error,
      msg: "Failed to add product",
      status: false,
    });
  }
};



exports.productlist = async (req, res) => {
  const restaurant = req.user.userId;
  const record = await product.find({ restaurant: restaurant });
  console.log("record", record);
  res.json({
    data: record,
    msg: "product list",
    status: 200,
  });
};


