import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

// Replace with your ngrok URL after starting ngrok
const socket = io("https://7b25-218-102-205-108.ngrok-free.app"); // Update to ngrok URL later

function App() {
  const [frame, setFrame] = useState("");

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
      <div className="video-container">
        {frame ? (
          <img src={frame} alt="Live Feed" className="video-feed" />
        ) : (
          <p>Waiting for stream...</p>
        )}
      </div>
    </div>
  );
}

export default App;
