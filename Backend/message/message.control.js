const messageModel = require("./message.model");
const chatroomModel = require("./chatroom.model");

module.exports.sendMessage = async (req, res) => {
  const { text, sentBy, room, sentAt } = req.body;
  try {
    const chatroom = await chatroomModel.findById(room);
    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    const message = new messageModel({
      text: text,
      sentBy: sentBy,
      room: room,
      sentAt: sentAt
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
      .populate("sentBy", "username");
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving messages" });
  }
};
