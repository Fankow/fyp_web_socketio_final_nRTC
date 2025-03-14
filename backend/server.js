const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (update to specific ngrok URL for production)
    methods: ["GET", "POST"],
  },
});

// Serve the React app's static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.handshake.address);
  socket.on("frame", (data) => {
    io.emit("frame", data); // Broadcast frame to all clients
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Fallback to serve React app for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
