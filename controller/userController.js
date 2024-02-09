const contact = require("../db/Contact");
const  Restaurant = require('../db/Restaurant');
const Product = require("../db/Product");

exports.contacts = async (req, res) => {
    try {
        const { email, message, name } = req.body;
        const record = new contact({
            name: name,
            email: email,
            message: message
        })
        const result = await record.save();
        res.json({
            data: result,
            message: "contact",
            status: 200
        });
    } catch (error) {
        console.log("error",error);
        res.json({
            error: error,
            message: "some went wrong !!"
        })
    }
}

exports.search = async (req, res) => {
  try {
        const query = req.body.search;
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, 
                { description: { $regex: query, $options: 'i' } } 
            ]
        });
        const restaurants = await Restaurant.find({
            $or: [
              { restaurantname: { $regex: query, $options: 'i' } }, 
            ]
        });
        res.json({
            products: products,
            restaurants: restaurants,
            message: "Result fetched successfully !!",
            status: 200
        });
  } catch (error) {
      console.log("error",error);
      res.status(500).json({  
          error: error.message,
          message: "Something went wrong !!"
      });
  }
}