const restaurant = require("../Model/restaurant");

exports.addRestaurant = async (req, res) => {
  console.log("Request Body:", req.body);

  try {
    const userId = req.user[0].userId;
    console.log("UserId", userId);

    const { O_name, location, r_name, description, image } = req.body;

    const lastRestaurant = await restaurant.findOne({}, "resId").sort({ resId: -1 });
    
    let newUserId;
    
    if (lastRestaurant && lastRestaurant.resId !== undefined) {
      newUserId = lastRestaurant.resId + 1;
    } else {
      newUserId = 1;
    }

    console.log("New UserId:", newUserId);

    const isAlready = await restaurant.findOne({ r_name: r_name });

    if (isAlready) {
      return res.status(400).json({
        msg: "Restaurant with that name already exists!",
        status: false,
      });
    }

    const record = new restaurant({
      O_name: O_name,
      r_name: r_name,
      location: location,
      description: description,
      image: image,
      resId: newUserId,
      userId: userId,
    });

    const result = await record.save();

    console.log("Result:", result);

    res.status(200).json({
      data: result,
      status: true,
      msg: "Restaurant added successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: error,
      msg: "Failed to add restaurant",
      status: false,
    });
  }
};
