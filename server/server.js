const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

const connectDB = require("./db/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use("/chatApp/auth", authRoutes);
app.use("/chatApp/users", userRoutes);
app.use("/chatApp/messages", messageRoutes);

require("./sockets/socket")(io);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexChat server is running",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});