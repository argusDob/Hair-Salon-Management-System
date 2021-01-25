"use strict";
const express = require('express');
const router = express.Router();


router.post('/', function(req, res){ 
    const theRenderData = {};
    theRenderData.messageType = "success"
    theRenderData.message = "You have logged out"
    req.logout(); 
    res.json(theRenderData);
    }
);

module.exports = router;
