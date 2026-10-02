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

const app = express();

// =====================================
// CORS
// =====================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // Vercel production domain
  "https://nex-chat-chat-application.vercel.app",

  // Current Vercel project domain
  "https://nex-chat-chat-application-vijays-projects-5409118.vercel.app",

  // Render environment variable
  process.env.CLIENT_URL,
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  // Exact origins
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Vercel preview/deployment URLs
  if (
    /^https:\/\/nex-chat-chat-application.*\.vercel\.app$/.test(origin)
  ) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request origin:", origin);

      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// =====================================
// HTTP SERVER
// =====================================

const server = http.createServer(app);

// =====================================
// SOCKET.IO
// =====================================

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.log("Socket CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

// =====================================
// API ROUTES
// =====================================

app.use("/chatApp/auth", authRoutes);
app.use("/chatApp/users", userRoutes);
app.use("/chatApp/messages", messageRoutes);

// =====================================
// SOCKETS
// =====================================

require("./sockets/socket")(io);

// =====================================
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexChat server is running",
  });
});

// =====================================
// 404
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: origin not allowed",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`NexChat server running on port ${PORT}`);
  console.log(`Port: ${PORT}`);
});