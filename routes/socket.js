const socketIo = require("socket.io");

// Store connected users and their rooms
const connectedUsers = new Map();
const rooms = new Map();

// Helper function to update room state for all users in a room
function updateRoomStateForAll(io, roomId) {
  const room = rooms.get(roomId);
  if (room) {
    io.to(roomId).emit("room-state", {
      users: room.users,
    });
  }
}

// Initialize Socket.IO
function initializeSocket(server) {
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
            updateRoomStateForAll(io, existingUser.roomId);
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
      const existingUserInRoom = room.users.find(
        (u) => u.socketId === socket.id
      );

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
        updateRoomStateForAll(io, roomId);
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
            updateRoomStateForAll(io, user.roomId);
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
            updateRoomStateForAll(io, user.roomId);
          }
        }

        connectedUsers.delete(socket.id);
        console.log(`${user.username} left room: ${user.roomId}`);
      }
    });
  });

  return io;
}

// Socket.IO Room Management Routes (for real-time room state)
function setupSocketRoutes(app) {
  app.get("/api/socket/rooms", (req, res) => {
    const roomList = Array.from(rooms.keys()).map((roomId) => ({
      roomId,
      userCount: rooms.get(roomId).users.length,
    }));
    res.json(roomList);
  });

  app.get("/api/socket/rooms/:roomId", (req, res) => {
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
}

// Get socket statistics for health check
function getSocketStats() {
  return {
    connectedUsers: connectedUsers.size,
    activeRooms: rooms.size,
  };
}

module.exports = {
  initializeSocket,
  setupSocketRoutes,
  getSocketStats,
};
