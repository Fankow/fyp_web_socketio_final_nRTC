require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { google } = require("googleapis");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Google Drive API setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_PATH,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = google.drive({ version: "v3", auth });

// Serve React app static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API endpoint to fetch video list from Google Drive
app.get("/api/videos", async (req, res) => {
  const folderId = "16gNhmALfjDGkLumAcNAPzHIkvSs1OSi7"; // Replace with your VIDEOS folder ID
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents mimeType contains 'video/'`,
      fields: "files(id, name, mimeType)",
    });
    const videos = response.data.files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `/api/stream/${file.id}`, // Proxy streaming URL
    }));
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json([]);
  }
});

// API endpoint to stream video from Google Drive
app.get("/api/stream/:id", async (req, res) => {
  const fileId = req.params.id;
  try {
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );
    res.setHeader("Content-Type", "video/mp4");
    response.data.pipe(res);
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).send("Error streaming video");
  }
});

// Socket.IO for live stream
io.on("connection", (socket) => {
  console.log("Client connected:", socket.handshake.address);
  socket.on("frame", (data) => {
    io.emit("frame", data);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Fallback to serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
