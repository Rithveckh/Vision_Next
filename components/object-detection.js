'use client';

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/components/render-predictions";

let detectInterval = null;

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [detectionRunning, setDetectionRunning] = useState(false);
  const [statusText, setStatusText] = useState("Stopped");
  const [facingMode, setFacingMode] = useState("environment");
  const [detectionLogs, setDetectionLogs] = useState([]);
  const [detectionCount, setDetectionCount] = useState(0);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      const net = await cocoSSDLoad();
      setModel(net);
      setIsLoading(false);
    };

    tf.ready().then(loadModel);

    return () => clearInterval(detectInterval);
  }, []);

  const startDetection = (net) => {
    if (!net || detectionRunning) return;

    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 100);
    setDetectionRunning(true);
    setStatusText("Running...");
  };

  const stopDetection = () => {
    clearInterval(detectInterval);
    setDetectionRunning(false);
    setStatusText("Stopped");
  };

  const runObjectDetection = async (net) => {
    if (
      canvasRef.current &&
      webcamRef.current?.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      const detectedObjects = await net.detect(video, undefined, 0.6);
      const ctx = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, ctx);

      const newLogs = [];
      let newCount = 0;

      detectedObjects.forEach((obj) => {
        const timestamp = new Date().toLocaleTimeString();
        newLogs.push({
          object: obj.class,
          score: (obj.score * 100).toFixed(2) + "%",
          time: timestamp,
        });
        if (obj.class === "person") {
          newCount++;
          if (audioRef.current) audioRef.current.play();
        }
      });

      if (newLogs.length > 0) {
        setDetectionLogs((prevLogs) => [...prevLogs.slice(-49), ...newLogs]); // max 50 logs
        setDetectionCount((prev) => prev + newCount);
      }
    }
  };

  const toggleCamera = () => {
    stopDetection();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="mt-8 space-y-6">
      <audio ref={audioRef} src="/beep.mp3" preload="auto" />

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => startDetection(model)}
          disabled={detectionRunning || !model}
        >
          Start Detection
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={stopDetection}
          disabled={!detectionRunning}
        >
          Stop Detection
        </button>

        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={toggleCamera}
        >
          Toggle Camera
        </button>

        <div className="text-sm text-gray-600 font-semibold">
          Status:{" "}
          <span className={detectionRunning ? "text-green-600" : "text-red-500"}>
            {statusText}
          </span>
        </div>

        <div className="text-sm text-black font-semibold">
          Total Detections:{" "}
          <span className="text-blue-600">{detectionCount}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-xl font-bold text-center text-gray-600">
          Loading AI Model...
        </div>
      ) : (
        <>
          <div className="relative flex justify-center items-center border rounded-md overflow-hidden">
            <Webcam
              key={facingMode}
              ref={webcamRef}
              className="rounded-md w-full lg:h-[720px]"
              audio={false}
              videoConstraints={{ facingMode }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 z-10 w-full h-full"
            />
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Detection Logs</h2>
            <div className="overflow-auto max-h-60 border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-4 text-gray-600 text-left">Object</th>
                    <th className="py-2 px-4 text-gray-600 text-left">Confidence</th>
                    <th className="py-2 px-4 text-gray-600 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {detectionLogs.map((log, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-1 px-4">{log.object}</td>
                      <td className="py-1 px-4">{log.score}</td>
                      <td className="py-1 px-4">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ObjectDetection;
