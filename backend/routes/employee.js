const express = require("express");
const router = express.Router();
const generatePassword = require("generate-password");
const nodemailer = require("nodemailer");

const UserModel = require("../models/user");
const EmployeeModel = require("../models/employee");
const PrivilegesAgent = require("../models/privileges");


router.post("/", function(req, res) {
  const theRenderData = {}, theUser = {}, theEmployee = {};

  if (!req.body.email || !req.body.firstName || !req.body.lastName) {
    theRenderData.messageType = "danger";
    theRenderData.message = "Unexpexted Error";
    return res.json(theRenderData);
  }
  if(!req.user) { return; }

  if (theUser) {
      (theUser.email = req.body.email),
      (theUser.username = req.body.username);
      (theUser.password = req.body.password);
      (theUser.permissions = req.body.permissions);
      theUser.createdBy = req.user._id;
    }

  if (theEmployee) {
      (theEmployee._id = req.body._id);
      (theEmployee.firstName = req.body.firstName);
      (theEmployee.lastName = req.body.lastName);
      (theEmployee.mobileNumber = req.body.mobileNumber);
      (theEmployee.notes = req.body.notes);
      (theEmployee.title = req.body.employeeTitle);
      (theEmployee.startDate = req.body.startDate);
      (theEmployee.endDate = req.body.endDate);
  }

  if (!theUser.username) { theUser.username = theUser.email; }
  if (!theUser.password) { theUser.password = generatePassword; }
  
  const theUserPrivilleges = getEmployeePrivilleges( theUser, PrivilegesAgent.getPrivileges());
  theUser.privileges = theUserPrivilleges


  theUser.password = generatePassword.generate({ length: 12, numbers: true, uppercase: true, lowercase: true, symbols: true });
  //TODO CHECK PRIVILLEGES
  //  console.log("Has Privileges?",PrivilegesAgent.canCreateEmployees(req.user))
  // if(PrivilegesAgent.canCreateEmployees(req.user)){
  if(!theEmployee._id){
  UserModel.addUser(function(error, pUser) {
    if (error) {
      theRenderData.messageType = "danger";
      theRenderData.message = error.message;
      return res.json(theRenderData);
    } else {
      theEmployee.userRefs = pUser._id;
    }
    EmployeeModel.addEmployee(function(error, pEmployee) {
      if (error) {
        theRenderData.messageType = "danger";
        theRenderData.message = error.message;
        return res.json(theRenderData);
      } else {
        return emailPassword(req, res, theUser.password, theUser.email);
      }
    }, theEmployee);
  }, theUser);
  }else {
    EmployeeModel.updateEmployee(req.user, function(pError){
       if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = error.message;
        return res.json(theRenderData);
       }else { 
        theRenderData.messageType = "success";
        theRenderData.message = "The employee has been updated";
        return res.json(theRenderData);
       }
    }, theEmployee)
  }
  //  } else {
  //    theRenderData.messageType = "warning",
  //    theRenderData.message = "You do not have enough privileges."
  //    res.json(theRenderData);
  //  } 
});

//todo req user  + privilleges
router.get("/getEmployee/:id", function(req, res) {
  const theRenderData = {}
  theEmployeeId = req.params.id;
  console.log(req.user)
  if(!req.user) { return; }

  EmployeeModel.getEmployeeById(function(pError, pEmployee){
    return UserModel.getUserById(function(pError, pUser){
      if(pError){
        theRenderData.messageType = "danger";
          theRenderData.message = error.message;
           res.json(theRenderData);
      }else{
        theRenderData.user = pUser
        theRenderData.employee = pEmployee
        console.log(pEmployee[0].userRefs)
        theRenderData.messageType = "success";
        theRenderData.message = "Get the employee";
        res.json(theRenderData);
      }   
    }, pEmployee[0].userRefs)
  }, theEmployeeId)
})


