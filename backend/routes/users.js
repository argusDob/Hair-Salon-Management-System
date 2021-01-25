const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const generatePassword = require('generate-password');
const nodemailer = require("nodemailer");



/* GET home page. */
router.post('/', async (req, res) => {
  const theUser = req.body; 
  userModel.addUser(function(error){
    if(error){
      console.log("I am here")
      res.json(error)
    }else{
      res.json("has been registered")
    }
    },theUser)
});


router.post('/employee', function(req,res){
    const theEmployee = req.body, theRenderData = {};
    console.log(req.body);

    if(!theEmployee.username) { theEmployee.username = theEmployee.email }
    if(!theEmployee.password) { theEmployee.password = generatePassword }
    theEmployee.createdBy = req.user;
    
    theEmployee.password = generatePassword.generate({length:12, numbers: true, uppercase: true, lowercase: true, symbols: true})
    userModel.addUser(function(error){
         if(error){
           console.log(error);
           theRenderData.messageType = "danger";
           theRenderData.message = error.message;
           res.json(theRenderData);
           } else {
             console.log("Success")
             emailPassword(req, res, theEmployee.password, theEmployee.email)
           }

}, theEmployee)
})

module.exports = router;

function emailPassword(pReq, pRes, pThePassword, pEmailAddress) {
  console.log("mono AEK RE MOUNIA")
  const theReturnMessage = {};
  theReturnMessage.email = pEmailAddress;


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "systemhairsalon@gmail.com",
      pass: "argusCarlito32"
    }
  });

  const theSubject = "An account has been openened for you";
  const theContentHTML = getPasswordHTML(pThePassword, pEmailAddress);
  if (!theContentHTML) {
    pReq.logout();
    theReturnMessage.message = "Unexpected error";
    theReturnMessage.messageType = "danger";
    return res.json(theReturnMessage);
  }

  const theAddress = pEmailAddress;
  const theUsername = pEmailAddress;
  if (!theUsername) {
    theUsername = theAddress;
  }

  const mailOptions = {
    from: "systemhairsalon@gmail.com",
    to: pEmailAddress,
    subject: theSubject,
    text: theContentHTML
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      pRes.json(error);
    } else {
      theReturnMessage.message = "Email has been sent";
      theReturnMessage.messageType = "success";
      pRes.json(theReturnMessage);
    }
  });
}

function getPasswordHTML(pPassword, pEmailAddress) {
  
  const theSalutation = "dear";
  const theAnonHeading = "madam/sir";
  const theGeneralMsg = "A new account has been opened for you";
  const theInstruction = "click on the following link to sign in ";
  const theLinkToClick = "http://localhost:8081/login";
  const theSmallPrint = "Your email is:" + pEmailAddress;
  const theDidYouRequest = "Your password is:" + pPassword;
  const theKindRegards = "kind regards";
  const theCustomerSupport = "argusDob customer support";

  const theHTML = "<p>" + theSalutation + " " + theAnonHeading + ",</p>" +
    "<p>" + theGeneralMsg + "</p>" + "<p>" + theInstruction + "<ul><li>" +
    "<a href=" + theLinkToClick + ">" + theLinkToClick + "</a></li></ul>" +
    theSmallPrint + " " + theDidYouRequest + "</p><br>" + "<p>" + theKindRegards +
    ",<br>" + theCustomerSupport + "</p>" +
    "<br><small>T +31 (0)625487852 <small>(Europa)</small>";
  return theHTML;
}
