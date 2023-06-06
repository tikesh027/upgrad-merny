const Post = require("../Model/post");

exports.post = async (req, res, next) => {
  const currentId = req.userId;
  const { content } = req.body;
  console.log(req.files);
  const imagePaths = [];
  if (req.files && req.files.length) {
    req.files.forEach((image) => {
      imagePaths.push(image.filename);
    });
  }
  try {
    const newPost = new Post({
      comments: [],
      like: [],
      user: currentId,
      content: content,
      image: imagePaths,
    });
    const post = await newPost.save();
    const populatedPost = await post.populate("user");
    res.status(200).json({ post });
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "internal server error" });
    return;
  }
};
const populateReplies = async (comment) => {
  const populatedComment = await comment.populate("reply").execPopulate();
  const populatedReplies = await Promise.all(
    populatedComment.reply.map((reply) => populateReplies(reply))
  );
  return { ...populatedComment._doc, reply: populatedReplies };
};
exports.getPosts = async (req, res, next) => {
  try {
    const post = await Post.find(
      {},
      {},
      {
        populate: [
          {
            path: "comments",
            populate: "user",
          },
          "user"
        ],
      }
    ).sort({ createdAt: -1 });
    // let comments = [];
    // for(const p of post){
    //   for (const c of p.comments) {
    //    comments = await populateReplies(c);
    //    console.log(comments);
    //   }
    // }
    res.status(200).json({ msg: "Success", post });
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Internal Server Error", error });
  }
};

exports.updatePerticularPost = async (req, res, next) => {
  const postId = req.params.id;
  //   const currentUserId = req.userId;
  const { content } = req.body;
  const imagePaths = [];
  if (req.files && req.files.length) {
    req.files.forEach((image) => {
      imagePaths.push(image.filename);
    });
  }
  try {
    let contentToBeUpdated = {};
    const excludeValues = [];
    if (imagePaths.length && content) {
      contentToBeUpdated = {
        content: content,
        image: imagePaths,
      };
    } else if (imagePaths.length) {
      contentToBeUpdated = {
        image: imagePaths,
      };
      excludeValues.push("-content");
    } else {
      contentToBeUpdated = {
        content: content,
      };
      excludeValues.push("-image");
    }
    console.log(contentToBeUpdated, req.body);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      contentToBeUpdated,
      {
        new: true,
        populate: {
          path: "user",
          select: ["avatar", "_id", "fullname", "username"],
        },
      }
    ).select(excludeValues);
    const responseBody = {
      msg: "Done",
      newPost: updatedPost,
    };
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(400).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.getPerticularPosts = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const perticularPost = await Post.findOne({ _id: postId });
    res.status(200).json(perticularPost);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const deletePost = await Post.findByIdAndDelete(postId, {
      populate: ["user"],
    });
    res.status(200).json({ msg: "delete Success", deletePost });
    return;
  } catch (error) {
    res.status(400).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.like = async (req, res, next) => {
  console.log("here=====>");
  const postId = req.params.id;
  try {
    const likePost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { like: req.userId } },
      { new: true, populate: { path: "like", select: ["_id"] } }
    );
    res.status(200).json({ msg: "Likes Post", likePost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.unlike = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const unlikePost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          like: req.userId,
        },
      },
      { new: true }
    );
    res.status(200).json(unlikePost);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.userPosts = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const userpost = await Post.find({ user: userId });
    res.status(200).json(userpost);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
};
