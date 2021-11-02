const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Please provide a first name"],
      },
      lastName: {
        type: String,
        required: [true, "Please provide a last name"],
      },
      phoneNumber: {
        type: String,
        required: [true, "Please provide a phone number"],
        unique: [true, "Sorry, this mobile number already exist."],
      },
      emailAddress: {
        type: String,
        required: [true, "Please provide an email address."],
        unique: [true, "Sorry, this email address already existed."],
      },
      accounts: [
       {
        status: {
          type: String,
        },
        macAddress: {
          type: String,
          required: [true, "Please provide a macAddress"],
          unique: [true, "Sorry, this mac address is invalid."]
        },
        accountName: {
          type: String,
          required: [true, "Please provide an account name."],
        },
        accountPackage: {
          type: String,
          required: [true, "Please provide an account Package."],
        },
        hotspotAddress: {
          type: String,
          // required: [true, "Please provide an email address."],
        },
        lastUsedIp: {
          type: String,
          // required: [true, "Please provide an email address."],
        },
        dueDate: {
          type: String,
          default: 'Oct 4, 2021',
          required: [true, "Please provide due data."],
        }
       }
      ],
      
})


const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;