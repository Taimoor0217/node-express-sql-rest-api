'use strict';

// load modules

function testdb(db){
  
  db
    .authenticate()
    .then(() => {
      console.log('Connection to database, established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });



}

const express = require('express');
const morgan = require('morgan');
const db = require('./dbConfig');
const bodyParser = require('body-parser');
// variable to enable global error logging
const cors = require('cors')
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

testdb(db)
// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

// setup a friendly greeting for the root route


// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

//configure routes
let userRoutes  = require('./routes/user');
let courseRoutes  = require('./routes/course');

app.use('/api/users' , userRoutes);
app.use('/api/courses' , courseRoutes);
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
