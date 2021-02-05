"use strict"
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');



const EmployeeModel = require("../models/employee");
const PrivilegesAgent = require("../models/privileges");


router.post("/add", function(req, res) {
    const theRenderData = {};
    if(!req.user) { return; }
    console.log(req.body.date);
    const theClosedDate = req.body;
    theClosedDate.date = new Date(req.body.date + " " + "EDT");

    console.log(theClosedDate);
    if(!theClosedDate._id){
    theClosedDate._id = mongoose.Types.ObjectId();
    EmployeeModel.updateAllEmployeesSchedule(function(pError){
    if(pError){
      theRenderData.messageType = "danger";
      theRenderData.message = pError.message;
      return res.json(theRenderData);
    } else {
      console.log("fadsfadsfasdfdsafdsafdasf")
      theClosedDate.isUpdated = false;
      theRenderData.theClosedDate =theClosedDate
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
       theClosedDate.isUpdated = true;
       theRenderData.theClosedDate = theClosedDate;
       theRenderData.messageType = "success"
       theRenderData.message = "You have edit a closed date";
       return res.json(theRenderData)
  }, theClosedDate)
    }
})


router.delete("/delete/:id", function(req, res) {
  const theRenderData = {};
  console.log(req.body);
  const theClosedDateId = req.params.id;
  console.log(theClosedDateId);

  EmployeeModel.deleteClosedDate(function(pError, employee){
    if(pError){
      theRenderData.messageType = "danger";
      theRenderData.message = pError.message;
      return res.json(theRenderData);
    }else{
      theRenderData.messageType = "success";
      theRenderData.message = "You have deleted a closed date";
      return res.json(theRenderData);
    } 
  }, theClosedDateId)
})

module.exports = router;
