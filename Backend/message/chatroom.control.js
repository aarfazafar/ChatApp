const chatroomModel = require("./chatroom.model");

module.exports.createChatroom = async (req, res) => {
  const { name, tags, icon, expiryDuration } = req.body;
  try {
    const existingRoom = await chatroomModel.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: "Chatroom already exists" });
    }

    const duration = expiryDuration || 86400; // 24h default
    const expiresAt = new Date(Date.now() + duration * 1000);

    const chatroom = new chatroomModel({
      name,
      members: [req.user._id],
      admin: req.user._id,
      tags,
      icon,
      expiryDuration: duration,
      expiresAt
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

module.exports.getRooms = async (req, res) => {
  try {
    const rooms = await chatroomModel.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cant get rooms" })
  }
}

module.exports.leaveRoom = async (req, res) => {
  const { userId, roomId } = req.body;
  if (!userId || !roomId) {
    return res.status(400).json({ error: "UserId and RoomId required" });
  }

  try {
    const updatedRoom = await chatroomModel.findOneAndUpdate(
      { _id: roomId },
      { $pull: { members: userId } },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (updatedRoom.members.length === 0) {
      await chatroomModel.findByIdAndDelete(roomId);
      return res.status(200).json({ message: `Room deleted as it had no members` });
    }

    return res.status(200).json({ message: `${userId} left the room` });
  } catch (error) {
    console.error("Error leaving room:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports.getRoomInfo = async (req, res) => {
  const { roomId } = req.body;
  try {
    const room = await chatroomModel.findById(roomId);
    res.json(room)
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
}