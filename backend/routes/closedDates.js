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


router.delete("/delete", function(req, res) {
  const theRenderData = {};


  EmployeeModel.deleteClosedDate(function(pError, employee){
    if(pError){
      theRenderData.messageType = "danger";
      theRenderData.message = pError.message;
      return res.json(theRenderData);
    }
   return res.json("sfsaf")
  
  })
})


module.exports = router;
