const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
        res.status(201).json({
          message: "User Created Successfully",
          result: result
        });
      }).catch(err => {
        res.status(500).json({
          message: "Invalid Credentials"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authorisation Failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Authorisation Failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "this_is_a_super_secret_string_thing_which_needs_to_be_very_long_to_increase_security",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    }).catch(err => {
      return res.status(401).json({
        message: "Invalid Credentials"
      });
    });
}
