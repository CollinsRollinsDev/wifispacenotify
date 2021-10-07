const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
require('dotenv').config();
const cors = require('cors');
app.use(cors());

const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const signup = require("./routes/signup");
const getUsers = require("./routes/getUsers");
const Customer = require("./models/Customer");
app.use("/signup", signup);
app.use("/getUsers", getUsers);


const Port = 3000;
let date = new Date().getTime();


const authenticate = process.env.AuthPass
const uri = process.env.MONGODB_CONNECTION_URI;

// Connecting MongoDb Atlas to Application
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const notifyDatabaseKickoff = async() => {
  const smtpTransport = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
      user:process.env.SMTP_USER,
      pass: process.env.SMTP_SECRET
    }
  })

    const sendingMail = smtpTransport.sendMail({
      from: 'wifispacenetworks@gmail.com',
      to: "collinsrollins07@gmail.com, wifispacenetworks@gmail.com",
      subject: 'Wifispace Bot Notification Kickoff',
      // text: `Hello, we are notifying you that the backend server is now started. We shall run the daily scan in the next 12 hours from now. Thank you.`,
      html:` <body><h2>Hello Team,</h2><p>we are notifying you that the backend server is now started. We shall run the daily scan in the next 12 hours from now. Thank you. You can click <a href="http://wifispacenotifier.herokuapp.com">here</a> to visit the endpoint</p>  <center><div><img src="https://smarttechs.com.ng/WSLogo.jpg?auto=format&fit=max&w=300 style="height:50px;width:50px;"" alt="WIfispace"></div></center></body>`
    })

  if(sendingMail){
    console.log(sendingMail);
    // res.status(200).json({

    // })
  }

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

    const smtpTransport = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      auth: {
        user:process.env.SMTP_USER,
        pass: process.env.SMTP_SECRET
      }
    })
  
      // const mailOption = {
      //   from: 'Support Center',
      //   to: `${data.emailAddress}`,
      //   subject: 'WifiSpace Service Notification',
      //   text: `Hello, ${data.firstName}, We appreciate your continued patronage. Please note that your subcription is dued on ${data.accounts[0].dueDate}. Please do well to subscribe soon or your account will be deactivated.`
      // }
  

      const sendingMail = smtpTransport.sendMail({
        from: 'wifispacenetworks@gmail.com',
        to: `${data.emailAddress}`,
        subject: 'WifiSpace Service Notification',
        // text: `Hello, we are notifying you that the backend server is now started. We shall run the daily scan in the next 12 hours from now. Thank you.`,
        html:` <body><h2>Hello, ${data.firstName},</h2><p>We appreciate your continued patronage. Please note that your subcription is dued on ${data.accounts[0].dueDate}. Do well to subscribe soon or your account will be deactivated. .You can click <a href="http://wifispacenotifier.herokuapp.com">here</a> to chat with an agent via whatsapp.</p> <center><div><img src="https://smarttechs.com.ng/WSLogo.jpg?auto=format&fit=max&w=1920" alt="WIfispace"></div></center></body>`
      })
  

    return data.emailAddress
  })

  console.log(selectEmails);
  const smtpTransport = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
      user:process.env.SMTP_USER,
      pass: process.env.SMTP_SECRET
    }
  })


  if(selectEmails.lenght != 0){
    // const mailOption = {
    //   from: 'Support Center',
    //   to: `collinsrollins07@gmail.com, wifispacenetworks@gmail.com`,
    //   subject: 'Daily Dued Notification For Wifispace Users.',
    //   text: `Hi Team, we have just sent notification across to the following user(s) ${selectEmails}. If any of them is not suppose to recieve these email, please Click "https://smarttechs.com.ng" to marked them as paid.`
    // }

   
      const sendingMail = smtpTransport.sendMail({
        from: 'wifispacenetworks@gmail.com',
        to: "collinsrollins07@gmail.com, wifispacenetworks@gmail.com",
        subject: 'Daily Dued Notification Report(s)',
        // text: `Hello, we are notifying you that the backend server is now started. We shall run the daily scan in the next 12 hours from now. Thank you.`,
        html:` <body><h2>Hi Team,</h2><p> we have just sent notification across to the following user(s) ${selectEmails}.If any of them is not suppose to recieve these email, please Click <a href="http://wifispacenotifier.herokuapp.com">here</a> to marked them as paid. </p> <center><div><img src="https://smarttechs.com.ng/WSLogo.jpg?auto=format&fit=max&w=1920" alt="WIfispace"></div></center></body>`
      })
  


  } else{
    // const mailOption = {
    //   from: 'Support Center',
    //   to: `collinsrollins07@gmail.com, wifispacenetworks@gmail.com`,
    //   subject: 'Daily Dued Notification For Wifispace Users.',
    //   text: `Hi Team, we have scenned the database for dued customers for today and we've found none. We shall run next scan tommorow...`
    // }

    const sendingMail = smtpTransport.sendMail({
      from: 'wifispacenetworks@gmail.com',
      to: "collinsrollins07@gmail.com, wifispacenetworks@gmail.com",
      subject: 'Daily Dued Notification Report(s)',
      // text: `Hello, we are notifying you that the backend server is now started. We shall run the daily scan in the next 12 hours from now. Thank you.`,
      html:` <body><h2>Hi Team,</h2><p> we have scenned the database for dued customers for today and we've found none. We shall run next scan tommorow... </p> <center><div><img src="https://smarttechs.com.ng/WSLogo.jpg?auto=format&fit=max&w=1920" alt="WIfispace"></div></center></body>`
    })
  }


}

setInterval(() => {
  runSchedule();
},43200000 );

app.get("/", async(req, res) => {

  res.json({
    success: true,
    message: "All fine and good",
  })
})


app.listen(process.env.PORT 
  || Port, () => {
  console.log(`Server is started on Port: ${Port}`)
})