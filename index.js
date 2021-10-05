const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
require('dotenv').config();

const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const signup = require("./routes/signup");
const Customer = require("./models/Customer");
app.use("/signup", signup);


const Port = 3000;
let timer;
let play;
let date = new Date().getTime();


const authenticate = process.env.AuthPass
const uri = process.env.MONGODB_CONNECTION_URI;

// Connecting MongoDb Atlas to Application
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const notifyDatabaseKickoff = async() => {
  const transorter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "wifispacenetworks@gmail.com",
      pass: authenticate
    }
  })

    const mailOption = {
      from: 'Support Center',
      to: `collinsrollins07@gmail.com, wifispacenetworks@gmail.com`,
      subject: 'Wifispace Bot Notification Kickoff',
      text: `Hello, we are notifyinmg you that the backend server is now started. We shall run the daily scan in the next 12 hours from now. Thank you.`
    }

    transorter.sendMail(mailOption, async(error, info) => {
      if(error){
        console.log(error)
      } else{
        console.log(`Emaiil sent: ${info.response}`)
        
      }
    })

}

const connection = mongoose.connection;
try {
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully.");
    notifyDatabaseKickoff();
  });
} catch (error) {
  console.log("Something went wrong with database connection");
}


const runSchedule = async(assignDate = "empty") => {

  
  const allCustomers = await Customer.find({});
  const returning = allCustomers.filter(customer => {
    let dbDate = new Date(`${customer.accounts[0].dueDate} 00:00:00`);
    console.log(dbDate)
    let overallDate = dbDate - date;
  
    let staticDays = Math.floor(
      overallDate / (1000 * 60 * 60 * 24)
    );

    if((staticDays < 0) == true){
        return customer.emailAddress;
    } else{
      null;
    }    
  })

  const selectEmails = returning.map(data => {

    const transorter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "wifispacenetworks@gmail.com",
        pass: authenticate
      }
    })
  
      const mailOption = {
        from: 'Support Center',
        to: `${data.emailAddress}`,
        subject: 'WifiSpace Service Notification',
        text: `Hello, ${data.firstName}, We appreciate your continued patronage. Please note that your subcription is dued on ${data.accounts[0].dueDate}. Please do well to subscribe soon or your account will be deactivated.`
      }
  
      transorter.sendMail(mailOption, async(error, info) => {
        if(error){
          console.log(error)
        } else{
          console.log(`Emaiil sent: ${info.response} to ${data.emailAddress}`)
          
        }
      })
  

    return data.emailAddress
  })

  console.log(selectEmails);

  const transorter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "wifispacenetworks@gmail.com",
      pass: authenticate
    }
  })

  if(selectEmails.lenght != 0){
    const mailOption = {
      from: 'Support Center',
      to: `collinsrollins07@gmail.com, wifispacenetworks@gmail.com`,
      subject: 'Daily Dued Notification For Wifispace Users.',
      text: `Hi Team, we have just sent notification across to the following user(s) ${selectEmails}. If any of them is not suppose to recieve these email, please Click "https://smarttechs.com.ng" to marked them as paid.`
    }

    transorter.sendMail(mailOption, async(error, info) => {
      if(error){
        console.log(error)
      } else{
        console.log(`Emaiil sent: ${info.response} to ${selectEmails}`)
      }
    })

  } else{
    const mailOption = {
      from: 'Support Center',
      to: `collinsrollins07@gmail.com, wifispacenetworks@gmail.com`,
      subject: 'Daily Dued Notification For Wifispace Users.',
      text: `Hi Team, we have scenned the database for dued customers for today and we've found none. We shall run next scan tommorow...`
    }

    transorter.sendMail(mailOption, async(error, info) => {
      if(error){
        console.log(error)
      } else{
        console.log(`Emaiil sent: ${info.response} to ${selectEmails}`)
        
      }
    })
  }


}

setInterval(() => {
  runSchedule()
},720000 );

app.get("/", async(req, res) => {

  // res.json({
  //   success: true,
  //   message: "All fine and good",
  // })
})


app.listen(process.env.PORT 
  || Port, () => {
  console.log(`Server is started on Port: ${Port}`)
})