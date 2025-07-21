const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Configure CORS for production - allow all origins for Socket.IO
const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = socketIo(server, {
  cors: {
    origin: true, // Allow all origins for Socket.IO
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

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
    },
  });
});

// Store connected users and their rooms
const connectedUsers = new Map();
const rooms = new Map();

// Helper function to update room state for all users in a room
function updateRoomStateForAll(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    io.to(roomId).emit("room-state", {
      users: room.users,
    });
  }
}

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on("join-room", (data) => {
    const { roomId, username } = data;

    // Check if user is already in a room and leave it first
    const existingUser = connectedUsers.get(socket.id);
    if (existingUser && existingUser.roomId !== roomId) {
      // Leave existing room
      socket.leave(existingUser.roomId);
      const existingRoom = rooms.get(existingUser.roomId);
      if (existingRoom) {
        existingRoom.users = existingRoom.users.filter(
          (u) => u.socketId !== socket.id
        );
        if (existingRoom.users.length === 0) {
          rooms.delete(existingUser.roomId);
        } else {
          updateRoomStateForAll(existingUser.roomId);
        }
      }
    }

    // Add user to new room
    socket.join(roomId);

    // Store user info
    connectedUsers.set(socket.id, {
      username,
      roomId,
      socketId: socket.id,
    });

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: [],
      });
    }

    // Check if user is already in this room
    const room = rooms.get(roomId);
    const existingUserInRoom = room.users.find((u) => u.socketId === socket.id);

    if (!existingUserInRoom) {
      // Add user to room's user list only if not already there
      room.users.push({
        username,
        socketId: socket.id,
      });

      // Notify others in the room
      socket.to(roomId).emit("user-joined", {
        username,
        socketId: socket.id,
        totalUsers: room.users.length,
      });

      // Update room state for all users in the room
      updateRoomStateForAll(roomId);
    }

    console.log(`${username} joined room: ${roomId}`);
  });

  // Handle chat messages
  socket.on("send-message", (data) => {
    const { roomId, message } = data;
    const user = connectedUsers.get(socket.id);

    if (user && user.roomId === roomId) {
      const messageData = {
        id: Date.now(),
        username: user.username,
        message,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to all users in the room including sender
      io.to(roomId).emit("new-message", messageData);
    }
  });

  // Handle user typing indicator
  socket.on("typing", (data) => {
    const { roomId, isTyping } = data;
    const user = connectedUsers.get(socket.id);

    if (user && user.roomId === roomId) {
      socket.to(roomId).emit("user-typing", {
        username: user.username,
        isTyping,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);

    if (user) {
      const room = rooms.get(user.roomId);
      if (room) {
        // Remove user from room
        room.users = room.users.filter((u) => u.socketId !== socket.id);

        // Remove room if empty
        if (room.users.length === 0) {
          rooms.delete(user.roomId);
        } else {
          // Notify remaining users
          socket.to(user.roomId).emit("user-left", {
            username: user.username,
            totalUsers: room.users.length,
          });

          // Update room state for remaining users
          updateRoomStateForAll(user.roomId);
        }
      }

      connectedUsers.delete(socket.id);
      console.log(`${user.username} disconnected from room: ${user.roomId}`);
    }
  });

  // Handle room leave
  socket.on("leave-room", () => {
    const user = connectedUsers.get(socket.id);

    if (user) {
      socket.leave(user.roomId);

      const room = rooms.get(user.roomId);
      if (room) {
        room.users = room.users.filter((u) => u.socketId !== socket.id);

        if (room.users.length === 0) {
          rooms.delete(user.roomId);
        } else {
          socket.to(user.roomId).emit("user-left", {
            username: user.username,
            totalUsers: room.users.length,
          });

          // Update room state for remaining users
          updateRoomStateForAll(user.roomId);
        }
      }

      connectedUsers.delete(socket.id);
      console.log(`${user.username} left room: ${user.roomId}`);
    }
  });
});

// API Routes
app.get("/api/rooms", (req, res) => {
  const roomList = Array.from(rooms.keys()).map((roomId) => ({
    roomId,
    userCount: rooms.get(roomId).users.length,
  }));
  res.json(roomList);
});

app.get("/api/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);

  if (room) {
    res.json({
      roomId,
      users: room.users,
    });
  } else {
    res.status(404).json({ error: "Room not found" });
  }
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

  res.json({
    status: "ok",
    connectedUsers: connectedUsers.size,
    activeRooms: rooms.size,
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
