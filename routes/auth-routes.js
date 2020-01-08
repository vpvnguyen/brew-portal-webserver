const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const keys = require('../config/env_config'); 
const User = require('../db/user'); 

const CLIENT_HOME_PAGE_URL = 'http://localhost:3000';

// when login is successful, retrieve user info
router.get("/login/success/:id", async (req, res) => {
  let userInfo = await User.getUserById(req.params.id)
  let token =  jwt.sign(userInfo[0], keys.privateKey, {expiresIn: "12h"})
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: userInfo[0], 
      token: token
    })
});

//auth log out 
router.get('/logout', (req, res) => {
    //handle with passport 
    req.logout(); 
    res.redirect(CLIENT_HOME_PAGE_URL); 
}); 

//google auth 
router.get('/google', passport.authenticate('google', {
    session: false,
    scope: ['profile', 'openid', 'email'],
    failureRedirect: CLIENT_HOME_PAGE_URL
  })
);

// //google auth redirect 
router.get('/google/redirect', passport.authenticate('google', { session: false }), (req, res) => {
  console.log(req.user)  
  if (process.env.NODE_ENV === 'production') {
    // final aws url 
    res.redirect('/splash/' + req.user.id)
  } else {
    res.redirect('http://localhost:3000/splash/' + req.user.id)
  }
}); 

router.get('/dashboard', (req, res) => {
  res.send()
}); 

module.exports = router;