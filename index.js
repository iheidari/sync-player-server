const express = require("express");
const http = require("http");
const cors = require("cors");

require("dotenv").config();

// Import routes and socket
const roomRoutes = require("./routes/rooms");
const {
  initializeSocket,
  setupSocketRoutes,
  getSocketStats,
} = require("./routes/socket");

const app = express();
const server = http.createServer(app);

// Configure CORS for production - allow all origins for Socket.IO
const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Initialize Socket.IO
const io = initializeSocket(server);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use("/api/rooms", roomRoutes);

// Setup Socket.IO routes
setupSocketRoutes(app);

// Root route for basic info
app.get("/", (req, res) => {
  res.json({
    message: "Sync Player Server is running!",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    platform: "render",
    corsOrigin: process.env.CORS_ORIGIN,
    endpoints: {
      health: "/api/health",
      rooms: "/api/rooms",
      socketRooms: "/api/socket/rooms",
    },
  });
});

app.get("/api/health", (req, res) => {
  // Detect platform based on environment
  let platform = "development";
  if (process.env.NODE_ENV === "production") {
    if (process.env.GAE_ENV) {
      platform = "google-app-engine";
    } else if (process.env.K_SERVICE) {
      platform = "google-cloud-run";
    } else {
      platform = "production";
    }
  }

  const socketStats = getSocketStats();

  res.json({
    status: "ok",
    connectedUsers: socketStats.connectedUsers,
    activeRooms: socketStats.activeRooms,
    environment: process.env.NODE_ENV || "development",
    platform: platform,
    corsOrigin: process.env.CORS_ORIGIN,
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  // Detect platform for logging
  let platform = "development";
  if (process.env.NODE_ENV === "production") {
    if (process.env.GAE_ENV) {
      platform = "Google App Engine";
    } else if (process.env.K_SERVICE) {
      platform = "Google Cloud Run";
    } else {
      platform = "production";
    }
  }

  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Platform: ${platform}`);
  console.log(
    `CORS Origin: ${process.env.CORS_ORIGIN || "all origins allowed"}`
  );
  console.log(`Socket.IO server ready for room management`);
  console.log(`Test client available at: http://localhost:${PORT}`);
});

// Export for Vercel
module.exports = app;
