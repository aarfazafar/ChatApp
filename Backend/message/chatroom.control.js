const chatroomModel = require("./chatroom.model");

module.exports.createChatroom = async (req, res) => {
  const { name, tags } = req.body;
  try {
    const existingRoom = await chatroomModel.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: "Chatroom already exists" });
    }

    const chatroom = new chatroomModel({
      name,
      members: [req.user._id],
      admin: req.user._id,
      tags
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
    const rooms = await chatroomModel.find();
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Cant get rooms"})
  }
}

module.exports.leaveRoom = async (req, res) => {
  const {userId, roomId} = req.body;
  if(!userId || !roomId){
    return res.status(400).json({error: "UserId and RoomId required"});
  }

  await chatroomModel.updateOne(
    {_id: roomId},
    {$pull: {members: userId}}
  ).then(res.status(200).json({message: `${userId} left room`}))
}

module.exports.getRoomInfo = async (req, res) => {
  const {roomId} = req.body;
  try {
    const room = await chatroomModel.findById(roomId);
    res.json(room)
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
}