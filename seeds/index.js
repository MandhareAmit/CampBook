const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/campBook', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true    
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
       const camp = new Campground({
           author: '6027f2183663392284bac0ea',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Similar to finding a photo taken by a user, you can fetch a random photo that has been liked by a specific user.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {                  
                  url: 'https://res.cloudinary.com/duloqmege/image/upload/v1613497629/campBook/lfd4bwo9p5o73jor7nzv.jpg',
                  filename: 'campBook/lfd4bwo9p5o73jor7nzv'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})