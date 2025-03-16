import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import VideoList from "./VideoList";
import VideoPlayer from "./VideoPlayer";
import "./App.css";

// Replace with ngrok URL when running online
const socket = io("http://localhost:3000");

function App() {
  const [frame, setFrame] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("connect_error", (err) =>
      console.error("Connection error:", err)
    );
    socket.on("frame", (data) => {
      setFrame(`data:image/jpeg;base64,${data}`);
    });

    return () => {
      socket.off("frame");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className="App">
      <h1>Raspberry Pi Live Stream with YOLOv11</h1>
      <div className="content">
        <div className="live-stream">
          <h2>Live Stream</h2>
          {frame ? (
            <img src={frame} alt="Live Feed" className="video-feed" />
          ) : (
            <p>Waiting for stream...</p>
          )}
        </div>
        <div className="video-section">
          <VideoList onVideoSelect={setSelectedVideo} />
          <VideoPlayer videoUrl={selectedVideo} />
        </div>
      </div>
    </div>
  );
}

export default App;
