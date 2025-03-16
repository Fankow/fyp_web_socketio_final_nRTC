import React, { useEffect, useState } from "react";

function VideoList({ onVideoSelect }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  return (
    <div className="video-list">
      <h2>Available Videos</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.id} onClick={() => onVideoSelect(video.url)}>
            {video.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VideoList;
