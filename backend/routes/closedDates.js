"use strict"
const express = require("express");
const router = express.Router();


const EmployeeModel = require("../models/employee");
const PrivilegesAgent = require("../models/privileges");


router.post("/add", function(req, res) {
    const theRenderData = {};
    if(!req.user) { return; }
    const theClosedDate = req.body;
    theClosedDate.date = new Date(req.body.date)
    console.log(req.body);

    if(!theClosedDate._id){
    EmployeeModel.updateAllEmployeesSchedule(function(pError, pEmployees){
    if(pError){
      theRenderData.messageType = "danger";
      theRenderData.message = pError.message;
      return res.json(theRenderData);
    } else {
      theRenderData.messageType = "success"
      theRenderData.message = "You have added a closed date";
      return res.json(theRenderData);
    }
},theClosedDate)
    } else {
      EmployeeModel.updateClosedDate(function(pError, employee){
        if(pError){
          theRenderData.messageType = "danger";
          theRenderData.message = pError.message;
          return res.json(theRenderData);
        }
       theRenderData.messageType = "success"
       theRenderData.message = "You have edit a closed date";
       return res.json(theRenderData)
  }, theClosedDate)
    }
})

router.post("/editHolidays", function(req, res) {
  const theRenderData = {};

  const theHolidays = {
    _id:"601939fa37e6b9a57bc7fd8c",
    isHolidays: "true",
    startTime: "null",
    breakStartTime : "null",
    breakEndTime:"null",
    endTime:"null",
    name:"Christmas",
    date: "2021-12-25T23:00:00.000+00:00"
  }
  EmployeeModel.monoaekre(function(pError, employee){
    if(pError){
      theRenderData.messageType = "danger";
      theRenderData.message = pError.message;
      return res.json(theRenderData);
    }
   return res.json("sfsaf")
  
  })
})


module.exports = router;
