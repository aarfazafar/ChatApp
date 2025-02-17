const chatroomModel = require("./chatroom.model");

module.exports.createChatroom = async (req, res) => {
  const { name } = req.body;

  try {
    const existingRoom = await chatroomModel.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: "Chatroom already exists" });
    }

    const chatroom = new chatroomModel({
      name,
      members: [req.user._id],
    });

    await chatroom.save();
    res.status(200).json(chatroom);
  } catch (error) {
    res.status(500).json({ error: "Error creating chatroom" });
  }
};

module.exports.joinChatroom = async (req, res) => {
  const { roomId } = req.body;
  const userId = req.user._id;

  try {
    const chatroom = await chatroomModel.findById(roomId);
    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    if (!chatroom.members.includes(userId)) {
      chatroom.members.push(userId);
      await chatroom.save();
    }

    res.status(200).json(chatroom);
  } catch (error) {
    res.status(500).json({ error: "Error joining chatroom" });
  }
};
