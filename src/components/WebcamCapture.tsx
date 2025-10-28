"use client";
import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
  onError?: (error: string) => void;
}

export default function WebcamCapture({
  onCapture,
  onError,
}: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Constraints untuk kamera
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  // Capture foto
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  // Switch kamera (front/back)
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Start kamera
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
    } catch (error) {
      onError?.("Failed to access camera");
      console.error("Camera error:", error);
    }
  };

  // Stop kamera
  const stopCamera = () => {
    setIsCameraActive(false);
  };

  // Retake foto
  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Take Profile Photo
      </h3>

      {!isCameraActive ? (
        // Start Camera Button
        <div className="text-center">
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Camera
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Allow camera access when prompted
          </p>
        </div>
      ) : (
        // Camera Interface
        <div className="space-y-4">
          {!capturedImage ? (
            // Live Camera View
            <>
              <div className="relative rounded-lg overflow-hidden bg-black">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-64 object-cover"
                  mirrored={facingMode === "user"}
                />

                {/* Camera Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg" />
                </div>
              </div>

              {/* Camera Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={switchCamera}
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  title="Switch Camera"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>

                <button
                  onClick={capture}
                  className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Take Photo"
                >
                  <div className="w-8 h-8 bg-white rounded-full" />
                </button>

                <button
                  onClick={stopCamera}
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  title="Close Camera"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Position your face in the frame and click the red button to
                capture
              </p>
            </>
          ) : (
            // Preview Captured Image
            <>
              <div className="relative rounded-lg overflow-hidden bg-black">
                <img
                  src={capturedImage}
                  alt="Captured profile"
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Preview Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={retake}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Retake
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Use This Photo
                </button>
              </div>

              <p className="text-center text-sm text-green-600 font-medium">
                ✓ Photo captured successfully!
              </p>
            </>
          )}
        </div>
      )}

      {/* Camera Permission Error */}
      {!isCameraActive && capturedImage === null && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Camera access is required to take profile photos. Please allow
            camera permissions.
          </p>
        </div>
      )}
    </div>
  );
}
