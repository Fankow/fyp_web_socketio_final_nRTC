import React from "react";

function VideoPlayer({ videoUrl }) {
  return (
    <div className="video-player">
      {videoUrl ? (
        <video controls src={videoUrl} width="100%" />
      ) : (
        <p>Select a video to play</p>
      )}
    </div>
  );
}

export default VideoPlayer;
