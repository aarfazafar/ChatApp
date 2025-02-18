const messageModel = require("./message.model");
const chatroomModel = require("./chatroom.model");

module.exports.sendMessage = async (req, res) => {
  const { text, room } = req.body;
  const senderId = req.user._id;

  try {
    const chatroom = await chatroomModel.findById(room);
    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    const message = new messageModel({
      text: text,
      sentBy: senderId,
      room: room,
    });

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error sending message" });
  }
};

module.exports.getMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await messageModel
      .find({ room: roomId })
      .populate("sentBy", "name");
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving messages" });
  }
};
