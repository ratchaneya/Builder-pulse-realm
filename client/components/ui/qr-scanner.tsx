import { useState, useRef, useEffect } from "react";
import { Camera, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QRScannerProps {
  onScanSuccess: (qrCode: string) => void;
  onClose: () => void;
  isOpen: boolean;
  className?: string;
}

export function QRScanner({
  onScanSuccess,
  onClose,
  isOpen,
  className,
}: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && !scanning) {
      startScanning();
    } else if (!isOpen && streamRef.current) {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);

        // Simulate QR code detection (in real app, use a QR library like jsQR)
        setTimeout(() => {
          simulateQRDetection();
        }, 3000);
      }
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.");
      console.error("Error accessing camera:", err);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const simulateQRDetection = () => {
    // Mock QR codes for different locations
    const mockQRCodes = [
      "AR_DOI_SUTHEP_ECO",
      "AR_MAE_RIM_ORGANIC",
      "AR_SAN_KAMPHAENG_CRAFT",
    ];

    const randomQR =
      mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    onScanSuccess(randomQR);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between text-white">
        <h2 className="font-semibold">Scan QR Code</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative">
        {scanning && !error ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanner Frame */}
                <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>

                  {/* Scanning Line */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-green-400 animate-pulse"></div>
                </div>

                {/* Instructions */}
                <p className="text-white text-center mt-4 bg-black/50 px-4 py-2 rounded-lg">
                  Point camera at destination QR code
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            {error ? (
              <Card className="p-6 m-4 text-center max-w-sm">
                <div className="text-red-500 mb-4">
                  <Camera className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Camera Access Required</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={startScanning} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </Card>
            ) : (
              <div className="text-center text-white">
                <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Initializing camera...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-black/80 backdrop-blur-sm p-4">
        <div className="container max-w-md mx-auto space-y-3">
          <div className="text-center text-white text-sm">
            <p>
              Scan the QR code at your destination to unlock the AR experience
            </p>
          </div>

          {/* Mock QR Options for Demo */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => onScanSuccess("AR_DOI_SUTHEP_ECO")}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Doi Suthep
            </Button>
            <Button
              onClick={() => onScanSuccess("AR_MAE_RIM_ORGANIC")}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Mae Rim
            </Button>
            <Button
              onClick={() => onScanSuccess("AR_SAN_KAMPHAENG_CRAFT")}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              San Kamphaeng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
