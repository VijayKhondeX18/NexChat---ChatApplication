
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

// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // Vercel frontend
  "https://nex-chat-chat-application-vijays-projects-5409118.vercel.app",

  // Render environment variable
  process.env.CLIENT_URL,
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

const isAllowedOrigin = (origin) => {
  // Allow requests without an Origin header
  // (Postman, server-to-server requests, etc.)
  if (!origin) {
    return true;
  }

  // Exact origins
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Allow Vercel deployment/preview URLs for this project
  if (
    /^https:\/\/nex-chat-chat-application(?:-[a-z0-9-]+)?-vijays-projects-5409118\.vercel\.app$/.test(
      origin
    )
  ) {
    return true;
  }

  return false;
};

// ===============================
// EXPRESS CORS
// ===============================

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

// Handle preflight requests
app.options("*", cors());

// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// HTTP SERVER
// ===============================

const server = http.createServer(app);

// ===============================
// SOCKET.IO
// ===============================

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// ===============================
// API ROUTES
// ===============================

app.use("/chatApp/auth", authRoutes);
app.use("/chatApp/users", userRoutes);
app.use("/chatApp/messages", messageRoutes);

// ===============================
// SOCKET.IO EVENTS
// ===============================

require("./sockets/socket")(io);

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexChat server is running",
  });
});

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ===============================
// ERROR HANDLER
// ===============================

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

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`NexChat server running on port ${PORT}`);
  console.log(`Port: ${PORT}`);
});
