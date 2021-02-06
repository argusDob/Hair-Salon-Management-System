"use strict";

const express = require('express');
const router = express.Router();
const passport = require('passport');
var jwt = require('jsonwebtoken');

router.use(passport.initialize());
router.use(passport.session());

router.post('/', passport.authenticate('local'),  function(req, res) {
   const theRenderData ={}, theUser = req.user;
   console.log("fdasfsdfa");
   if(!req.user) { return; }
   req.login(req.user, function(err) {
      if (err) { return next(err); }
      const token = jwt.sign({ id: theUser._id }, "myapp-Rocks", { expiresIn: 86400 });
      theRenderData.token = token
      theRenderData.message = "You have log in"
      theRenderData.messageType = "success"
      theRenderData.username = req.user.username
      res.json(theRenderData);
    });


}); // ('/', passport.authenticate())

router.get('/test', function(req, res) {
   if(req.user){
    return res.json(req.user);
    }else{
    return res.json("no user");

   }
}); // ('/', passport.authenticate())



module.exports = router;