router.post("/delete", function(req, res) {
  const theRenderData = {}

  const theEmployeeId = req.body.employeeId;
  const theUserId = req.body.userId
  
  if((!theEmployeeId) || (!theUserId)){
    theRenderData.messageType = "danger";
    theRenderData.message = "Unexpexted Error";
    return res.json(theRenderData);

  }
  EmployeeModel.deleteEmployeeById(function(pError, pEmployee){
    if(pError){
      theRenderData.messageType = "danger";
        theRenderData.message = error.message;
        return res.json(theRenderData);
    }else{
      theRenderData.messageType = "success";
      theRenderData.message = "The Employee with name:" + pEmployee.firstName + "has been deleted";
      res.json(theRenderData);
    }
    UserModel.deleteUserById(function(pError, pUser){
      console.log("iam")

      if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = error.message;
        return res.json(theRenderData);
      }else{
        theRenderData.messageType = "success";
        theRenderData.message = "The Employee with name:" + pEmployee.firstName + "has been deleted";
        return res.json(theRenderData);
      }
    },theUserId)
  }, theEmployeeId)  
})

router.get("/all", function(req, res) {
  const theRenderData = {}
  // if(!req.user) { return; }
  console.log(req.user)
  EmployeeModel.getAllEmployees(req.user, function(error, pEmployees){
         if(error){
          theRenderData.messageType = "danger";
          theRenderData.message = error.message;
          return res.json(theRenderData);
         } else {
           theRenderData.employees = pEmployees;
           theRenderData.messageType = "success";
           theRenderData.message = "The employees list";
           res.json(theRenderData);
        }
  })
})

router.post("/workinghours", function(req, res) {
  const theRenderData = {};
  const today = new Date()
  const tomorrow = new Date(today)
  req.body.date = tomorrow.setDate(tomorrow.getDate() + 5)
  EmployeeModel.addWorkingHours(req.user, function(pError, pEmployee){
       if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        console.log(pError)
        return res.json(theRenderData);
       }else {
        theRenderData.employees = pEmployee;
        theRenderData.messageType = "success";
        theRenderData.message = "Working hours added";
        res.json(theRenderData);
       }
  },req.body,req.body._id)
})




router.post("/all", function(req, res) {
  const theRenderData = {};
  const today = new Date()
  const tomorrow = new Date(today)
  req.body.date = tomorrow.setDate(tomorrow.getDate() + 5)
  EmployeeModel.addWorkingHours(req.user, function(pError, pEmployee){
       if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        console.log(pError)
        return res.json(theRenderData);
       }else {
        theRenderData.employees = pEmployee;
        theRenderData.messageType = "success";
        theRenderData.message = "Working hours added";
        res.json(theRenderData);
       }
  },req.body,req.body._id)
})

router.get("/employeesSchedulebyDate", function(req, res) {
  const theRenderData = {};
  
  EmployeeModel.getEmployeesScheduleByDateRange(function(pError, pEmployeeSchedule){
      if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        console.log(pError)
      } else {
        console.log(pEmployeeSchedule)
        // for(let i = 0; i<pEmployeeSchedule.length; i++){
        //    console.log(pEmpl)
        // }
        theRenderData.pEmployeeSchedule = pEmployeeSchedule;
        theRenderData.messageType = "success";
        theRenderData.message = "Working hours added";
        res.json(theRenderData);
      }
  })
})



module.exports = router;

function getEmployeePrivilleges(pUser, pAccountPrivilleges) {
  for (let type in pAccountPrivilleges) {
    if (pUser.permissions === type) {
      pUser.privilleges = pAccountPrivilleges[type];
    }
  }
  console.log(pUser.privilleges)
  return pUser.privilleges;
}

function emailPassword(pReq, pRes, pThePassword, pEmailAddress) {
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
    // pReq.logout();
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
      theRenderData.messageType = "danger";
      theRenderData.message = error.message;
      return pRes.json(theRenderData);
    } else {
      theReturnMessage.message = "A new employee has been registered. A mail has been sent to the Employee mail box";
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

  const theHTML =
    "<p>" +
    theSalutation +
    " " +
    theAnonHeading +
    ",</p>" +
    "<p>" +
    theGeneralMsg +
    "</p>" +
    "<p>" +
    theInstruction +
    "<ul><li>" +
    "<a href=" +
    theLinkToClick +
    ">" +
    theLinkToClick +
    "</a></li></ul>" +
    theSmallPrint +
    " " +
    theDidYouRequest +
    "</p><br>" +
    "<p>" +
    theKindRegards +
    ",<br>" +
    theCustomerSupport +
    "</p>" +
    "<br><small>T +31 (0)625487852 <small>(Europa)</small>";
  return theHTML;
}
