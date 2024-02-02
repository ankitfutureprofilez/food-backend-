const product = require("../Model/products");

exports.productadd = async (req, res) => {
  try {
    const { name, price, category, description,image } = req.body;
    const record = new product({
      name: name,
      price: price,
      category: category,
      description: description,
       image: image,
      // role: role,
    });
    const result = await record.save();
    res.json({
      data: result,
      msg: "Add product succesfully",
      status: 200,
    });
  } catch (error) {
    res.json({
      error: error,
      msg: "not add product",
      status: 500,
    });
  }
};

exports.productlist = async (req, res) => {
  try {
    const record = await product.find({});
    // console.log("record", record);
    res.json({
      data: record,
      msg: "product list",
      status: 200,
    });
  } catch (error) {
    res.json({
      error: error,
      msg: "not list product",
      status: 500,
    });
  }
};


