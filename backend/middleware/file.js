const multer = require("multer");

const MIME_TYPE_MAP = { //Map Of All Valid Image Types
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({ //Use Multer To Store Images
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]; //Check If Type Is Valid (In The Map)
    let error = new Error("Invalid File Type"); //Otherwise An Error
    if (isValid) {
      error = null; //Set No Error If Valid
    }
    cb(error, "backend/images"); //No Error Then Set Save Directory
  },
  filename: (req, file, cb) => {
    const name = file.originalname //Creating Uniformity With String Name
      .toLowerCase()
      .split(" ") //Remove Spaces And Replace With Dashes
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype]; //Add Extention
    cb(null, name + "-" + Date.now() + "." + ext); //Return Full Image Name
  }
});

module.exports = multer({ storage: storage }).single("image"); //Accept The Image With The Name And Location
