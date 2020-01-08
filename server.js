const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

// google, et al auth.
const passport = require('passport');

// controller and auth routing
const apiRoutes = require('./routes/api-routes');
const authRoutes = require('./routes/auth-routes');

// allow CORS for mobile client frontend
const cors = require('cors');

// middleware 
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(bodyParser.json())

// initialize passport 
app.use(passport.initialize());

// setting cors headers to allow react app to hit REST API 
app.use(
  cors({
    origin: "*", // allow to server to accept request from different origin // REFACTOR FROM 'http://localhost:3000 - allow all for now'
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

// Serve up static assets (usually on heroku) / set server to dev or prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
} else {
  // use development files 
  app.use(express.static('development'))
}

// auth routes
app.use('/auth', authRoutes);

// api routes
app.use('/api', apiRoutes);

// catch all - send index
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//making app listen on Port
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`app listening on port ${PORT}`);
}); 