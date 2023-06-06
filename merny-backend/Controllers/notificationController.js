const Notification = require("../Model/notification");

exports.notification = async (req, res, next) => {
  try {
    const { id, recipients, url, text } = req.body;
    const notification = new Notification({
      content: "",
      image: "",
      isRead: false,
      recipient: recipients,
      text: text,
      url: url,
      user: id,
    });
    const savedNotification = await notification.save();
    res.json({ msg: "Done", savedNotification });
    console.log(savedNotification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server Error" });
    return;
  }
};

exports.removeNotification = async (req, res, next) => {
  const notificationId = req.param.id;
  try {
    const deleteNotification = await Notification.findByIdAndDelete(
      notificationId,
      { populate: ["notification"] }
    );
    res.status(200).json({ msg: "success", deleteNotification });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.userId;
    const allNotification = await Notification.find({
      recipient: { $eq: userId },
    },{}, {populate: "user"});
    res.status(200).json({ msg: "done", notification: allNotification });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
};

exports.deleteAllNotification = async (req, res, next) => {
  try{
    const userId = req.userId;
    const deletedNotification = await Notification.deleteMany({ recipient: {$eq: userId} });
    res.status(200).json({msg: 'Done', notification: deletedNotification})
  }
  catch(error){
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }
}