import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Camera,
  Upload,
  RotateCw,
  Check,
  X,
  Sparkles,
  Leaf,
} from "lucide-react";

interface CheckInCameraProps {
  destinationName: string;
  onPhotoCapture: (photoDataUrl: string) => void;
  onCancel: () => void;
  className?: string;
}

export const CheckInCamera: React.FC<CheckInCameraProps> = ({
  destinationName,
  onPhotoCapture,
  onCancel,
  className,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = React.useState<string | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [facingMode, setFacingMode] = React.useState<"user" | "environment">(
    "environment",
  );
  const [isDragOver, setIsDragOver] = React.useState(false);

  const dropAreaRef = React.useRef<HTMLDivElement>(null);

  // Start camera
  const startCamera = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setCameraError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      setCameraError(
        "ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้กล้องหรือลองใช้ HTTPS",
      );
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  // Stop camera
  const stopCamera = React.useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Toggle camera facing mode
  const toggleCamera = React.useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, [stopCamera]);

  // Capture photo from video
  const capturePhoto = React.useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Add eco-friendly frame overlay
    drawEcoFrame(context, canvas.width, canvas.height);

    // Get image data
    const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedPhoto(photoDataUrl);
  }, []);

  // Draw eco-friendly frame overlay
  const drawEcoFrame = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    // Save current state
    context.save();

    // Draw subtle green border
    context.strokeStyle = "#16a34a";
    context.lineWidth = 8;
    context.strokeRect(4, 4, width - 8, height - 8);

    // Draw corner decorations
    const cornerSize = 40;
    context.fillStyle = "#16a34a";

    // Top-left corner
    context.fillRect(10, 10, cornerSize, 4);
    context.fillRect(10, 10, 4, cornerSize);

    // Top-right corner
    context.fillRect(width - cornerSize - 10, 10, cornerSize, 4);
    context.fillRect(width - 14, 10, 4, cornerSize);

    // Bottom-left corner
    context.fillRect(10, height - 14, cornerSize, 4);
    context.fillRect(10, height - cornerSize - 10, 4, cornerSize);

    // Bottom-right corner
    context.fillRect(width - cornerSize - 10, height - 14, cornerSize, 4);
    context.fillRect(width - 14, height - cornerSize - 10, 4, cornerSize);

    // Add destination watermark
    context.fillStyle = "rgba(22, 163, 74, 0.9)";
    context.fillRect(10, height - 80, width - 20, 60);

    context.fillStyle = "white";
    context.font = "bold 24px Arial";
    context.textAlign = "center";
    context.fillText(
      `✓ Checked in at ${destinationName}`,
      width / 2,
      height - 45,
    );

    context.font = "16px Arial";
    context.fillText("Sustainable Tourism ♻️", width / 2, height - 20);

    // Restore state
    context.restore();
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  // Process uploaded file
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const photoDataUrl = e.target?.result as string;
      setCapturedPhoto(photoDataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Confirm photo
  const confirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
      stopCamera();
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  // Initialize camera on mount
  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  // Update camera when facing mode changes
  React.useEffect(() => {
    if (stream) {
      startCamera();
    }
  }, [facingMode, startCamera]);

  return (
    <Card
      className={cn(
        "w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
        className,
      )}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Check-in Photo
            </h3>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Leaf className="w-3 h-3 mr-1" />
            {destinationName}
          </Badge>
          <p className="text-sm text-green-700">
            Take a photo to confirm your visit and earn Green Miles!
          </p>
        </div>

        {/* Camera/Photo Display with Drag & Drop */}
        <div
          ref={dropAreaRef}
          className={cn(
            "relative rounded-lg overflow-hidden aspect-square transition-all duration-300",
            isDragOver
              ? "bg-green-100 border-4 border-dashed border-green-400"
              : "bg-black border-2 border-dashed border-gray-300"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {cameraError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              {/* Drag & Drop Area */}
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  📸 Drag & drop your check-in photo here
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  or click to upload from device
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="bg-white border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </Button>
              </div>
            </div>
          ) : capturedPhoto ? (
            <>
              <img
                src={capturedPhoto}
                alt="Captured check-in photo"
                className="w-full h-full object-cover"
              />
              {/* Drag overlay for replacing photo */}
              {isDragOver && (
                <div className="absolute inset-0 bg-green-400/80 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Drop to replace photo</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                    <p>Starting camera...</p>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Drag overlay */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-green-400/80 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Upload className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-medium">Drop photo to upload</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Camera viewfinder overlay */}
              {!isDragOver && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-green-400 rounded-lg"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              )}
            </>
          )}

          {/* Hidden canvas for photo processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {capturedPhoto ? (
            /* Photo confirmation controls */
            <div className="flex gap-3">
              <Button
                onClick={retakePhoto}
                variant="outline"
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                {isEnglish ? "Ready to Check-in?" : "พร้อมเช็คอินหรือยัง?"}
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                {isEnglish
                  ? "Take a photo or drag & drop an image to confirm your visit!"
                  : "ถ่ายรูปหรือลากไฟล์รูปมาวางเพื่อยืนยันการมาเยือน!"}
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <Upload className="w-3 h-3" />
                <span>Drag & Drop supported</span>
              </div>
            </div>
          </div>
          ) : (
            /* Camera controls */
            <div className="flex gap-3">
              <Button
                onClick={toggleCamera}
                variant="outline"
                size="sm"
                disabled={isLoading || !!cameraError}
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Flip
              </Button>

              <Button
                onClick={capturePhoto}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading || !!cameraError}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full text-gray-600"
          >
            Cancel Check-in
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};