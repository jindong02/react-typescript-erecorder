import React, { useEffect, useRef } from "react";

export default function ScreenBox() {
  const screenRef = useRef<HTMLVideoElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);

  const constraints = {
    video: {
      displaySurface: "monitor",
      width: { ideal: 1920, max: 1920 },
      height: { ideal: 1080, max: 1080 },
    },
  };

  useEffect(() => {
    // Function to start the screen sharing
    const startScreenShare = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
          constraints
        );
        if (screenRef.current) {
          screenRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing screen share:", error);
      }
    };
    startScreenShare();
  });

  const startScreenRecording = () => {
    const video = screenRef.current;
    const canvas = canvasElement.current;
    const context = canvas?.getContext("2d");

    if (
      canvas &&
      context &&
      video &&
      video.readyState >= video.HAVE_ENOUGH_DATA
    ) {
      const drawScreenCanvas = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.save();
        context.clearRect(0, 0, video.videoWidth, video.videoHeight);
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); // this is just a rough calculation to offset the webcam stream to bottom right

        requestAnimationFrame(drawScreenCanvas);
      };

      drawScreenCanvas();
    }
  };

  useEffect(() => {
    const timer = setTimeout(startScreenRecording, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div style={{ flex: 2, width: "50vw", padding: "10px" }}>
      <h3>Screen Share</h3>
      <canvas ref={canvasElement}></canvas>
      <video
        ref={screenRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "auto",
          border: "1px solid black",
          visibility: "hidden",
        }}
      />
    </div>
  );
}
