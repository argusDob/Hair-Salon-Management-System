"use strict";
const express = require("express");
const router = express.Router();
const moment = require("moment");

const UserModel = require("../models/user");
const EmployeeModel = require("../models/employee");
const PrivilegesAgent = require("../models/privileges");


router.post("/all", function(req, res) {
    const theRenderData = {};
    console.log(req.body);

    const theInitialDate =  req.body.theInitialDate;
    const theLastDate = req.body.theLastDate


    if((!theInitialDate) || (!theLastDate)){
      theRenderData.messageType = "danger";
      theRenderData.message = "Unexpected Error";
      res.json(theRenderData);
    }

    const theStartDate = theInitialDate.split("-").reverse().join("-");
    const theEndDate = theLastDate.split("-").reverse().join("-");
    console.log(theStartDate)
    console.log(theEndDate)


    // const theInitialDate = moment(req.body.theInitialDate).format(YYYY-MM-DD);
    // const theEndDate = moment( req.body.theLastDate).format(YYYY-MM-DD);
    // console.log(theInitialDate);
    // console.log(theEndDate);


    EmployeeModel.getEmployeesScheduleByDateRange(function(pError, pEmployeeSchedule){
      if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        console.log(pError)
      } else {
        // for(let i = 0; i<pEmployeeSchedule.length; i++){
        //    console.log(pEmpl)
        // }
        theRenderData.employeeScheduleList = pEmployeeSchedule;
        theRenderData.messageType = "success";
        theRenderData.message = "Working hours added";
        res.json(theRenderData);
      }
  },theStartDate, theEndDate)
  })



module.exports = router;
