const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(
          `User ${userId} joined socket room`
        );
      }
    });

    socket.on("send_message", async (data) => {
      try {
        console.log("📨 send_message received:", data);

        if (!data) return;

        const { sender, receiver, msg } = data;

        if (!sender || !receiver || !msg || !msg.trim()) {
          console.log("❌ Invalid message data");
          return;
        }

        const message = await Message.create({
          sender,
          receiver,
          msg: msg.trim(),
        });

        console.log("✅ Message saved:", message._id);

        let conversation =
          await Conversation.findOne({
            participants: {
              $all: [sender, receiver],
            },
          });

        if (!conversation) {
          conversation =
            await Conversation.create({
              participants: [sender, receiver],
              msg: [message._id],
            });
        } else {
          conversation.msg.push(message._id);
          await conversation.save();
        }

        console.log(
          `📤 Sending message to receiver room: ${receiver}`
        );

        io.to(receiver).emit(
          "receive_message",
          message
        );

        console.log(
          `📤 Sending message to sender room: ${sender}`
        );

        io.to(sender).emit(
          "receive_message",
          message
        );
      } catch (error) {
        console.error(
          "❌ Error in socket send_message:",
          error
        );
      }
    });

    socket.on("disconnect", () => {
      console.log(
        "User disconnected:",
        socket.id
      );
    });
  });
};