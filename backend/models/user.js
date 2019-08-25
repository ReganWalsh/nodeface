const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({ //User Schema For Mongo
  email: { type: String, required: true, unique: true }, //Validator Ensures Unique Email For Each Account
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //Create Plugin To Be Able To Re-Use In Other Areas

module.exports = mongoose.model("User", userSchema); //Export The Schema
