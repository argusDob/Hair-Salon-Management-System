"use strict";
const express = require("express");
const router = express.Router();
const sanitizer = require("sanitizer");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const UserModel = require("../models/user");

router.post("/", function(req, res, next) {
  crypto.randomBytes(20, function(error, pBuffer) {
    const theToken = pBuffer.toString("hex"),
      theEmailAddress = sanitizer.escape(req.body.email),
      theReturnMessage = {};
    UserModel.findOne({ email: theEmailAddress }, function(error, pUser) {
      if (error) {
        theRenderData.messageType = "danger";
        theRenderData.message = error.message;
        return res.json(theRenderData);
      } else if (!pUser) {
        theReturnMessage.message = "User not found";
        theReturnMessage.messageType = "warning";
        return res.json(theReturnMessage);
      }
      pUser.resetPasswordToken = theToken;
			pUser.resetPasswordExpires = Date.now() + 3900000; // 1 hour + 5 mins
      pUser.save(function(error) {
        if (error) {
          theRenderData.messageType = "danger";
          theRenderData.message = error.message;
          return res.json(error);
        } else {
          sendToken(req, res, theToken, theEmailAddress, pUser);
        }
      });
    });
  });
});

router.post("/reset/:token", function(req, res) {
	const theRenderData = {}, theToken = req.params.token, passwordOne = req.body.passwordOne, passwordTwo = req.body.passwordTwo
	
  if (passwordOne.length < 8) { pwdError = "too short (length is " + passwordOne.length + ")"; }
        
  if(passwordOne) { checkPasswordRequirements(req, res, passwordOne) }
  if(passwordTwo) { checkPasswordRequirements(req, res, passwordTwo) }

  if (passwordOne !== passwordTwo) {
		theRenderData.messageType = 'danger';
		theRenderData.message = ("password mismatch");
		return res.json(theRenderData);
	} else {
	UserModel.findOne({ resetPasswordToken: theToken, resetPasswordExpires: { $gt: Date.now() } }, function(error, pUser) {
      if (error) {
        theRenderData.messageType = "danger";
        theRenderData.message = error.message;
        return res.json(theRenderData);
      } else if (!pUser) {
        theRenderData.messageType = "danger";
        theRenderData.message = "Password reset token is invalid or has expired.";
        return res.json(theRenderData);
      }
      pUser.resetPasswordToken = undefined;
      pUser.resetPasswordExpires = undefined;
			const theUpdatedUser = pUser;
			theUpdatedUser.password = passwordOne;
      pUser.save(function(error) {
				if(error){ 
				theRenderData.messageType = "danger";
        theRenderData.message = error.message;
        res.json(theRenderData)
				 }
        return UserModel.updatePassword(null,function(pError, pUser) {
            if (pUser) { theRenderData.user = pUser }
            if (pError) {
              theRenderData.messageType = "danger";
              theRenderData.message = pError.message + ".";
              req.logout();
              return res.json(theRenderData);
            }else{
							console.log(theUpdatedUser);
							theRenderData.messageType = "success";
							theRenderData.message = "The password has been updated";
							return res.json(theRenderData);	
						}
          },theUpdatedUser);
      });
    }
	)};
});

module.exports = router;

function checkPasswordRequirements(pReq, pRes, pPassword){
  let pwdError = '';
  if (!/^(?=.*?[a-z])/.test(pPassword)) { if (pwdError != '') { pwdError += ", "; } pwdError += "missing lowercase"; }
  if (!/^(?=.*?[A-Z])/.test(pPassword)) { if (pwdError != '') { pwdError += ", "; } pwdError += "missing uppercase"; }
  if ((!/^(?=.*?[0-9])/.test(pPassword)) && (!/^(?=.*?[#?!@$%^&*-])/.test(password))) {
  if (pwdError != '') { pwdError += ", "; } pwdError += "missing non-alphabet"; }
  if (pwdError != '') {
    theRenderData.messageType = 'danger';
    theRenderData.message ="not proper password requirements" + " " + pwdError;
    return pRes.json(theRenderData);
  }
}


function sendToken(pReq, pRes, pTheToken, pEmailAddress, pUser) {
  const theReturnMessage = {};
  theReturnMessage.token = pTheToken;
  theReturnMessage.email = pEmailAddress;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "systemhairsalon@gmail.com",
      pass: "argusCarlito32"
    }
  });

  if (!pUser || !pUser.resetPasswordToken || !pUser.email) {
    pReq.logout();
    theReturnMessage.message = "User not found";
    theReturnMessage.messageType = "warning";
    return pRes.json(theReturnMessage);
  }

  const theSubject = "Reset your Password";
  const theContentHTML = getResetMessageHTML(pTheToken, pReq.get("host"));
  if (!theContentHTML) {
    pReq.logout();
    theReturnMessage.message = "Unexpected error";
    theReturnMessage.messageType = "danger";
    return res.json(theReturnMessage);
  }

  const theAddress = pUser.email;
  let theUsername = pUser.username;
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

function getResetMessageHTML(pToken, pHostname, pLanguage) {
  
  const theSalutation = "dear";
  const theAnonHeading = "madam/sir";
  const theGeneralMsg = "requested to reset the login credentials";
  const theInstruction = "click on the following link";
  const theLinkToClick = "https://" + pHostname + "/forgot/reset/" + pToken;
  const theSmallPrint = "active link";
  const theDidYouRequest = "if you did not request";
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
