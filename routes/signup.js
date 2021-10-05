const express = require("express");
let router = express.Router();
const Customer = require("../models/Customer");

router.post("/", async (req, res) => {

    const {lastUsedIp, macAddress, accountName, accountPackage, hotspotAddress, dueDate} = req.body;

  console.log(req.body)
    // check if the user already exist.......
    const customer = await Customer.findOne({
      phoneNumber: req.body.phoneNumber,
    });
  
    const userEmailAddress = await Customer.findOne({
      emailAddress: req.body.emailAddress,
    });
  
    if (userEmailAddress) {
      console.log("user exist");
      return res.status(400).json({
        success: false,
        message: `Sorry, a user with this credentials already exist`,
      });
    } else{
        try {
          let nested = {
            lastUsedIp: lastUsedIp
          }
            
            let customer = await Customer.create(req.body);
            const user = await Customer.updateOne({_id: customer._id}, {$push : {accounts:req.body}})
            // customer.accounts[0].lastUsedIp = await lastUsedIp
            // customer.accounts[0].dueDate = await dueDate
            // customer.accounts[0].macAddress = await macAddress
            // customer.accounts[0].hotspotAddress = await hotspotAddress
            // customer.accounts[0].accountName = await accountName
            // customer.accounts[0].accountPackage = await accountPackage
            // console.log(customer)
            // console.log(user)
            // customer.remove()
            return res.status(400).json({
                success: true,
                message: `User successfully created!!`,
              });
        } catch (error) {
            console.log(error)
        }
    }

})

module.exports = router;