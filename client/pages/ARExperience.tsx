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
  Share2,
  Languages,
  Play,
  Pause,
  RotateCcw,
  Scan,
  CheckCircle,
  Trophy,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ARHero {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  story: string;
  storyEn: string;
  voiceLine: string;
  voiceLineEn: string;
  audioUrl: string;
  audioUrlEn: string;
  imageUrl: string;
  avatarUrl: string;
  achievements: string[];
  achievementsEn: string[];
}

interface ARLocation {
  id: string;
  name: string;
  nameEn: string;
  type: "tourist_spot" | "community_spot";
  description: string;
  descriptionEn: string;
  sustainabilityFeature: string;
  sustainabilityFeatureEn: string;
  coordinates: { lat: number; lng: number };
  arMarkerId: string;
  hero: ARHero;
  rewardAmount: number;
  shareTemplate: {
    thai: string;
    english: string;
  };
  markerImageUrl: string;
}

// Enhanced AR locations with comprehensive hero stories
const arLocations: ARLocation[] = [
  {
    id: "doi_pui_forest",
    name: "ป่าดอยปุย",
    nameEn: "Doi Pui Forest",
    type: "tourist_spot",
    description: "ป่าผืนนี้มีต้นไม้มากกว่า 300 ชนิด เป็นปอดของเชียงใหม่",
    descriptionEn:
      "This forest has over 300 tree species and serves as Chiang Mai's lungs",
    sustainabilityFeature: "ใช้พลังงานแสงอาทิตย์สำหรับศูนย์บริการนักท่องเที่ยว",
    sustainabilityFeatureEn: "Solar-powered visitor facilities",
    coordinates: { lat: 18.8547, lng: 98.9184 },
    arMarkerId: "doi_pui_marker",
    markerImageUrl: "/markers/doi_pui_marker.png",
    rewardAmount: 15,
    hero: {
      id: "forest_guardian_somchai",
      name: "ผู้พิทักษ์ป่าสมชาย",
      nameEn: "Forest Guardian Somchai",
      role: "เจ้าหน้าที่อนุรักษ์ป่า",
      roleEn: "Forest Conservation Officer",
      story:
        "สมชายดูแลป่าดอยปุยมา 25 ปี เขาเฝ้าดูการเปลี่ยนแปลงของสิ่งแวดล้อมและปลูกต้นไม้ใหม่ทุกปี เพื่อให้ลูกหลานได้เห็นป่าเขียวชอุ่มแบบนี้",
      storyEn:
        "Somchai has protected Doi Pui forest for 25 years, watching environmental changes and planting new trees annually so future generations can see this lush green forest.",
      voiceLine:
        "ในป่าผืนนี้มีต้นไม้มากกว่า 300 ชนิด เราปลูกใหม่ทุกปี ป่าจะอยู่กับเรา ถ้าเราอยู่กับป่า",
      voiceLineEn:
        "This forest has over 300 tree species. We plant new ones every year. The forest will stay with us if we stay with the forest.",
      audioUrl: "/audio/heroes/somchai_thai.mp3",
      audioUrlEn: "/audio/heroes/somchai_english.mp3",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      achievements: [
        "ปลูกต้นไม้แล้วกว่า 5,000 ต้น",
        "ป้องกันไฟป่ามา 25 ปี",
        "อบรมเยาวชนเรื่องการอนุรักษ์",
      ],
      achievementsEn: [
        "Planted over 5,000 trees",
        "25 years of forest fire prevention",
        "Training youth in conservation",
      ],
    },
    shareTemplate: {
      thai: "ได้พบกับผู้พิทักษ์ป่าสมชาย ที่ป่าดอยปุย 🌲 เขาปลูกต้นไม้มาแล้วกว่า 5,000 ต้น! #การท่องเที่ยวยั่งยืน #เชียงใหม่",
      english:
        "Met Forest Guardian Somchai at Doi Pui Forest 🌲 He's planted over 5,000 trees! #SustainableTourism #ChiangMai",
    },
  },
  {
    id: "aunt_pen_cafe",
    name: "คาเฟ่ป้าเป็น",
    nameEn: "Aunt Pen's Café",
    type: "community_spot",
    description: "คาเฟ่เล็กๆ ริมลำธาร ไม่ใช้พลาสติกและเสิร์ฟอาหารออร์แกนิค",
    descriptionEn: "Small streamside café serving organic food without plastic",
    sustainabilityFeature: "ไม่ใช้หลอดพลาสติกและภาชนะโฟม",
    sustainabilityFeatureEn: "No plastic straws or foam containers",
    coordinates: { lat: 18.7261, lng: 98.9389 },
    arMarkerId: "aunt_pen_marker",
    markerImageUrl: "/markers/aunt_pen_marker.png",
    rewardAmount: 10,
    hero: {
      id: "aunt_pen",
      name: "ป้าเป็น",
      nameEn: "Aunt Pen",
      role: "เจ้าของคาเฟ่",
      roleEn: "Café Owner",
      story:
        "ป้าเป็นเปิดคาเฟ่มา 8 ปี และตัดสินใจเลิกใช้พลาสติกตั้งแต่ปี 2562 เธอเชื่อว่าการเปลี่ยนแปลงเล็กๆ จากคนคนหนึ่งสามารถสร้างผลกระทบใหญ่ได้",
      storyEn:
        "Aunt Pen has run her café for 8 years and stopped using plastic in 2019. She believes small changes from one person can create a big impact.",
      voiceLine:
        "ฉันเลิกใช้หลอดพลาสติกตั้งแต่ปี 2562 ใครจะรู้ว่ามันจะช่วยทะเลได้จริง ๆ",
      voiceLineEn:
        "I stopped using plastic straws in 2019. Who knew it would really help the ocean.",
      audioUrl: "/audio/heroes/aunt_pen_thai.mp3",
      audioUrlEn: "/audio/heroes/aunt_pen_english.mp3",
      imageUrl:
        "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400&h=300&fit=crop&crop=center",
      avatarUrl:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
      achievements: [
        "ไม่ใช้พลาสติกมา 5 ปี",
        "ใช้ผักออร์แกนิคจากท้องถิ่น",
        "แจกถุงผ้าฟรีให้ลูกค้า",
      ],
      achievementsEn: [
        "Plastic-free for 5 years",
        "Uses local organic vegetables",
        "Gives free cloth bags to customers",
      ],
    },
    shareTemplate: {
      thai: "พบกับป้าเป็น เจ้าของคาเฟ่ที่ไม่ใช้พลาสติก ☕️🌿 แรงบันดาลใจจริงๆ! #Zero Waste #เชียงใหม่",
      english:
        "Met Aunt Pen, plastic-free café owner ☕️🌿 So inspiring! #ZeroWaste #ChiangMai",
    },
  },
  {
    id: "ton_pao_village",
    name: "หมู่บ้านตอนเป้า",
    nameEn: "Ton Pao Village",
    type: "community_spot",
    description: "หมู่บ้านทอผ้าแบบดั้งเดิม ใช้สีธรรมชาติจากใบไม้และดอกไม้",
    descriptionEn:
      "Traditional weaving village using natural dyes from leaves and flowers",
    sustainabilityFeature: "ใช้สีย้อมจากธรรมชาติ 100%",
    sustainabilityFeatureEn: "100% natural dyes",
    coordinates: { lat: 18.8147, lng: 99.0525 },
    arMarkerId: "ton_pao_marker",
    markerImageUrl: "/markers/ton_pao_marker.png",
    rewardAmount: 12,
    hero: {
      id: "elder_malee",
      name: "ยายมาลี",
      nameEn: "Elder Malee",
      role: "ช่างทอผ้าพ��้นบ้าน",
      roleEn: "Traditional Weaver",
      story:
        "ยายมาลีอายุ 73 ปี ทอผ้าด้วยมือมาตั้งแต่อายุ 12 ปี เธอสืบทอดวิธีการย้อมผ้าด้วยสีธรรมชาติจากยายทวด และสอนให้ลูกหลานทุกคน",
      storyEn:
        "Grandma Malee, 73, has been hand-weaving since age 12. She inherited natural dyeing techniques from her great-grandmother and teaches all her descendants.",
      voiceLine:
        "เราสืบทอดการย้อมผ้านี้มา 4 รุ่นแล้ว สีที่คุณเห็นมาจากใบไม้ล้วน ๆ",
      voiceLineEn:
        "We've passed down this dyeing tradition for 4 generations. The colors you see come purely from leaves.",
      audioUrl: "/audio/heroes/malee_thai.mp3",
      audioUrlEn: "/audio/heroes/malee_english.mp3",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      avatarUrl:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
      achievements: [
        "ทอผ้ามาแล้วกว่า 60 ปี",
        "ใช้สีธรรมชาติ 100%",
        "สอนให้ลูกหลาน 15 คน",
      ],
      achievementsEn: [
        "Weaving for over 60 years",
        "100% natural dyes",
        "Taught 15 descendants",
      ],
    },
    shareTemplate: {
      thai: "พบกับยายมาลี ช่างทอผ้าอายุ 73 ปี ที่หมู่บ้านตอนเป้า 🧵✨ ภูมิปัญญา 4 รุ่น! #ภูมิปัญญาไทย #เชียงใหม่",
      english:
        "Met Elder Malee, 73-year-old weaver at Ton Pao Village 🧵✨ 4 generations of wisdom! #ThaiWisdom #ChiangMai",
    },
  },
  {
    id: "huai_kaew_waterfall",
    name: "น้ำตกห้วยแก้ว",
    nameEn: "Huai Kaew Waterfall",
    type: "tourist_spot",
    description: "น้ำตกธรรมชาติ มีระบบจัดการขยะและการอนุรักษ์น้ำ",
    descriptionEn:
      "Natural waterfall with waste management and water conservation systems",
    sustainabilityFeature: "ระบบกรองน้ำธรรมชาติและจุดทิ้งขยะแยกประเภท",
    sustainabilityFeatureEn:
      "Natural water filtration and waste separation points",
    coordinates: { lat: 18.8156, lng: 98.9234 },
    arMarkerId: "huai_kaew_marker",
    markerImageUrl: "/markers/huai_kaew_marker.png",
    rewardAmount: 12,
    hero: {
      id: "park_ranger_niran",
      name: "เรนเจอร์นิรันดร์",
      nameEn: "Park Ranger Niran",
      role: "เจ้าหน้าที่อุทยาน",
      roleEn: "Park Ranger",
      story:
        "นิรันดร์ดูแลน้ำตกห้วยแก้วมา 15 ปี เขาตั้งระบบแยกขยะและสอนนักท่องเที่ยวเรื่องการอนุรักษ์ธรรมชาติ",
      storyEn:
        "Niran has cared for Huai Kaew Waterfall for 15 years. He set up waste separation systems and teaches tourists about nature conservation.",
      voiceLine:
        "น้ำใสขนาดนี้ไม่ใช่เรื่องบังเอิญ เราดูแลทุกหยดน้ำ ทุกใบไม้ ให้ลูกหลานได้เห็น",
      voiceLineEn:
        "Water this clear isn't by chance. We care for every drop, every leaf, so future generations can see this.",
      audioUrl: "/audio/heroes/niran_thai.mp3",
      audioUrlEn: "/audio/heroes/niran_english.mp3",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      achievements: [
        "ดูแลน้ำตกมา 15 ปี",
        "ตั้งระบบแยกขยะ",
        "อนุรักษ์พันธุ์ปลาพื้นเมือง",
      ],
      achievementsEn: [
        "Protected waterfall for 15 years",
        "Established waste separation",
        "Conserved native fish species",
      ],
    },
    shareTemplate: {
      thai: "พบกับเรนเจอร์นิรันดร์ ผู้ดูแลน้ำตกห้วยแก้ว 💧🌿 เขาทำให้น้ำใสแบบนี้! #อนุรักษ์ธรรมชาติ #เชียงใหม่",
      english:
        "Met Park Ranger Niran at Huai Kaew Waterfall 💧🌿 He keeps the water this clear! #NatureConservation #ChiangMai",
    },
  },
];

