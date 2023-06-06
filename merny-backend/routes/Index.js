const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");

const {
  registerUser,
  logIn,
  searchAllUsers,
  getUserById,
  updateUser,
  followUser,
  unfollowUser,
  suggestions,
  suggestionsUser,
  savepost,
  unsavepost,
  getallsavedpost,
  getLoggedInUserInfo,
  logOutUser,
} = require("../Controllers/userController");
const { authMiddleware } = require("../Middleware/authMiddleware");
const {
  userValidator,
  logInValidator,
} = require("../Middleware/Validators/validator");
const { notification, getAllNotifications, removeNotification, deleteAllNotification } = require("../Controllers/notificationController");
const {
  post,
  getPosts,
  updatePerticularPost,
  getPerticularPosts,
  deletePost,
  like,
  unlike,
  userPosts,
} = require("../Controllers/postController");
const {
  createComments,
  updateComment,
  likeacomment,
  unlikeacomment,
  deleteacomment,
} = require("../Controllers/commentController");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Check if the file MIME type is allowed
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Unsupported file type. Only JPEG and PNG files are allowed."),
      false
    ); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/register", userValidator, registerUser);
router.post("/login", logInValidator, logIn);
router.post("/logout", authMiddleware, logOutUser);
router.get("/search", authMiddleware, searchAllUsers);
router.get("/user/:id", authMiddleware, getUserById);
router.get("/loggedInUser", authMiddleware, getLoggedInUserInfo);
router.put("/user", authMiddleware, updateUser);
router.put("/user/:id/follow", authMiddleware, followUser);
router.put("/user/:id/unfollow", authMiddleware, unfollowUser);
router.get("/suggestionsUser", authMiddleware, suggestionsUser);
router.get("/notification", authMiddleware, notification);
router.post("/posts", authMiddleware, upload.array("image", 2), post);
router.get("/posts", authMiddleware, getPosts);
router.put("/post/:id", authMiddleware,upload.array("image", 2), updatePerticularPost);
router.get("/post/:id", authMiddleware, getPerticularPosts);
router.delete("/post/:id", authMiddleware, deletePost);
router.put("/post/:id/like", authMiddleware, like);
router.put("/post/:id/unlike", authMiddleware, unlike);
router.get("/user_posts/:id", authMiddleware, userPosts);
router.put("/savepost/:id", authMiddleware, savepost);
router.put("/unsavepost/:id", authMiddleware, unsavepost);
router.get("/getsavedpost", authMiddleware, getallsavedpost);
router.post("/comment", authMiddleware, createComments);
router.post("/comment/:id", authMiddleware, updateComment);
router.get("/comment/:id/like", authMiddleware, likeacomment);
router.get("/comment/:id/unlike", authMiddleware, unlikeacomment);
router.delete("/comment/:id", authMiddleware, deleteacomment);
router.post("/notification", authMiddleware, notification);
router.get('/notifications', authMiddleware, getAllNotifications);
router.delete('/notification/:id', authMiddleware, removeNotification);
router.delete('/deleteAllNotification', authMiddleware, deleteAllNotification);


module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYyNWNmYmUwYjllYzg2MjIxMjUxYzIiLCJlbWFpbCI6InRpa2VzaDIzQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYmhhdmVzaDA1MDUiLCJ0aW1lc3RhbXAiOiIyMDIzLTA1LTE1VDE3OjU3OjUwLjI3NFoiLCJpYXQiOjE2ODQxNzM0NzAsImV4cCI6MTY4NDE3NzA3MH0.IRBd70zguGQtL4pGwawGcq68kSd9578NtEgdG4x-Gqk
