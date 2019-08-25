const Post = require("../models/post"); // JavaScript Import

exports.createPost = (req, res, next) => { //Methods That Will Be Called By Express
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({ //New Post Object Created When Post Is Created
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  post
    .save().then(createdPost => { //Save The Post Object
    res.status(201).json({ //Return 'Created' HTTP Post Code With Message
      message: "Post Created",
      post: {
        ...createdPost, //Add The Created Post, To List Of Posts
        id: createdPost._id //Create An ID For It
      }
    });
  }).catch(error => { //Catching Generic Error
    res.status(500).json({
      message: "Unable To Create Post"
    });
  });
};

exports.updatePost = (req, res, next) => { //Update Post Method To Be Called By Express
  let imagePath = req.body.imagePath; //New Image Path For Updated Post
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename; //If There Is A Fle To Be Uploaded, Create A New URL For It
  }
  const post = new Post({ //New Post Object To Be Uploaded
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post) //Update Post While Keeping Same ID And Creator In Mongo
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: "Post Updated"}); //Return Message And Code For Successful Post
      } else {
        res.status(401).json({message: "Unauthorised"});
      }
    }).catch(error => { //Generic Post Catch
    res.status(500).json({
      message: "Unable To Update Post"
    });
  });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize; //Find Current Size Of Page
  const currentPage = +req.query.page; //Find The Current Page The User Is On
  const postQuery = Post.find(); //Initialise Find Method
  let fetchedPosts;
  if (pageSize && currentPage) { //If There Is A PageSize And A CurrentPage
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize); //Find Value User Selects As Total For Page
  }
  postQuery.then(documents => {
    fetchedPosts = documents; //Associate The Posts With FetchedPosts
    return Post.count(); //Return The Total Posts
  }).then(count => {
    res.status(200).json({
      message: "Posts Fetched",
      posts: fetchedPosts,
      maxPosts: count
    });
  }).catch(error => {
    res.status(500).json({
      message: "Unable To Fetch Posts"
    });
  });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => { //Find Post Given The ID
    if (post) { //If There Is A Post With That ID
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post Not Found"});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Unable To Fetch Post"
    });
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}) //Delete Post Based On IDs In Mongo
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({message: "Post Deleted"});
      } else {
        res.status(401).json({message: "Unauthorised"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Unable To Delete A Post"
      });
    });
};
