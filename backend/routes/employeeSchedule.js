"use strict";
const express = require("express");
const router = express.Router();
const moment = require("moment");

const UserModel = require("../models/user");
const EmployeeModel = require("../models/employee");
const PrivilegesAgent = require("../models/privileges");

router.post("/add", function(req, res) {
  const theRenderData = {};

  if(!req.user){ return; }

  req.body.date = new Date(req.body.date)
  const theEmployeeScheduleId = req.body.theSelectedWorkingScheduleId;
  const theEmployeeId = req.body._id;
  if(!theEmployeeId){
    theRenderData.messageType = "danger";
    theRenderData.message = "Unexpected Error";
    res.json(theRenderData);
  }
    
   if(theEmployeeScheduleId){
    EmployeeModel.updateEmployeeSchedule(function(pError,pEmployee){
          if(pError){
            theRenderData.messageType = "danger";
            theRenderData.message = pError.message;
            return res.json(theRenderData);
        } else {
          theRenderData.messageType = "success";
          theRenderData.message = "Update";
          return res.json(theRenderData);
        }
  },req.body, theEmployeeId, theEmployeeScheduleId)
  } else {
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
  }
})

router.post("/all", function(req, res) {
    const theRenderData = {}
    let theStartDate = "", theEndDate= "";
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
   
    }

    EmployeeModel.getEmployeesScheduleByDateRange(function(pError, pEmployeeSchedule){
      if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        return res.json(theRenderData);
      } else {
        let theSchedule = [];
        pEmployeeSchedule.forEach(function(employee){
          let theEmployee = {};
              theEmployee._id = employee._id;
              theEmployee.firstName = employee.firstName;
            const sortedActivities =  employee.employeeSchedule.sort((a, b) => a.date - b.date)
            theEmployee.employeeSchedule = sortedActivities;
            console.log(theEmployee.employeeSchedule)
        theSchedule.push(theEmployee)
        })
      
        theRenderData.employeeScheduleList = theSchedule;
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
      } else {
        const theSelectedEmployeeSchedule = {}

        pEmployee.forEach(function(employee){
          employee.employeeSchedule.forEach(function(employeeSchedule){
                  if(employeeSchedule._id == theEmployeeScheduleId ){
                      theSelectedEmployeeSchedule._id = employee._id;
                      theSelectedEmployeeSchedule.employeeSchedule_id = employeeSchedule._id;
                      theSelectedEmployeeSchedule.firstName = employee.firstName;
                      theSelectedEmployeeSchedule.lastName = employee.lastName;
                      theSelectedEmployeeSchedule.startTime = employeeSchedule.startTime;
                      theSelectedEmployeeSchedule.breakStartTime = employeeSchedule.breakStartTime;
                      theSelectedEmployeeSchedule.breakEndTime = employeeSchedule.breakEndTime;
                      theSelectedEmployeeSchedule.endTime = employeeSchedule.endTime;
                      theSelectedEmployeeScheduleList.push(theSelectedEmployeeSchedule)
                  } 
                });
          });
        console.log(theSelectedEmployeeScheduleList)
        theRenderData.theSelectedEmployeeScheduleList = theSelectedEmployeeSchedule;
        theRenderData.messageType = "success";
        theRenderData.message = "You get the selected shcedule.";
        return res.json(theRenderData);
      };
  }, theEmployeeId)
  });


  router.delete("/delete/:id", function(req, res) {
    const theRenderData = {};
  
    if(!req.user) { return; }
    if((!req.params.id) || (req.params.id.length < 48)){
      theRenderData.messageType = "danger";
      theRenderData.message = "Unexpected Error";
      res.json(theRenderData);
    }
     const theEmployeeId = req.params.id.substring(0, 24);
     const theEmployeeScheduleId = req.params.id.substring(24, 48);
     console.log(theEmployeeId);
     console.log(theEmployeeScheduleId);

    EmployeeModel.deleteAworkingSchedule(function(pError, pEmployee){
      if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        return res.json(theRenderData);
      } else {
        theRenderData.messageType = "success";
        theRenderData.message = "Υou deleted a shift";
        return res.json(theRenderData);
      }
  },theEmployeeId, theEmployeeScheduleId )
  });

  router.post("/addHolidays", function(req, res) {
      const theRenderData = {};

      const theHolidays = {
        isHolidays: "true",
        startTime: "null",
        breakStartTime : "null",
        breakEndTime:"null",
        endTime:"null",
        name:"Christmas",
        date: "2021-02-02T23:00:00.000+00:00"
      }
    EmployeeModel.updateAllEmployeesSchedule(function(pError, pEmployees){
      if(pError){
        theRenderData.messageType = "danger";
        theRenderData.message = pError.message;
        return res.json(theRenderData);
      } else {
        theRenderData.messageType = "success"
        theRenderData.message = "You have added holidays";
        return res.json(theRenderData);
      }
  },theHolidays)
  })




module.exports = router;


