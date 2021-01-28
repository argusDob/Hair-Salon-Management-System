const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const session = require('cookie-session');
const helmet = require('helmet');
const multer = require('multer');
const favicon = require('serve-favicon');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');


// routes
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const forgotRouter = require('./routes/forgot');
const employeeRouter = require('./routes/employee');
const employeeScheduleRouter = require('./routes/employeeSchedule');



const UserModel = require('./models/user');




const app = express();
app.use(cors({ origin: "http://localhost:8080", // allow to server to accept request from different origin
methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
credentials: true
}));

app.use(helmet({
	frameguard: false,
}));

app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'favicon-1.ico')));



// app.use(cors(VariablesAgent.qmsCorsOptions));


app.use(morgan('combined'));
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
// extract the entire body portion of an incoming request stream and exposes it on req.body 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));
app.use(express.static(path.join(__dirname, 'public')));


// app.use(multer().single('rawFile'));


// passport config
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

mongoose.connect('mongodb+srv://argusDob:t8EzFb7rcRXE8Di@cluster0.zbxak.mongodb.net/Cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,

});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
//   });

app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/forgot', forgotRouter);
app.use('/employee', employeeRouter);
app.use('/employeeSchedule', employeeScheduleRouter);


app.listen(3000, function() {
    console.log('listening')
  })


  module.exports = app;
