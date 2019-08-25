const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => { //Used By Express To Check Is There Is Still A Valid Token
  try {
    const token = req.headers.authorization.split(" ")[1]; //Returns The Token String After Bearer
    const decodedToken = jwt.verify(token, "this_is_a_super_secret_string_thing_which_needs_to_be_very_long_to_increase_security"); //Decode The Token Given The Original Token And 'Super Secret String'
    req.userData = { email: decodedToken.email, userId: decodedToken.userId }; //Pull Email And ID From The Token
    next(); //If All Performed, Still Authenticated, Otherwise...
  } catch (error) {
    res.status(401).json({ message: "Not Authenticated" });
  }
};
