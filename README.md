# Room Management Server

A Socket.IO server for real-time room management and collaboration.

## Features

- **Room-based Collaboration**: Create and join rooms for group sessions
- **User Presence**: Track who's online and their activities
- **Chat System**: Real-time messaging within rooms
- **Typing Indicators**: Show when users are typing messages
- **Room Status**: Monitor room information and user counts

## Quick Start

### Backend (Render)

1. **Deploy the backend to Render:**

   ```bash
   # Follow the deployment guide in DEPLOYMENT.md
   ```

2. **Your backend will be available at:**
   ```
   https://your-app-name.onrender.com
   ```

### Frontend (Vercel)

1. **Deploy the frontend to Vercel:**

   - Copy the files from `public/` directory
   - Update `config.js` with your Render backend URL
   - Deploy to Vercel

2. **Your frontend will be available at:**

   ```
   https://your-app-name.vercel.app
   ```

3. **For detailed frontend deployment instructions, see:**
   ```
   FRONTEND_DEPLOYMENT.md
   ```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (optional):

```bash
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

3. Start the server:

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### REST API

- `GET /api/health` - Server health check
- `GET /api/rooms` - List all active rooms
- `GET /api/rooms/:roomId` - Get specific room details

### Socket.IO Events

#### Client to Server

- `join-room` - Join a room

  ```javascript
  {
    roomId: "room-123",
    username: "John"
  }
  ```

- `send-message` - Send a chat message

  ```javascript
  {
    roomId: "room-123",
    message: "Hello everyone!"
  }
  ```

- `typing` - Typing indicator

  ```javascript
  {
    roomId: "room-123",
    isTyping: true
  }
  ```

- `leave-room` - Leave the current room

#### Server to Client

- `room-state` - Current room state when joining
- `user-joined` - New user joined the room
- `user-left` - User left the room
- `new-message` - New chat message
- `user-typing` - User typing indicator

## Client Integration Example

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:3000");

// Join a room
socket.emit("join-room", {
  roomId: "my-room",
  username: "Alice",
});

// Listen for room state
socket.on("room-state", (data) => {
  console.log("Room users:", data.users);
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

// Send a message
socket.emit("send-message", {
  roomId: "my-room",
  message: "Hello everyone!",
});
```

## Room Management

Rooms are automatically created when the first user joins and deleted when the last user leaves. Each room maintains:

- List of connected users
- Real-time user presence updates

## Error Handling

The server includes basic error handling for:

- Invalid room operations
- User disconnections
- Socket connection issues

## Production Considerations

1. **CORS Configuration**: Update `CORS_ORIGIN` in your environment variables
2. **Rate Limiting**: Consider adding rate limiting for production
3. **Authentication**: Add user authentication if needed
4. **Database**: Consider persisting room data for larger scale
5. **Load Balancing**: Use Redis adapter for multiple server instances

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (when implemented)
npm test
```

## License

ISC
