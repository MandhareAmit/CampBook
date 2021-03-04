const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const user = require('../controllers/users');

router.route('/register')
      .get(user.register)
      .post(catchAsync(user.registerUser));

 router.route('/login')
        .get( user.loginRender)
        .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), user.userLogin);
        


router.get('/logout', user.logoutRender);

module.exports = router;