import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function CameraTest() {
  const [cameraStatus, setCameraStatus] = useState<
    "idle" | "requesting" | "granted" | "denied" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isHttps, setIsHttps] = useState(false);
  const [cameraInfo, setCameraInfo] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsHttps(
      location.protocol === "https:" || location.hostname === "localhost",
    );
  }, []);

  const testCamera = async () => {
    setCameraStatus("requesting");
    setErrorMessage("");

    try {
      // Check HTTPS
      if (!isHttps) {
        throw new Error("HTTPS_REQUIRED");
      }

      // Check getUserMedia support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("NO_GETUSERMEDIA");
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 960, min: 480 },
        },
      });

      if (stream && stream.getVideoTracks().length > 0) {
        setCameraStatus("granted");
        streamRef.current = stream;

        // Get camera info
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        const capabilities = videoTrack.getCapabilities
          ? videoTrack.getCapabilities()
          : {};

        setCameraInfo({
          label: videoTrack.label,
          settings,
          capabilities,
        });

        // Display video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        throw new Error("NO_VIDEO_TRACKS");
      }
    } catch (error: any) {
      setCameraStatus("error");

      let message = "";
      switch (error.message || error.name) {
        case "HTTPS_REQUIRED":
          message =
            "ต้องใช้ HTTPS เพื่อเข้าถึงกล้อง กรุณาใช้ลิงก์ปลอดภัย (https://)";
          break;
        case "NO_GETUSERMEDIA":
          message =
            "เบราว์เซอร์ไม่รองรับการเข้าถึงกล้อง กรุณาใช้ Chrome, Firefox, หรือ Safari";
          break;
        case "NotAllowedError":
          message = 'คุณไม่อนุญาตให้เข้าถึงกล้อง กรุณาคลิก "อนุญาต" และลองใหม่';
          break;
        case "NotFoundError":
          message = "ไม่พบกล้องในอุปกรณ์นี้";
          break;
        case "NotReadableError":
          message = "กล้องถูกใช้งานโดยแอปอื่น กรุณาปิดแอปกล้องอื่น ๆ";
          break;
        case "NotSupportedError":
          message = "เบราว์เซอร์ไม่รองรับ WebRTC";
          break;
        default:
          message = `เกิดข้อผิดพลาด: ${error.message || error.name || "Unknown error"}`;
      }

      setErrorMessage(message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus("idle");
    setCameraInfo(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-md mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            ทดสอบกล้อง AR
          </h1>

          {/* HTTPS Status */}
          <div
            className="flex items-center gap-2 p-3 rounded-lg mb-4"
            style={{ backgroundColor: isHttps ? "#dcfce7" : "#fef2f2" }}
          >
            {isHttps ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <div className="font-medium">
                {isHttps ? "✅ HTTPS: พร้อมใช้งาน" : "❌ HTTPS: จำเป็นต้องใช้"}
              </div>
              <div className="text-sm opacity-75">URL: {location.href}</div>
            </div>
          </div>

          {/* Camera Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {cameraStatus === "idle" && (
                <Camera className="h-5 w-5 text-gray-500" />
              )}
              {cameraStatus === "requesting" && (
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              )}
              {cameraStatus === "granted" && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {cameraStatus === "error" && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}

              <span className="font-medium">
                {cameraStatus === "idle" && "พร้อมทดสอบกล้อง"}
                {cameraStatus === "requesting" &&
                  "กำลังขอสิทธิ์เข้าถึงกล้อง..."}
                {cameraStatus === "granted" && "เข้าถึงกล้องสำเร็จ!"}
                {cameraStatus === "error" && "เกิดข้อผิดพลาด"}
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                {errorMessage}
              </div>
            )}

            {/* Video Preview */}
            {cameraStatus === "granted" && (
              <div className="space-y-3">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-gray-100"
                  style={{ maxHeight: "300px" }}
                />

                {cameraInfo && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <div className="font-medium text-green-800 mb-2">
                      ข้อมูลกล้อง:
                    </div>
                    <div className="space-y-1 text-green-700">
                      <div>📷 {cameraInfo.label || "ไม่ระบุชื่อ"}</div>
                      <div>
                        📐 {cameraInfo.settings?.width || "?"} x{" "}
                        {cameraInfo.settings?.height || "?"}
                      </div>
                      <div>
                        🎯 {cameraInfo.settings?.facingMode || "ไม่ระบุ"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {cameraStatus === "idle" || cameraStatus === "error" ? (
                <Button
                  onClick={testCamera}
                  className="flex-1"
                  disabled={!isHttps}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  ทดสอบกล้อง
                </Button>
              ) : (
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="flex-1"
                >
                  หยุดกล้อง
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">คำแนะนำ:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div>1. ตรวจสอบว่า URL ขึ้นต้นด้วย https://</div>
            <div>2. อนุญาตเข้าถึงกล้องเมื่อเบราว์เซอร์ถาม</div>
            <div>3. ใช้ Chrome, Firefox, หรือ Safari</div>
            <div>4. ปิดแอปกล้องอื่น ๆ ก่อนทดสอบ</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
