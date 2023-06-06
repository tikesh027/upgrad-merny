const User = require("../Model/user");
const { validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_TOKEN_SALT } = require("../constant/constant");

exports.registerUser = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const mappedError = error.array();
    const errorResponse = {};
    mappedError.forEach((error) => {
      errorResponse[error.path] = error.msg;
    });
    res.status(400).json(errorResponse);
    return;
  }

  const { fullname, username, email, password, gender } = req.body;
  try {
    const userEmail = await User.findOne({ email: email });
    const userName = await User.findOne({ username: username });
    if (
      userEmail &&
      userEmail.email === email &&
      userName &&
      userName.username === username
    ) {
      res.status(400).json({
        email: "This Email already exists.",
        userName: "This Username already exists.",
      });
      return;
    }
    if (userEmail && userEmail.email === email) {
      res.status(400).json({ msg: "This Email already exists." });
      return;
    }
    if (userName && userName.username === username) {
      res.status(400).json({ msg: "This Username already exists." });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
    return;
  }

  const encryptedPassword = bcrypt.hashSync(password, 12);

  const newUser = new User({
    fullname: fullname,
    email: email,
    username: username,
    address: "",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg",
    bio: "",
    password: encryptedPassword,
    gender: gender,
    role: "",
    mobile: "",
    website: "",
    saved: [],
    follower: [],
    following: [],
  });

  try {
    const savedUser = await newUser.save();
    const response = {
      msg: "Register success",
      user: savedUser,
    };
    response.user.password = "";
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.logIn = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const mappedError = error.array();
    const errorResponse = {};
    mappedError.forEach((error) => {
      errorResponse[error.path] = error.msg;
    });
    res.status(400).json(errorResponse);
    return;
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ msg: "This email does not exist." });
      return;
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ msg: "Password is incorrect" });
      return;
    }

    const token = JWT.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
        timestamp: new Date().toISOString(),
      },
      JWT_TOKEN_SALT,
      { expiresIn: "10h" }
    );
    const responseBody = {
      msg: "Login Success",
      access_token: token,
      user: user,
    };
    responseBody.user.password = "";
    res.status(200).json(responseBody);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal server error" });
    return;
  }
};

exports.logOutUser = async (req, res, next) => {
  try{
    res.status(200).json({ msg: "LogOut Success" });
    return;
  }
  catch(error){
    console.log(error);
    res.status(500).json({ msg: "internal Server Error" })
    return;
  }
}

exports.searchAllUsers = async (req, res, next) => {
  try {
    const user = await User.find().select([
      "avatar",
      "_id",
      "fullname",
      "username",
    ]);
    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
    return;
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const users = await User.findById(userId);
    if (!users) {
      res.status(400).json({ msg: "ID not found" });
      return;
    }
    users.password = "";
    res.status(200).json({ user: users });
  } catch (error) {
    res.status(500).json({ msg: "internal Server error" });
    return;
  }
};

exports.updateUser = async (req, res, next) => {
  const { avatar, fullname, mobile, address, story, website, gender } =
    req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        avatar: avatar,
        fullname: fullname,
        mobile: mobile,
        address: address,
        story: story,
        website: website,
        gender: gender,
      },
      { new: true }
    );
    res.status(200).json({ user: user, msg: "Update Success" });
  } catch (error) {
    res.status(400).json({ msg: "internal server Error" });
    return;
  }
};

exports.followUser = async (req, res, next) => {
  const userId = req.params.id;
  const currentUserId = req.userId;
  try {
    const follow = await User.findByIdAndUpdate(
      { _id: currentUserId },
      {
        $addToSet: {
          following: userId,
        },
      },
      { new: true, populate: ["following"] }
    );
    console.log(follow);
    res.status(200).json({ msg: "Updated Success", user: follow });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.unfollowUser = async (req, res, next) => {
  const userId = req.params.id;
  const currentUserId = req.userId;

  try {
    const unfollowUser = await User.findByIdAndUpdate(
      { _id: currentUserId },
      {
        $pull: {
          following: userId,
        },
      },
      { new: true, populate: ["following"] }
    );
    res.status(200).json({ msg: "You Followed this User", user: unfollowUser });
    return;
  } catch (error) {
    res.status(400).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.suggestionsUser = async (req, res, next) => {
  try {
    const suggestions = await User.findById(
      req.userId,
      {},
      { populate: ["follower", "following"] }
    );
    res.status(200).json({ user: suggestions });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
    return;
  }
};

exports.savepost = async (req, res, next) => {
  const postId = req.params.id;
  const currentId = req.userId;
  try {
    const savepost = await User.findByIdAndUpdate(
      currentId,
      { $addToSet: { saved: postId } },
      { new: true }
    );
    console.log(currentId);
    res.status(200).json({msg: "saved post", savepost});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
    return;
  }
};

exports.unsavepost = async (req, res, next) => {
  const postId = req.params.id;
  const currentId = req.userId;
  try {
    const unsavepost = await User.findByIdAndUpdate(
      currentId,
      { $pull: { saved: postId } },
      { new: true }
    );
    res.status(200).json({msg: "unsaved post", unsavepost});
    return;
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.getallsavedpost = async (req, res, next) => {
  const userId = req.userId;
  try{
    const allsavespost = await User.find({_id: userId}, {}, {populate: 'saved'}).select(['saved']);
    res.status(200).json({savedpost: allsavespost});
    return;
  }
  catch(error){
    res.status(500).json({ msg: "Internal Server error" });
    return;
  }
};

exports.getLoggedInUserInfo = async (req, res, next) => {
  const userId = req.userId;
  try{
    const userData = await User.findById(userId, {} , {
      populate: ['saved']
    });
    const response = {
      msg: 'Success',
      userData: userData
    }
    res.status(200).json(response);
    return;
  }
  catch(error){
    res.status(500).json({ msg: "Internal Server error", error });
    return;
  }
}