const Comments = require("../Model/comment");
const Post = require("../Model/post");

exports.createComments = async (req, res, next) => {
  const userId = req.userId;
  const { reply, content, postId } = req.body;
  try {
    const newComment = new Comments({
      postId: postId,
      content: content,
      tag: userId,
      reply: [],
      postUserId: userId,
      likes: [],
      user: userId,
    });
    const savedCommnet = await newComment.save();
    if (!reply) {
      const addCommentToPost = await Post.findByIdAndUpdate(postId, {
        $addToSet: {
          comments: savedCommnet._id,
        },
      });
    }
    if (reply) {
      const updateParentComment = await Comments.findByIdAndUpdate(
        reply,
        {
          $addToSet: {
            reply: savedCommnet._id,
          },
        },
        { new: true, populate: ["reply"] }
      );
      res.status(200).json({ msg: "Done Reply", updateParentComment });
      return;
    }
    res.status(200).json({ msg: "Done New", newComment });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal Server error" });
    return;
  }
};

exports.updateComment = async (req, res, next) => {
  const commentId = req.params.id;
  const { content } = req.body;
  try {
    const updatedComment = await Comments.findByIdAndUpdate(
      commentId,
      {
        content: content,
      },
      { new: true }
    );
    res.status(200).json({ msg: "Update Success", updatedComment });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.likeacomment = async (req, res, next) => {
  const commentId = req.params.id;
  const userId = req.userId;
  try {
    const likeacomment = await Comments.findByIdAndUpdate(
      commentId,
      { $addToSet: { likes: userId } },
      { new: true, populate: ["likes"] }
    );
    res.status(200).json({msg: "liked comment", likeacomment});
    return;
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.unlikeacomment = async (req, res, next) => {
    const commentId = req.params.id;
    const userId = req.userId;
    try{
        const unlikeComment = await Comments.findByIdAndUpdate(commentId, {$pull: {
            likes: userId
        }}, {new: true});
        res.status(200).json({msg: "unliked comment", unlikeComment});
    }
    catch(error){
        res.status(500).json({msg: "Internal server Error"});
        return;
    }
};

exports.deleteacomment = async (req, res, next) => {
    const commentId = req.params.id;
    try{
        const deleteComment = await Comments.findByIdAndDelete(commentId, {new: true, populate: ['reply']});
        res.status(200).json({msg: "Deleted Comment", deleteComment});
    }
    catch(error){
        res.status(500).json({msg: "Internal Server Error"});
        return;
    }
};