const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
var upload = multer({ storage });

router.route('/')
      .get(catchAsync(campgrounds.index))
      .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCamp ));
    /*  .post(upload.array('image'), (req, res) => {
            console.log(req.body, req.files);
            res.send('It worked');
      })
*/

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
      .get(catchAsync(campgrounds.showCamp))
      .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCamp))
      .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.campEdit));

module.exports = router;