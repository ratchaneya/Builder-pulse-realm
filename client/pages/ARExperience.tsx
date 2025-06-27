import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Star,
  Volume2,
  VolumeX,
  Gift,
  Droplets,
  Recycle,
  Leaf,
  Award,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ARLocation {
  id: string;
  name: string;
  description: string;
  localHero: {
    name: string;
    story: string;
    videoUrl: string;
    audioUrl: string;
  };
  ecoElements: {
    waterRefill: boolean;
    compostBin: boolean;
    zeroWaste: boolean;
    solarPower: boolean;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

const arLocations: Record<string, ARLocation> = {
  doi_suthep: {
    id: "doi_suthep",
    name: "Doi Suthep National Park",
    description:
      "Sacred mountain temple with stunning city views and commitment to environmental preservation. This temple has been carbon-neutral since 2020.",
    localHero: {
      name: "Monk Thich Minh An",
      story:
        "Led the temple's transformation to solar power and zero-waste practices, inspiring 50+ temples across Thailand to follow sustainable practices.",
      videoUrl: "/videos/monk-hero.mp4",
      audioUrl: "/audio/monk-story.mp3",
    },
    ecoElements: {
      waterRefill: true,
      compostBin: true,
      zeroWaste: true,
      solarPower: true,
    },
    coordinates: { lat: 18.8047, lng: 98.9284 },
  },
  mae_rim: {
    id: "mae_rim",
    name: "Mae Rim Organic Farm",
    description:
      "Pioneering organic farming and permaculture education center. Demonstrates sustainable agriculture practices to over 1000 visitors monthly.",
    localHero: {
      name: "Farmer Somchai",
      story:
        "Converted 50 hectares from chemical farming to organic methods, increased biodiversity by 300% and created jobs for 15 local families.",
      videoUrl: "/videos/farmer-hero.mp4",
      audioUrl: "/audio/farmer-story.mp3",
    },
    ecoElements: {
      waterRefill: true,
      compostBin: true,
      zeroWaste: true,
      solarPower: true,
    },
    coordinates: { lat: 18.9167, lng: 98.8833 },
  },
  san_kamphaeng: {
    id: "san_kamphaeng",
    name: "San Kamphaeng Handicrafts Village",
    description:
      "Traditional artisan community using only natural materials and ancient techniques. Zero chemical dyes, 100% renewable energy.",
    localHero: {
      name: "Artisan Malee",
      story:
        "Preserved traditional weaving techniques and trained 200+ young artisans in sustainable craft-making using only natural dyes from local plants.",
      videoUrl: "/videos/artisan-hero.mp4",
      audioUrl: "/audio/artisan-story.mp3",
    },
    ecoElements: {
      waterRefill: true,
      compostBin: true,
      zeroWaste: true,
      solarPower: false,
    },
    coordinates: { lat: 18.745, lng: 99.1167 },
  },
};

export default function ARExperience() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location") || "doi_suthep";

  const [arStarted, setArStarted] = useState(false);
  const [location, setLocation] = useState<ARLocation | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLocalHero, setShowLocalHero] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [arElementsVisible, setArElementsVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const arSceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loc = arLocations[locationId];
    if (loc) {
      setLocation(loc);
      // Simulate arrival confirmation
      setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
    }
  }, [locationId]);

  useEffect(() => {
    if (arStarted) {
      loadARFramework();
    }
  }, [arStarted]);

  const loadARFramework = async () => {
    try {
      // Load AR.js framework
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/ar.js@3.4.5/aframe/build/aframe-ar.js";
      script.onload = () => {
        initializeARScene();
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error("Error loading AR framework:", error);
    }
  };

  const initializeARScene = () => {
    if (!arSceneRef.current || !location) return;

    // Create AR scene
    const scene = document.createElement("a-scene");
    scene.setAttribute("embedded", "");
    scene.setAttribute("arjs", "sourceType: webcam; debugUIEnabled: false;");
    scene.style.width = "100%";
    scene.style.height = "100%";

    // Create welcome text
    const welcomeText = document.createElement("a-text");
    welcomeText.setAttribute("position", "0 2 -3");
    welcomeText.setAttribute("scale", "2 2 2");
    welcomeText.setAttribute("color", "#4CAF50");
    welcomeText.setAttribute("align", "center");
    welcomeText.setAttribute("value", `Welcome to ${location.name}!`);
    welcomeText.setAttribute(
      "animation",
      "property: rotation; to: 0 360 0; loop: true; dur: 10000",
    );
    scene.appendChild(welcomeText);

    // Create location description
    const descText = document.createElement("a-text");
    descText.setAttribute("position", "0 1 -3");
    descText.setAttribute("scale", "1 1 1");
    descText.setAttribute("color", "#2E7D32");
    descText.setAttribute("align", "center");
    descText.setAttribute("width", "6");
    descText.setAttribute("value", location.description);
    scene.appendChild(descText);

    // Create eco-elements
    if (location.ecoElements.waterRefill) {
      const waterIcon = document.createElement("a-box");
      waterIcon.setAttribute("position", "-2 0.5 -2");
      waterIcon.setAttribute("rotation", "0 45 0");
      waterIcon.setAttribute("color", "#2196F3");
      waterIcon.setAttribute("scale", "0.3 0.6 0.3");
      waterIcon.setAttribute(
        "animation",
        "property: position; to: -2 1 -2; dir: alternate; loop: true; dur: 2000",
      );
      scene.appendChild(waterIcon);

      const waterLabel = document.createElement("a-text");
      waterLabel.setAttribute("position", "-2 0 -2");
      waterLabel.setAttribute("scale", "0.5 0.5 0.5");
      waterLabel.setAttribute("color", "#2196F3");
      waterLabel.setAttribute("align", "center");
      waterLabel.setAttribute("value", "Water Refill");
      scene.appendChild(waterLabel);
    }

    if (location.ecoElements.compostBin) {
      const compostIcon = document.createElement("a-cylinder");
      compostIcon.setAttribute("position", "2 0.5 -2");
      compostIcon.setAttribute("color", "#8BC34A");
      compostIcon.setAttribute("scale", "0.3 0.6 0.3");
      compostIcon.setAttribute(
        "animation",
        "property: rotation; to: 0 360 0; loop: true; dur: 3000",
      );
      scene.appendChild(compostIcon);

      const compostLabel = document.createElement("a-text");
      compostLabel.setAttribute("position", "2 0 -2");
      compostLabel.setAttribute("scale", "0.5 0.5 0.5");
      compostLabel.setAttribute("color", "#8BC34A");
      compostLabel.setAttribute("align", "center");
      compostLabel.setAttribute("value", "Compost Bin");
      scene.appendChild(compostLabel);
    }

    if (location.ecoElements.solarPower) {
      const solarPanel = document.createElement("a-plane");
      solarPanel.setAttribute("position", "0 3 -4");
      solarPanel.setAttribute("rotation", "-15 0 0");
      solarPanel.setAttribute("color", "#1565C0");
      solarPanel.setAttribute("scale", "1 0.7 1");
      solarPanel.setAttribute(
        "animation",
        "property: material.color; to: #FFD54F; dir: alternate; loop: true; dur: 2000",
      );
      scene.appendChild(solarPanel);

      const solarLabel = document.createElement("a-text");
      solarLabel.setAttribute("position", "0 2.5 -4");
      solarLabel.setAttribute("scale", "0.5 0.5 0.5");
      solarLabel.setAttribute("color", "#1565C0");
      solarLabel.setAttribute("align", "center");
      solarLabel.setAttribute("value", "Solar Powered");
      scene.appendChild(solarLabel);
    }

    // Create camera
    const camera = document.createElement("a-entity");
    camera.setAttribute("camera", "");
    scene.appendChild(camera);

    arSceneRef.current.appendChild(scene);
    setArElementsVisible(true);
  };

  const startARExperience = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop immediately after permission
      setArStarted(true);
    } catch (error) {
      console.error("Camera permission denied:", error);
      alert("Camera access is required for AR experience");
    }
  };

  const playHeroStory = () => {
    setShowLocalHero(true);
    if (audioRef.current) {
      audioRef.current.play();
      setAudioPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  const claimBonusReward = async () => {
    try {
      const response = await fetch("/api/green-miles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo_user_001",
          route: {
            origin: { name: "Nimman Road", lat: 18.7984, lng: 98.9681 },
            destination: {
              name: location?.name || "",
              lat: location?.coordinates.lat || 0,
              lng: location?.coordinates.lng || 0,
            },
            mode: {
              mode: "bike",
              name: "Bicycle",
              icon: "bike",
              emissionFactor: 0,
            },
            distance: 15,
            duration: 45,
            co2Emissions: 0,
          },
          isOutsideCity: true,
          isRecommendedZone: true,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setRewardClaimed(true);
        setTimeout(() => setRewardClaimed(false), 3000);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  if (!location) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Location not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
        <div className="container max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="text-center text-white">
              <h1 className="font-semibold">AR Experience</h1>
              <p className="text-xs opacity-80">{location.name}</p>
            </div>

            <Badge className="bg-green-600 text-white">
              <MapPin className="h-3 w-3 mr-1" />
              Arrived
            </Badge>
          </div>
        </div>
      </header>

      {/* AR Scene Container */}
      <div
        ref={arSceneRef}
        className="w-full h-full"
        style={{ display: arStarted ? "block" : "none" }}
      />

      {/* Welcome Screen */}
      {!arStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-900 to-blue-900">
          <Card className="p-6 m-4 text-center max-w-sm bg-white/95">
            <div className="text-4xl mb-4">🌟</div>
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Welcome to {location.name}!
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Experience this sustainable destination through augmented reality
              and meet local eco-heroes making a difference.
            </p>

            <Button
              onClick={startARExperience}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start AR Experience
            </Button>
          </Card>
        </div>
      )}

      {/* AR Controls Overlay */}
      {arStarted && arElementsVisible && (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/70 backdrop-blur-sm p-4">
          <div className="container max-w-md mx-auto space-y-3">
            {/* Eco Elements Indicators */}
            <div className="flex justify-center gap-4 mb-4">
              {location.ecoElements.waterRefill && (
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                    <Droplets className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-white">Water</span>
                </div>
              )}
              {location.ecoElements.compostBin && (
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-1">
                    <Recycle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-white">Compost</span>
                </div>
              )}
              {location.ecoElements.zeroWaste && (
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mb-1">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-white">Zero Waste</span>
                </div>
              )}
              {location.ecoElements.solarPower && (
                <div className="text-center">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mb-1">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-white">Solar</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={playHeroStory}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Local Hero Story
              </Button>

              <Button
                onClick={claimBonusReward}
                disabled={rewardClaimed}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Gift className="h-4 w-4 mr-2" />
                {rewardClaimed ? "Claimed!" : "+10 Miles"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-green-700 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Welcome to {location.name}!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🌿</div>
              <p className="text-sm text-muted-foreground">
                You've arrived at a certified sustainable destination!
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">{location.description}</p>
            </div>

            <Button
              onClick={() => {
                setShowWelcome(false);
                startARExperience();
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              Explore in AR
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Local Hero Dialog */}
      <Dialog open={showLocalHero} onOpenChange={setShowLocalHero}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-green-700 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Local Eco-Hero: {location.localHero.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Video Placeholder */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-40">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm font-medium">
                    {location.localHero.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                {location.localHero.story}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={toggleAudio}
                variant="outline"
                className="flex-1"
              >
                {audioPlaying ? (
                  <VolumeX className="h-4 w-4 mr-2" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                {audioPlaying ? "Pause" : "Listen"}
              </Button>

              <Button
                onClick={() => setShowLocalHero(false)}
                className="flex-1"
              >
                Continue AR
              </Button>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={location.localHero.audioUrl}
            onEnded={() => setAudioPlaying(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Reward Claimed Notification */}
      {rewardClaimed && (
        <div className="absolute top-20 left-4 right-4 z-50">
          <Card className="p-4 bg-green-600 text-white text-center">
            <div className="flex items-center justify-center gap-2">
              <Gift className="h-5 w-5" />
              <span className="font-semibold">+10 Green Miles earned!</span>
            </div>
            <p className="text-sm opacity-90 mt-1">
              Thanks for visiting this sustainable destination!
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
