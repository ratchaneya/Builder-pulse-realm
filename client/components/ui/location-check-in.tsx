import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckInCamera } from "./check-in-camera";
import { HeroPopup, checkInHeroes } from "./hero-popup";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Camera,
  Trophy,
  Sparkles,
  CheckCircle,
  Clock,
  Target,
  Scan,
  Star,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Share2,
  RotateCcw,
  Award,
  Gift,
  Heart,
} from "lucide-react";

interface CheckInLocation {
  id: string;
  name: string;
  nameEn: string;
  coordinates: { lat: number; lng: number };
  distance: number; // meters from user
  heroId?: string;
  greenMilesReward: number;
  isVisited?: boolean;
}

interface LocationCheckInProps {
  location: CheckInLocation;
  onCheckInComplete: (
    locationId: string,
    photoDataUrl: string,
    greenMiles: number,
  ) => void;
  onCancel: () => void;
  className?: string;
  language?: "th" | "en";
}

export const LocationCheckIn: React.FC<LocationCheckInProps> = ({
  location,
  onCheckInComplete,
  onCancel,
  className,
  language = "th",
}) => {
  const [step, setStep] = React.useState<
    "arrival" | "camera" | "hero" | "ar-experience" | "complete"
  >("arrival");
  const [capturedPhoto, setCapturedPhoto] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [arState, setArState] = React.useState<
    "scanning" | "marker_found" | "story" | "completed"
  >("scanning");
  const [isLanguageThai, setIsLanguageThai] = React.useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const [isAudioMuted, setIsAudioMuted] = React.useState(false);
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(
    null,
  );
  const [markerDetected, setMarkerDetected] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const isEnglish = language === "en";
  const locationName = isEnglish ? location.nameEn : location.name;
  const hero = location.heroId ? checkInHeroes[location.heroId] : null;

  // Handle photo capture
  const handlePhotoCapture = async (photoDataUrl: string) => {
    setIsProcessing(true);
    setCapturedPhoto(photoDataUrl);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Award Green Miles
      const response = await fetch("/api/green-miles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check_in",
          locationId: location.id,
          greenMiles: location.greenMilesReward,
          photoData: photoDataUrl,
        }),
      });

      if (response.ok) {
        // Show hero popup if available
        if (hero) {
          setStep("hero");
        } else {
          setStep("complete");
        }
      } else {
        throw new Error("Failed to process check-in");
      }
    } catch (error) {
      console.error("Check-in error:", error);
      alert(
        isEnglish
          ? "Check-in failed. Please try again."
          : "การเช็คอินล้มเหลว กรุณาลองใหม่",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle hero popup close - start AR experience
  const handleHeroClose = () => {
    setStep("ar-experience");
    initializeARCamera();
  };

  // Initialize AR camera
  const initializeARCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate AR marker detection
      setTimeout(() => {
        setMarkerDetected(true);
        setArState("marker_found");

        setTimeout(() => {
          setArState("story");
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error("AR Camera access failed:", error);
      // Skip to completion if camera fails
      setStep("complete");
    }
  };

  // Stop AR camera
  const stopARCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Audio controls
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  // Complete AR experience
  const completeARExperience = () => {
    setArState("completed");
    stopARCamera();
    setTimeout(() => {
      setStep("complete");
    }, 2000);
  };

  // Cleanup camera on unmount
  React.useEffect(() => {
    return () => {
      stopARCamera();
    };
  }, [cameraStream]);

  // Handle check-in completion
  const handleComplete = () => {
    if (capturedPhoto) {
      onCheckInComplete(location.id, capturedPhoto, location.greenMilesReward);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isEnglish
            ? `Checked in at ${location.nameEn}`
            : `เช็คอินที่ ${location.name}`,
          text: isEnglish
            ? `I just visited ${location.nameEn} and earned ${location.greenMilesReward} Green Miles! 🌱`
            : `เพิ่งไปเที่ยว${location.name} ได้ ${location.greenMilesReward} Green Miles! 🌱`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // Fallback for browsers without native share
      const shareText = isEnglish
        ? `I just checked in at ${location.nameEn} and earned ${location.greenMilesReward} Green Miles! 🌱 #SustainableTourism #ChiangMai`
        : `เพิ่งเช็คอินที่ ${location.name} ได้ ${location.greenMilesReward} Green Miles! 🌱 #การท่องเที่ยวยั่งยืน #เชียงใหม่`;

      navigator.clipboard?.writeText(shareText);
      alert(
        isEnglish
          ? "Share text copied to clipboard!"
          : "คัดลอกข้อความแชร์แล้ว!",
      );
    }
  };

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-sm mx-auto bg-white">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isEnglish ? "Processing Check-in..." : "กำลังประมวลผล..."}
            </h3>
            <p className="text-sm text-gray-600">
              {isEnglish
                ? "Verifying location and awarding Green Miles"
                : "กำลังตรวจสอบตำแหน่งและให้คะแนน Green Miles"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show camera component
  if (step === "camera") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <CheckInCamera
          destinationName={locationName}
          onPhotoCapture={handlePhotoCapture}
          onCancel={() => setStep("arrival")}
        />
      </div>
    );
  }

  // Show hero popup
  if (step === "hero" && hero) {
    return (
      <HeroPopup
        hero={hero}
        locationName={location.name}
        locationNameEn={location.nameEn}
        greenMilesEarned={location.greenMilesReward}
        onClose={handleHeroClose}
        onShare={handleShare}
        language={language}
      />
    );
  }

  // Show completion screen
  if (step === "complete") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card
          className={cn(
            "w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
            className,
          )}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                {isEnglish ? "Check-in Successful!" : "เช็คอินสำเร็จ!"}
              </h3>
              <p className="text-green-700">
                {isEnglish
                  ? `You've successfully checked in at ${location.nameEn}`
                  : `คุณเช็คอินที่ ${location.name} สำเร็จแล้ว`}
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span className="font-bold text-lg text-yellow-800">
                  +{location.greenMilesReward} Green Miles
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                {isEnglish
                  ? "Keep exploring eco-friendly destinations!"
                  : "ไปสำรวจสถานที่เพื่อสิ่งแวดล้อมต่อ!"}
              </p>
            </div>

            {capturedPhoto && (
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <img
                  src={capturedPhoto}
                  alt="Check-in photo"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <p className="text-xs text-green-600">
                  {isEnglish
                    ? "Your check-in photo has been saved"
                    : "บันทึกรูปเช็คอินของคุณแล้ว"}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isEnglish ? "Share" : "แชร์"}
              </Button>

              <Button
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isEnglish ? "Continue" : "ดำเนินการต่อ"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show arrival confirmation (default step)
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        className={cn(
          "w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 animate-in zoom-in-95 duration-300",
          className,
        )}
      >
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900">
              {isEnglish ? "You've Arrived!" : "คุณมาถึงจุดหมายแล้ว!"}
            </h3>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <MapPin className="w-3 h-3 mr-1" />
              {locationName}
            </Badge>
          </div>

          {/* Location Info */}
          <div className="bg-white border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">
                {isEnglish ? "Distance from you:" : "ระยะทางจากคุณ:"}
              </span>
              <span className="font-medium text-green-900">
                {Math.round(location.distance)}m
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">
                {isEnglish ? "Green Miles Reward:" : "รางวัล Green Miles:"}
              </span>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                <Trophy className="w-3 h-3 mr-1" />+{location.greenMilesReward}
              </Badge>
            </div>

            {location.isVisited && (
              <div className="flex items-center justify-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-2">
                <Clock className="w-4 h-4" />
                {isEnglish ? "Previously visited" : "เคยมาแล้ว"}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Camera className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  {isEnglish ? "Ready to Check-in?" : "พร้อมเช็คอินหรือยัง?"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isEnglish
                    ? "Take a photo to confirm your visit and earn Green Miles!"
                    : "ถ่ายรูปเพื่อยืนยันการมาเยือนและรับ Green Miles!"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-300"
            >
              {isEnglish ? "Not Now" : "ไว้ทีหลัง"}
            </Button>

            <Button
              onClick={() => setStep("camera")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isEnglish ? "Check-in Now" : "เช็คอินเลย"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
