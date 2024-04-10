import React, { useEffect, useRef } from "react";

import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

import { STATE, createDetector } from "../shared/params";
import { drawResults } from "../shared/util";

export default function CameraBox() {
  const cam = useRef<HTMLVideoElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const { targetFPS } = STATE.camera;

  useEffect(() => {
    // Function to start the camera stream
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            // Only setting the video to a specified size for large screen, on
            // mobile devices accept the default size.
            frameRate: {
              ideal: targetFPS,
            },
          },
          audio: false,
        });

        const camera = cam.current;
        if (camera) {
          camera.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
    startCamera();
  });

  const runFaceDetection = async () => {
    try {
      const video = cam.current;
      const canvas = canvasElement.current;
      const context = canvas?.getContext("2d");
      const detector = await createDetector();

      if (canvas && video && video.readyState >= video.HAVE_ENOUGH_DATA) {
        const estimationConfig = { flipHorizontal: false };
        const detectFaces = async () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const faces = await detector.estimateFaces(video, estimationConfig);
          context?.clearRect(0, 0, canvas?.width || 300, canvas?.height || 300);
          context?.drawImage(
            video,
            0,
            0,
            canvas?.width || 300,
            canvas?.height || 300
          );

          if (context && faces.length > 0) {
            drawResults(context, faces, true, true);
          }

          requestAnimationFrame(detectFaces);
        };

        detectFaces();
      }
    } catch (error) {
      console.error("Error running face detection:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(runFaceDetection, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div style={{ flex: 1, width: "50vw", padding: "10px" }}>
      <h3>Camera Stream</h3>
      <canvas ref={canvasElement}></canvas>
      <video
        ref={cam}
        autoPlay
        playsInline
        muted
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
