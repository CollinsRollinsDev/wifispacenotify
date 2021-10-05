const express = require("express");
let router = express.Router();
const Customer = require("../models/Customer");


router.get("/", async (req, res) => {
    const allCustomers = await Customer.find({});
    res.status(200).json({
        data: allCustomers
    })

})

module.exports = router;