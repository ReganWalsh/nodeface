const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');
const postsRoutes = require ("./routes/posts");
const userRoutes = require("./routes/user");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

mongoose.connect("mongodb+srv://regan:zHlqC9SrA27kD0He@cluster0-ci4du.mongodb.net/node-face?retryWrites=true&w=majority") //String To Connect To Mongo, Creating The Collection Node-Angular
  .then(() => {
      console.log('Successfully Connected To MongoDB');
    }).catch(() => {
      console.log('Unable To Connect To MongoDB, Please Check Credentials');
});


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Sets CORS Header, Which Enables Connection Between Service And Angular Front-End
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept, Authorization'); //Enables Selected HTTP Headers That Are Able To Be Used
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS'); //Valid HTTP Methods That Are Allowed
  next();
});



app.use("/api/posts", postsRoutes); //Enable Routers For Post And User
app.use("/api/user", userRoutes);

module.exports = app;

