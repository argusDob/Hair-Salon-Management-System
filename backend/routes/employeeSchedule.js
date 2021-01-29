"use strict";
const express = require("express");
const router = express.Router();
const moment = require("moment");

const UserModel = require("../models/user");
const EmployeeModel = require("../models/employee");
const PrivilegesAgent = require("../models/privileges");



router.post("/add", function(req, res) {
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
    const theRenderData = {}
    let theStartDate = "", theEndDate= "";
    console.log(req.body);

    const theInitialDate =  req.body.theInitialDate;
    const theLastDate = req.body.theLastDate
    if(!req.user) { return; }

    if((!theInitialDate) || (!theLastDate)){
      theRenderData.messageType = "danger";
      theRenderData.message = "Unexpected Error";
      res.json(theRenderData);
    }
    if((typeof(theEndDate) !== "undefined") || (typeof(theLastDate) !== "undefined")){
    theStartDate = theInitialDate.split("-").reverse().join("-");
    theEndDate = theLastDate.split("-").reverse().join("-");
    console.log(theStartDate)
    console.log(theEndDate)
    }

    EmployeeModel.getEmployeesScheduleByDateRange(function(pError, pEmployeeSchedule){
      if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        return res.json(theRenderData);
      } else {
        // for(let i = 0; i<pEmployeeSchedule.length; i++){
        //    console.log(pEmpl)
        // }
        theRenderData.employeeScheduleList = pEmployeeSchedule;
        theRenderData.messageType = "success";
        theRenderData.message = "You get the weekly schedule.";
        res.json(theRenderData);
      }
  },theStartDate, theEndDate)
  })

  router.get("/selectedSchedule/:id", function(req, res) {
    const theRenderData = {};

    if(!req.user) { return; }

    if((!req.params.id) || (req.params.id.length < 48)){
      theRenderData.messageType = "danger";
      theRenderData.message = "Unexpected Error";
      res.json(theRenderData);
    }

    const theEmployeeScheduleId = req.params.id.substring(0, 24);
    const theEmployeeId = req.params.id.substring(24, 48);

    const theSelectedEmployeeScheduleList = [];

    EmployeeModel.getEmployeeById(function(pError, pEmployee){
      if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        return res.json(theRenderData);
        console.log(pError)
      } else {
        pEmployee.forEach(function(employee){
          employee.employeeSchedule.forEach(function(employeeSchedule){
                  if(employeeSchedule._id == theEmployeeScheduleId ){
                    const theSelectedEmployeeSchedule = {}
                      theSelectedEmployeeSchedule.firstName = employee.firstName;
                      theSelectedEmployeeSchedule.lastName = employee.lastName;
                      theSelectedEmployeeSchedule.startTime = employeeSchedule.startTime;
                      theSelectedEmployeeSchedule.breakStartTime = employeeSchedule.breakStartTime;
                      theSelectedEmployeeSchedule.breakEndTime = employeeSchedule.breakEndTime;
                      theSelectedEmployeeSchedule.endTime = employeeSchedule.endTime;
                      theSelectedEmployeeScheduleList.push(theSelectedEmployeeSchedule)
                        console.log(theSelectedEmployeeScheduleList)
                  }
                 });
          });
        theRenderData.theSelectedEmployeeScheduleList = theSelectedEmployeeScheduleList;
        theRenderData.messageType = "success";
        theRenderData.message = "You get the selected shcedule.";
        return res.json(theRenderData);
      }
  }, theEmployeeId)
  });







module.exports = router;
