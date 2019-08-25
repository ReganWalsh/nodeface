const express = require("express");
const PostController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();

router.post("", checkAuth, extractFile, PostController.createPost); //Create Post While Checking There Is A Valid Token And Valid Photo Type
router.put("/:id", checkAuth, extractFile, PostController.updatePost); //Update Post While Checking There Is A Valid Token And Valid Photo Type
router.get("", PostController.getPosts); //Gets All Posts
router.get("/:id", PostController.getPost); //Gets A Specific Post Based Off An ID
router.delete("/:id", checkAuth, PostController.deletePost); //Deletes A Post Based Off An ID And Checks There Is A Valid Token For The User

module.exports = router;
