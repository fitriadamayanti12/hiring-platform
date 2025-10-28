// src/components/WebcamWithGesture.tsx
"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

export default function WebcamWithGesture({
  onCapture,
  onError,
}: {
  onCapture: (image: string) => void;
  onError?: (error: string) => void;
}) {
  const webcamRef = useRef<Webcam>(null);
  const [detectedPoses, setDetectedPoses] = useState<number[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Simulate REAL gesture detection dengan event listeners
  useEffect(() => {
    if (!isDetecting) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Simulate gesture detection dengan keyboard
      // Dalam real implementation, ini akan diganti dengan ML model
      if (event.key === "1" || event.key === "2" || event.key === "3") {
        const pose = parseInt(event.key);
        
        if (!detectedPoses.includes(pose)) {
          const newPoses = [...detectedPoses, pose];
          setDetectedPoses(newPoses);
          
          // Update feedback
          const poseNames = ["", "✋ Palm", "👈 Point", "👍 Thumb"];
          setFeedback(`Detected: ${poseNames[pose]}`);
          
          // Auto capture setelah 3 poses unik terdeteksi
          if (newPoses.length >= 3) {
            setTimeout(() => {
              capturePhoto();
              setIsDetecting(false);
              setFeedback("✅ All gestures detected! Photo captured.");
            }, 1000);
          }
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [isDetecting, detectedPoses, onCapture]);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  const startGestureDetection = () => {
    setDetectedPoses([]);
    setFeedback("Show hand gestures: 1.✋ 2.👈 3.👍 (Press keys 1,2,3)");
    setIsDetecting(true);
  };

  const stopGestureDetection = () => {
    setIsDetecting(false);
    setDetectedPoses([]);
    setFeedback("");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Advanced Gesture Photo Capture
      </h3>

      <div className="space-y-4">
        {/* Camera View */}
        <div className="relative rounded-lg overflow-hidden bg-black">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-64 object-cover"
            videoConstraints={{
              facingMode: "user",
            }}
            onUserMediaError={(error) => {
              console.error("Webcam error:", error);
              onError?.("Failed to access camera. Please check permissions.");
            }}
          />

          {/* Gesture Progress */}
          {isDetecting && (
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      detectedPoses.includes(num) 
                        ? "bg-green-500" 
                        : "bg-gray-600"
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions & Feedback */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            {feedback || "Detect 3 unique hand gestures to auto-capture"}
          </p>

          {isDetecting && (
            <div className="flex justify-center space-x-6 text-2xl">
              <div className="text-center">
                <div>✋</div>
                <div className="text-xs text-gray-500">Press 1</div>
              </div>
              <div className="text-center">
                <div>👈</div>
                <div className="text-xs text-gray-500">Press 2</div>
              </div>
              <div className="text-center">
                <div>👍</div>
                <div className="text-xs text-gray-500">Press 3</div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800 text-center">
            <strong>Note:</strong> In production, this would use TensorFlow.js + 
            HandPose model for real gesture detection. Currently simulating with 
            keyboard for demo purposes.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isDetecting ? (
            <>
              <button
                type="button"
                onClick={startGestureDetection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Gesture Detection
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Manual Capture
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={stopGestureDetection}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Stop Detection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}