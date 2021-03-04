const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require("../cloudinary");
const mongoose = require('mongoose');
const { get } = require('mongoose');


module.exports.index = async (req, res) => {    //all campgrounds 
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCamp = async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 404);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    //res.send(geoData.body.features[0].geometry.coordinates);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
   // console.log(campground);
    req.flash('success', 'Successfully made a new Campgroud!');
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.showCamp = async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    .populate({path:'reviews', populate: { path: 'author'}}).populate('author');
    if (!campground) {
        req.flash('error', 'cannot  find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.campEdit = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
  
    if (!campground) {
        req.flash('error', 'cannot  find that campground!');
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params; 
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await Campground.updateOne({"_id": mongoose.Types.ObjectId(id)},{ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted!');
    res.redirect('/campgrounds');
}