type ARState =
  | "scanning"
  | "marker_found"
  | "intro"
  | "hero_story"
  | "completed"
  | "error";

export default function ARExperience() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location") || "doi_pui_forest";

  const [arState, setArState] = useState<ARState>("scanning");
  const [isLanguageThai, setIsLanguageThai] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showHeroDialog, setShowHeroDialog] = useState(false);
  const [greenMilesEarned, setGreenMilesEarned] = useState(0);
  const [hasEarnedReward, setHasEarnedReward] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [markerDetected, setMarkerDetected] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Find current location data
  const currentLocation =
    arLocations.find((loc) => loc.id === locationId) || arLocations[0];
  const { hero } = currentLocation;

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
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
      } catch (error) {
        console.error("Camera access failed:", error);
        setArState("error");
      }
    };

    initCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Simulate AR marker detection (in a real app, this would use AR.js or WebXR)
  useEffect(() => {
    if (arState === "scanning") {
      const timer = setTimeout(() => {
        setMarkerDetected(true);
        setArState("marker_found");

        // Auto-progress to intro after marker found
        setTimeout(() => {
          setArState("intro");
        }, 2000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [arState]);

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

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isAudioMuted;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  // Start hero story
  const startHeroStory = () => {
    setArState("hero_story");
    setShowHeroDialog(true);

    // Auto-play audio
    if (audioRef.current) {
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  // Claim Green Miles reward
  const claimReward = async () => {
    if (hasEarnedReward) return;

    try {
      const response = await fetch("/api/green-miles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ar_hero_experience",
          locationId: currentLocation.id,
          greenMiles: currentLocation.rewardAmount,
          heroId: hero.id,
        }),
      });

      if (response.ok) {
        setGreenMilesEarned(currentLocation.rewardAmount);
        setHasEarnedReward(true);
        setArState("completed");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  // Share story
  const shareStory = async () => {
    const shareText = isLanguageThai
      ? currentLocation.shareTemplate.thai
      : currentLocation.shareTemplate.english;

    if (navigator.share) {
      try {
        await navigator.share({
          title: isLanguageThai ? `พบกับ${hero.name}` : `Met ${hero.nameEn}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard?.writeText(shareText);
      setShowShareDialog(true);
    }
  };

  // Reset AR experience
  const resetExperience = () => {
    setArState("scanning");
    setMarkerDetected(false);
    setShowHeroDialog(false);
    setIsAudioPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const currentName = isLanguageThai
    ? currentLocation.name
    : currentLocation.nameEn;
  const currentDescription = isLanguageThai
    ? currentLocation.description
    : currentLocation.descriptionEn;
  const currentSustainability = isLanguageThai
    ? currentLocation.sustainabilityFeature
    : currentLocation.sustainabilityFeatureEn;
  const heroName = isLanguageThai ? hero.name : hero.nameEn;
  const heroRole = isLanguageThai ? hero.role : hero.roleEn;
  const heroStory = isLanguageThai ? hero.story : hero.storyEn;
  const heroVoiceLine = isLanguageThai ? hero.voiceLine : hero.voiceLineEn;
  const heroAchievements = isLanguageThai
    ? hero.achievements
    : hero.achievementsEn;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Camera Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {/* AR Overlay Content */}
      <div className="absolute inset-0 z-10">
        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isLanguageThai ? "กลับ" : "Back"}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsLanguageThai(!isLanguageThai)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Languages className="w-4 h-4 mr-1" />
                {isLanguageThai ? "EN" : "ไทย"}
              </Button>

              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {isAudioMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* AR State Content */}
        {arState === "scanning" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-black/70 backdrop-blur-sm text-white border-green-400 max-w-sm mx-4">
              <CardContent className="p-6 text-center">
                <Scan className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">
                  {isLanguageThai
                    ? "สแกนหาเครื่องหมาย AR"
                    : "Scanning for AR Marker"}
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  {isLanguageThai
                    ? "มองหาป้ายหรือเครื่องหมายพิเศษใกล้จุดท่องเที่ยว"
                    : "Look for special signs or markers near the tourist spot"}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full animate-pulse w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {arState === "marker_found" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-green-600/90 backdrop-blur-sm text-white border-green-400 max-w-sm mx-4">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {isLanguageThai ? "พบเครื่องหมายแล้ว!" : "Marker Found!"}
                </h3>
                <p className="text-sm">
                  {isLanguageThai
                    ? "กำลังโหลดประสบการณ์ AR..."
                    : "Loading AR experience..."}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {arState === "intro" && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <Card className="bg-white/10 backdrop-blur-sm text-white border border-white/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {currentName}
                    </h3>
                    <p className="text-sm text-gray-200 mb-2">
                      {currentDescription}
                    </p>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-300">
                        {currentSustainability}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startHeroStory}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {isLanguageThai ? "พบกับฮีโร่ท้องถิ่น" : "Meet Local Hero"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {arState === "completed" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-green-600/95 backdrop-blur-sm text-white border-green-400 max-w-sm mx-4">
              <CardContent className="p-6 text-center">
                <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  {isLanguageThai ? "ได้รับแรงบันดาลใจ!" : "Inspired!"}
                </h3>
                <p className="text-sm mb-4">+{greenMilesEarned} Green Miles</p>
                <div className="space-y-3">
                  <Button
                    onClick={shareStory}
                    className="w-full bg-white/20 hover:bg-white/30 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {isLanguageThai ? "แชร์เรื่องราว" : "Share Story"}
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white/10"
                  >
                    {isLanguageThai ? "กลับหน้าหลัก" : "Back to Home"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {arState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-red-600/90 backdrop-blur-sm text-white max-w-sm mx-4">
              <CardContent className="p-6 text-center">
                <X className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {isLanguageThai
                    ? "ไม่สามารถเข้าถึงกล้องได้"
                    : "Camera Access Failed"}
                </h3>
                <p className="text-sm mb-4">
                  {isLanguageThai
                    ? "กรุณาอนุญาตการใช้กล้องและลองใหม่"
                    : "Please allow camera access and try again"}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-white/20 hover:bg-white/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {isLanguageThai ? "ลองใหม่" : "Retry"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reset Button */}
        {(arState === "hero_story" || arState === "completed") && (
          <Button
            onClick={resetExperience}
            className="absolute top-20 right-4 bg-black/50 hover:bg-black/70 text-white"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            {isLanguageThai ? "เริ่มใหม่" : "Reset"}
          </Button>
        )}
      </div>

      {/* Hero Story Dialog */}
      <Dialog open={showHeroDialog} onOpenChange={setShowHeroDialog}>
        <DialogContent className="max-w-md bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <DialogHeader>
            <DialogTitle className="text-center text-green-900">
              {isLanguageThai ? "ฮีโร่ท้องถิ่น" : "Local Hero"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Hero Avatar */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-green-200 mb-3">
                <img
                  src={hero.avatarUrl}
                  alt={heroName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg text-green-900">{heroName}</h3>
              <p className="text-green-700 text-sm">{heroRole}</p>
            </div>

            {/* Voice Line */}
            <Card className="bg-white/80 border border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-800 italic flex-1">
                    "{heroVoiceLine}"
                  </p>
                  <Button
                    onClick={toggleAudio}
                    variant="ghost"
                    size="sm"
                    className="text-green-600"
                  >
                    {isAudioPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-green-700">{heroStory}</p>
              </CardContent>
            </Card>

            {/* Achievements */}
            <div className="space-y-2">
              <h4 className="font-medium text-green-900 text-sm">
                {isLanguageThai ? "ความสำเร็จ" : "Achievements"}
              </h4>
              <div className="space-y-1">
                {heroAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={shareStory}
                variant="outline"
                className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {isLanguageThai ? "แชร์" : "Share"}
              </Button>

              <Button
                onClick={claimReward}
                disabled={hasEarnedReward}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Gift className="w-4 h-4 mr-2" />
                {hasEarnedReward
                  ? isLanguageThai
                    ? "ได้รับแล้ว"
                    : "Claimed"
                  : isLanguageThai
                    ? `+${currentLocation.rewardAmount} Miles`
                    : `+${currentLocation.rewardAmount} Miles`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {isLanguageThai ? "คัดลอกข้อความแล้ว!" : "Text Copied!"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            {isLanguageThai
              ? "ข้อความแชร์ถูกคัดลอกไปที่คลิปบอร์ดแล้ว"
              : "Share text has been copied to clipboard"}
          </p>
        </DialogContent>
      </Dialog>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
        onEnded={() => setIsAudioPlaying(false)}
      >
        <source
          src={isLanguageThai ? hero.audioUrl : hero.audioUrlEn}
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}
