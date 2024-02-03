const contact = require("../Model/contact")

exports.contacts = async (req, res) => {
    console.log("req.body", req.body)
    try {
        const { email,     message
            , name } = req.body;
        const record = new contact({
            name: name,
            email: email,
            message: message
        })
        const result = await record.save();
        console.log("result", result);
        res.json({
            data: record,
            msg: "contact",
            status: 200
        })

    } catch (error) {
        console.log(error);
        res.json({
            error: error,
            msg: "Nort contact"

        })
    }
}