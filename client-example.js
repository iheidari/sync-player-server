const io = require("socket.io-client");

// Connect to the server
const socket = io("http://localhost:3000");

// Connection event
socket.on("connect", () => {
  console.log("Connected to server");

  // Join a room
  socket.emit("join-room", {
    roomId: "test-room",
    username: "TestUser",
  });
});

// Listen for room state
socket.on("room-state", (data) => {
  console.log("Room state received:", data);
  console.log(
    "Users in room:",
    data.users.map((u) => u.username)
  );
});

// Listen for user joins
socket.on("user-joined", (data) => {
  console.log(`${data.username} joined the room`);
});

// Listen for user leaves
socket.on("user-left", (data) => {
  console.log(`${data.username} left the room`);
});

// Listen for new messages
socket.on("new-message", (data) => {
  console.log(`[${data.username}]: ${data.message}`);
});

// Listen for typing indicators
socket.on("user-typing", (data) => {
  if (data.isTyping) {
    console.log(`${data.username} is typing...`);
  }
});

// Disconnection event
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Error handling
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

// Example: Send a message after 5 seconds
setTimeout(() => {
  console.log("Sending message...");
  socket.emit("send-message", {
    roomId: "test-room",
    message: "Hello from the client example!",
  });
}, 5000);

// Example: Send another message after 10 seconds
setTimeout(() => {
  console.log("Sending another message...");
  socket.emit("send-message", {
    roomId: "test-room",
    message: "This is a test message from the Node.js client!",
  });
}, 10000);

// Cleanup on exit
process.on("SIGINT", () => {
  console.log("Disconnecting...");
  socket.disconnect();
  process.exit(0);
});
