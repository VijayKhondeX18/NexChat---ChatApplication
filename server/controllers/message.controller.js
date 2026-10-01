const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

// Send a new message via REST API
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiver, message } = req.body;

    if (!senderId || !receiver || !message) {
      return res.status(400).json({
        message: "Sender, receiver and message are required",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiver] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiver],
        msg: [],
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver,
      msg: message,
    });

    conversation.msg.push(newMessage._id);
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all messages between logged-in user and selected user
const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID required" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("msg");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.msg || []);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
