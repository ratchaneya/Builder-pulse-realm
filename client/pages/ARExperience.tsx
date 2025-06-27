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
}

const locationMapping: Record<string, string> = {
  doi_suthep: "doi_pui_forest",
  mae_rim: "ton_pao_village",
  san_kamphaeng: "aunt_pen_cafe",
  doi_pui_forest: "doi_pui_forest",
  aunt_pen_cafe: "aunt_pen_cafe",
  ton_pao_village: "ton_pao_village",
  huai_kaew_waterfall: "huai_kaew_waterfall",
};

export default function ARExperience() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get("location") || "doi_suthep";
  const locationId = locationMapping[locationParam] || "doi_pui_forest";

  const [arStarted, setArStarted] = useState(false);
  const [location, setLocation] = useState<ARLocation | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLocalHero, setShowLocalHero] = useState(false);
  const [showMarkerScanner, setShowMarkerScanner] = useState(false);
  const [markerDetected, setMarkerDetected] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [arElementsVisible, setArElementsVisible] = useState(false);
  const [language, setLanguage] = useState<"thai" | "english">("thai");
  const [showShare, setShowShare] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const arSceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLocationData();
  }, [locationId]);

  const loadLocationData = async () => {
    try {
      // Use mock data directly for demo (API endpoint not implemented yet)
      setLocation(getMockLocation(locationId));

      // Simulate arrival and prompt for marker scanning
      setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
    } catch (error) {
      console.error("Error loading location:", error);
      setLocation(getMockLocation(locationId));
      setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
    }
  };

  const getMockLocation = (id: string): ARLocation => {
    const mockLocations: Record<string, ARLocation> = {
      doi_pui_forest: {
        id: "doi_pui_forest",
        name: "ป่าดอยปุย",
        nameEn: "Doi Pui Forest",
        type: "tourist_spot",
        description: "ป่าผืนนี้มีต้นไม้มากกว่า 300 ชนิด เป็นปอดของเชียงใหม่",
        descriptionEn:
          "This forest has over 300 tree species and serves as Chiang Mai's lungs",
        sustainabilityFeature:
          "ใช้พลังงานแสงอาทิตย์สำหรับศูนย์บริการนักท่องเที่ยว",
        sustainabilityFeatureEn: "Solar-powered visitor facilities",
        coordinates: { lat: 18.8547, lng: 98.9184 },
        arMarkerId: "doi_pui_marker",
        hero: {
          id: "forest_guide_somchai",
          name: "ผู้ดูแลป่า สมชาย",
          nameEn: "Forest Guardian Somchai",
          role: "นักอนุรักษ์ป่า",
          roleEn: "Forest Conservationist",
          story:
            "สมชายดูแลป่าดอยปุยมา 15 ปี ปลูกต้นไม้ใหม่ทุกปี และสอนเยาวชนให้รักษาป่า",
          storyEn:
            "Somchai has protected Doi Pui forest for 15 years, planting new trees annually and teaching youth forest conservation",
          voiceLine:
            "ในป่าผืนนี้มีต้นไม้มากก���่า 300 ชนิด เราปลูกใหม่ทุกปี ป่าจะอยู่กับเรา ถ้าเราอยู่กับป่า",
          voiceLineEn:
            "This forest has over 300 tree species. We plant new ones every year. The forest will stay with us if we stay with the forest.",
          audioUrl: "/audio/somchai-thai.mp3",
          audioUrlEn: "/audio/somchai-english.mp3",
          imageUrl: "/images/somchai-forest.jpg",
          avatarUrl: "/avatars/somchai-3d.glb",
          achievements: [
            "ปลูกต้นไม้ไปแล้ว 2,000 ต้น",
            "ฝึกอบรมเยาวชน 500+ คน",
            "ลดการทำลายป่า 80%",
          ],
          achievementsEn: [
            "Planted 2,000+ trees",
            "Trained 500+ youth",
            "Reduced deforestation by 80%",
          ],
        },
        rewardAmount: 15,
        shareTemplate: {
          thai: "พบกับผู้พิทักษ์ป่าจริง ๆ ที่ดอยปุย 🌲🇹🇭 #EcoHero #ChiangMai",
          english:
            "Met a real forest guardian at Doi Pui 🌲🇹🇭 #EcoHero #ChiangMai",
        },
      },
      aunt_pen_cafe: {
        id: "aunt_pen_cafe",
        name: "ร้านกาแฟป้าเป็น",
        nameEn: "Aunt Pen's Café",
        type: "community_spot",
        description: "ร้านกาแฟชุมชนที่เลิกใช้พลาสติกตั้งแต่ปี 2562",
        descriptionEn: "Community café that went plastic-free since 2019",
        sustainabilityFeature: "ปลอดพลาสติก ใช้ถ้วยไผ่และหลอดกระดาษ",
        sustainabilityFeatureEn:
          "Plastic-free with bamboo cups and paper straws",
        coordinates: { lat: 18.7756, lng: 98.9856 },
        arMarkerId: "pen_cafe_marker",
        hero: {
          id: "aunt_pen",
          name: "ป้าเป็น",
          nameEn: "Aunt Pen",
          role: "เจ้าของร้านกาแฟ",
          roleEn: "Café Owner",
          story:
            "ป้าเป็นเป็นคนแรกในย่านที่เลิกใช้พลาสติก เธอทำให้ร้านอื��น ๆ ตามมา",
          storyEn:
            "Aunt Pen was the first in the neighborhood to go plastic-free, inspiring other shops to follow",
          voiceLine:
            "ฉันเลิกใช้หลอดพลาสติกตั้งแต่ปี 2562 ใครจะรู้ว่ามันจะช่วยทะเลได้จริง ๆ",
          voiceLineEn:
            "I stopped using plastic straws since 2019. Who knew it would really help the ocean?",
          audioUrl: "/audio/pen-thai.mp3",
          audioUrlEn: "/audio/pen-english.mp3",
          imageUrl: "/images/aunt-pen.jpg",
          avatarUrl: "/avatars/pen-3d.glb",
          achievements: [
            "ปลอดพลาสติก 100%",
            "ลูกค้าลดขยะ 5 ตัน/ปี",
            "เป็นแรงบันดาลใจให้ร้าน 20+ ร้าน",
          ],
          achievementsEn: [
            "100% plastic-free",
            "Customers reduced 5 tons/year waste",
            "Inspired 20+ other shops",
          ],
        },
        rewardAmount: 10,
        shareTemplate: {
          thai: "พบกับฮีโร่ชุมชนที่ร้านป้าเป็น ♻️🇹🇭 #ZeroWaste #ChiangMai",
          english:
            "Met a community hero at Aunt Pen's Café ♻️🇹🇭 #ZeroWaste #ChiangMai",
        },
      },
      ton_pao_village: {
        id: "ton_pao_village",
        name: "บ้านต้นเปาะ",
        nameEn: "Ban Ton Pao Weaving Village",
        type: "community_spot",
        description: "หมู่บ้านทอผ้าที่ใช้สีธรรมชาติจากใบไม้",
        descriptionEn: "Weaving village using natural dyes from leaves",
        sustainabilityFeature: "ย้อมผ้าด้วยสีจากธรรมชาติ 100%",
        sustainabilityFeatureEn: "100% natural plant-based fabric dyes",
        coordinates: { lat: 18.8123, lng: 98.8945 },
        arMarkerId: "tonpao_marker",
        hero: {
          id: "elder_malee",
          name: "ยายมาลี",
          nameEn: "Elder Malee",
          role: "ช่างทอผ้าอาวุโส",
          roleEn: "Master Weaver",
          story: "ยายมาลีสืบทอดภูมิปัญญาการย้อมผ้าจากคุณยายมา 4 รุ่น",
          storyEn:
            "Elder Malee inherited the wisdom of natural dyeing from her grandmother, 4 generations deep",
          voiceLine:
            "เราสืบทอดการย้อมผ้านี้มา 4 รุ่นแล้ว สีที่คุณเห็นมาจากใบไม้ล้วน ๆ",
          voiceLineEn:
            "We've inherited this dyeing tradition for 4 generations. The colors you see come purely from leaves.",
          audioUrl: "/audio/malee-thai.mp3",
          audioUrlEn: "/audio/malee-english.mp3",
          imageUrl: "/images/elder-malee.jpg",
          avatarUrl: "/avatars/malee-3d.glb",
          achievements: [
            "สืบทอดภูมิปัญญา 4 รุ่น",
            "สอนเด็กหนุ่มสาว 200+ คน",
            "ขายผ้าไปทั่วโลก 30+ ประเทศ",
          ],
          achievementsEn: [
            "4 generations of wisdom",
            "Taught 200+ young people",
            "Fabrics sold to 30+ countries",
          ],
        },
        rewardAmount: 12,
        shareTemplate: {
          thai: "พบกับยายมาลี นักทอผ้าระดับตำนาน ที่บ้านต้นเปาะ 🧵🇹🇭 #TraditionalCraft #ChiangMai",
          english:
            "Met legendary weaver Elder Malee at Ton Pao Village 🧵🇹🇭 #TraditionalCraft #ChiangMai",
        },
      },
      huai_kaew_waterfall: {
        id: "huai_kaew_waterfall",
        name: "น้ำตกห้วย���ก้ว",
        nameEn: "Huai Kaew Waterfall",
        type: "tourist_spot",
        description: "น้ำตกที่มีระบบผลิตไฟฟ้าจากพลังน้ำขนาดเล็ก",
        descriptionEn:
          "Waterfall with small-scale hydroelectric power generation",
        sustainabilityFeature: "ใช้พลังน้ำผลิตไฟฟ้าสำหรับเส้นทางเดิน",
        sustainabilityFeatureEn:
          "Hydroelectric power for walking trail lighting",
        coordinates: { lat: 18.8198, lng: 98.9245 },
        arMarkerId: "waterfall_marker",
        hero: {
          id: "park_ranger_niran",
          name: "นิรันดร์",
          nameEn: "Park Ranger Niran",
          role: "เจ้าหน้าที่อุทยาน",
          roleEn: "Park Ranger",
          story: "นิรันดร์ออกแบบระบบไฟฟ้าพลังน้ำที่ไม่รบกวนระบบนิเวศ",
          storyEn:
            "Niran designed the hydroelectric system that doesn't disturb the ecosystem",
          voiceLine:
            "น้ำตกนี้ให้พลังงานสะอาดแก่เราท��กวัน โดยไม่ทำร้ายธรรมชาติ",
          voiceLineEn:
            "This waterfall gives us clean energy every day without harming nature.",
          audioUrl: "/audio/niran-thai.mp3",
          audioUrlEn: "/audio/niran-english.mp3",
          imageUrl: "/images/ranger-niran.jpg",
          avatarUrl: "/avatars/niran-3d.glb",
          achievements: [
            "ออกแบบระบบไฟฟ้าเป็นมิต���กับสิ่งแวดล้อม",
            "ลดการใช้ไฟฟ้าจากเชื้อเพลิงฟอสซิล 90%",
            "เป็นต้นแบบอุทยาน 15 แห่ง",
          ],
          achievementsEn: [
            "Designed eco-friendly power system",
            "Reduced fossil fuel electricity by 90%",
            "Model for 15 other parks",
          ],
        },
        rewardAmount: 12,
        shareTemplate: {
          thai: "พบกับนักอนุรักษ์พลังงานที่น้ำตกห้วยแก���ว ⚡🇹🇭 #CleanEnergy #ChiangMai",
          english:
            "Met an energy conservationist at Huai Kaew Waterfall ⚡🇹🇭 #CleanEnergy #ChiangMai",
        },
      },
    };

    return mockLocations[id] || mockLocations.doi_pui_forest;
  };

  useEffect(() => {
    if (arStarted) {
      loadARFramework();
    }
  }, [arStarted]);

  const loadARFramework = async () => {
    try {
      // Check if we're on HTTPS
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        alert(
          "AR features require HTTPS. Please access the app via a secure connection.",
        );
        return;
      }

      // Load A-Frame first
      const aframeScript = document.createElement("script");
      aframeScript.src = "https://aframe.io/releases/1.4.0/aframe.min.js";

      aframeScript.onload = () => {
        // Then load AR.js
        const arScript = document.createElement("script");
        arScript.src =
          "https://cdn.jsdelivr.net/npm/ar.js@3.4.5/aframe/build/aframe-ar.js";
        arScript.onload = () => {
          initializeARScene();
        };
        arScript.onerror = () => {
          console.error("Failed to load AR.js");
          alert(
            "Failed to load AR library. Please check your internet connection.",
          );
        };
        document.head.appendChild(arScript);
      };

      aframeScript.onerror = () => {
        console.error("Failed to load A-Frame");
        alert(
          "Failed to load AR framework. Please check your internet connection.",
        );
      };

      document.head.appendChild(aframeScript);
    } catch (error) {
      console.error("Error loading AR framework:", error);
    }
  };

  const initializeARScene = () => {
    if (!arSceneRef.current || !location) return;

    // Clear any existing content
    arSceneRef.current.innerHTML = "";

    // Create AR scene with marker detection
    const scene = document.createElement("a-scene");
    scene.setAttribute("embedded", "true");
    scene.setAttribute(
      "arjs",
      JSON.stringify({
        sourceType: "webcam",
        debugUIEnabled: false,
        detectionMode: "mono_and_matrix",
        matrixCodeType: "3x3",
        trackingMethod: "best",
        sourceWidth: 1280,
        sourceHeight: 960,
        displayWidth: 1280,
        displayHeight: 960,
      }),
    );
    scene.style.width = "100%";
    scene.style.height = "100%";
    scene.style.zIndex = "1";

    // Create marker entity
    const marker = document.createElement("a-marker");
    marker.setAttribute("preset", "custom");
    marker.setAttribute("type", "pattern");
    marker.setAttribute("url", `/markers/${location.arMarkerId}.patt`);
    marker.setAttribute("smooth", "true");
    marker.setAttribute("smoothCount", "10");
    marker.setAttribute("smoothTolerance", "0.01");
    marker.setAttribute("smoothThreshold", "5");

    // Marker detection events
    marker.addEventListener("markerFound", () => {
      setMarkerDetected(true);
      setArElementsVisible(true);
    });

    marker.addEventListener("markerLost", () => {
      setMarkerDetected(false);
    });

    // Create floating place introduction
    const placeTitle = document.createElement("a-text");
    placeTitle.setAttribute("position", "0 2 0");
    placeTitle.setAttribute("scale", "1.5 1.5 1.5");
    placeTitle.setAttribute("color", "#2E7D32");
    placeTitle.setAttribute("align", "center");
    placeTitle.setAttribute(
      "value",
      language === "thai" ? location.name : location.nameEn,
    );
    placeTitle.setAttribute(
      "animation",
      "property: position; to: 0 2.5 0; dir: alternate; loop: true; dur: 3000; easing: easeInOutSine",
    );
    marker.appendChild(placeTitle);

    // Sustainability feature text
    const sustainabilityText = document.createElement("a-text");
    sustainabilityText.setAttribute("position", "0 1.3 0");
    sustainabilityText.setAttribute("scale", "0.8 0.8 0.8");
    sustainabilityText.setAttribute("color", "#4CAF50");
    sustainabilityText.setAttribute("align", "center");
    sustainabilityText.setAttribute("width", "6");
    sustainabilityText.setAttribute(
      "value",
      language === "thai"
        ? location.sustainabilityFeature
        : location.sustainabilityFeatureEn,
    );
    marker.appendChild(sustainabilityText);

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
      // Check if we're on HTTPS (required for camera access)
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        const thaiMessage = `⚠️ ต้องใช้ HTTPS เพื่อเข้าถึงกล้อง

กรุณาใช้ลิงก์ที่ปลอดภัย (https://) แทน
หรือใช้บริการ Netlify, Vercel, หรือ GitHub Pages

ปัจจุบันคุณอยู่ที่: ${location.href}
ต้องการ: https://your-domain.com`;

        alert(thaiMessage);
        return;
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const thaiMessage = `❌ เบราว์เซอร์นี้ไม่รองรับการเข้าถึงกล้อง

กรุณาใช้:
• Chrome (แนะนำ)
• Firefox
• Safari (iOS 11+)
• Edge

หรือตรวจสอบการตั้งค่าเบราว์เซอร์`;
        alert(thaiMessage);
        return;
      }

      // Show loading state
      console.log("🎥 กำลังขอสิทธิ์เข้าถึงกล้อง...");

      // Request camera permission with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280, min: 640 },
          height: { ideal: 960, min: 480 },
        },
      });

      // Test that we got a valid stream
      if (stream && stream.getVideoTracks().length > 0) {
        console.log("✅ เข้าถึงกล้องสำเร็จ!");

        // Test camera capabilities
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities
          ? videoTrack.getCapabilities()
          : {};
        console.log("Camera capabilities:", capabilities);

        stream.getTracks().forEach((track) => track.stop()); // Stop test stream
        setArStarted(true);
      } else {
        throw new Error("No video tracks available");
      }
    } catch (error) {
      console.error("Camera access error:", error);

      let thaiMessage = "❌ ไม่สามารถเข้าถึงกล้องได้\n\n";

      if (error.name === "NotAllowedError") {
        thaiMessage += `🚫 คุณไม่อนุญาตให้เข้าถึงกล้อง

วิธีแก้ไข:
1. คลิก "อนุญาต" เมื่อเบราว์เซอร์ถาม
2. ตรวจสอบไอคอน 🔒 ข้างบนแถบที่อยู่
3. เปิดการอนุญาตกล้องในการตั้งค่า
4. รีเฟรชหน��าเว็บและลองใหม่`;
      } else if (error.name === "NotFoundError") {
        thaiMessage += `📷 ไม่พบกล้องในอุปกรณ์นี้

วิธีแก้ไข:
• ตรวจสอบว่าอุปกรณ์มีกล้อง
• เสียบกล้อง USB (คอมพิวเตอร์)
• รีสตาร์ทแอปกล้อง
• ลองเบราว์เซอร์อื่น`;
      } else if (error.name === "NotSupportedError") {
        thaiMessage += `⚠️ เบราว์เซอร์ไม่รองรับ WebRTC

แนะนำให้ใช้:
• Chrome มือถือ (แนะนำ)
• Firefox
• Safari (iOS 11+)`;
      } else if (error.name === "NotReadableError") {
        thaiMessage += `🔒 กล้องถูกใช้งานโดยแอปอื่น

วิธีแก้ไข:
• ปิดแอปกล้องอื่น ๆ
• ปิดแท็บเบราว์เซอร์ที่ใช้กล้อง
• รีสตาร์ทเบราว์เซอร์`;
      } else {
        thaiMessage += `🔧 เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ

ลองวิธีเหล่านี้:
• รีเฟรชหน้าเว็บ
• ปิด-เปิดเบราว์เซอร์ใหม่
• ตรวจสอบการตั้งค่าความเป็นส่วนตัว
• ใช้เบราว์เซอร์อื่น

ข้อผิดพลาด: ${error.message}`;
      }

      alert(thaiMessage);
    }
  };

  const playHeroStory = () => {
    setShowLocalHero(true);
    if (audioRef.current) {
      audioRef.current.src =
        language === "thai"
          ? location?.hero.audioUrl || ""
          : location?.hero.audioUrlEn || "";
      audioRef.current.play();
      setAudioPlaying(true);

      // Show subtitles
      if (showSubtitles && location) {
        setCurrentSubtitle(
          language === "thai"
            ? location.hero.voiceLine
            : location.hero.voiceLineEn,
        );
      }
    }
  };

  const handleShare = async () => {
    if (!location) return;

    const shareText =
      language === "thai"
        ? location.shareTemplate.thai
        : location.shareTemplate.english;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `EcoTravel - ${language === "thai" ? location.name : location.nameEn}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText + " " + window.location.href);
      alert("Share text copied to clipboard!");
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
    if (!location || !markerDetected) {
      alert("Please scan the AR marker first to claim your reward!");
      return;
    }

    try {
      const response = await fetch("/api/green-miles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo_user_001",
          route: {
            origin: { name: "Nimman Road", lat: 18.7984, lng: 98.9681 },
            destination: {
              name: language === "thai" ? location.name : location.nameEn,
              lat: location.coordinates.lat,
              lng: location.coordinates.lng,
            },
            mode: {
              mode: "walk",
              name: "Walking",
              icon: "walk",
              emissionFactor: 0,
            },
            distance: 5,
            duration: 30,
            co2Emissions: 0,
          },
          isOutsideCity: location.type === "tourist_spot",
          isRecommendedZone: true,
          bonusAmount: location.rewardAmount,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setRewardClaimed(true);
        setTimeout(() => setRewardClaimed(false), 5000);
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
      {arStarted && (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/70 backdrop-blur-sm p-4">
          <div className="container max-w-md mx-auto space-y-3">
            {/* Marker Detection Status */}
            <div className="text-center mb-4">
              {markerDetected ? (
                <div className="bg-green-600 text-white px-4 py-2 rounded-full inline-flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {language === "thai"
                      ? "พบเครื่องหมาย AR!"
                      : "AR Marker Detected!"}
                  </span>
                </div>
              ) : (
                <div className="bg-orange-600 text-white px-4 py-2 rounded-full inline-flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">
                    {language === "thai"
                      ? "มองหาเครื่องหมาย AR..."
                      : "Looking for AR marker..."}
                  </span>
                </div>
              )}
            </div>

            {/* Sustainability Feature Display */}
            {markerDetected && location && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                <div className="text-center text-white">
                  <div className="text-2xl mb-2">
                    {location.type === "tourist_spot" ? "🏞️" : "🏘️"}
                  </div>
                  <h3 className="font-semibold mb-1">
                    {language === "thai" ? location.name : location.nameEn}
                  </h3>
                  <p className="text-sm opacity-90">
                    {language === "thai"
                      ? location.sustainabilityFeature
                      : location.sustainabilityFeatureEn}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={playHeroStory}
                disabled={!markerDetected}
                className={cn(
                  "text-white",
                  markerDetected
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-500 cursor-not-allowed",
                )}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                {language === "thai" ? "ฟังเรื่องฮีโร่" : "Hero Story"}
              </Button>

              <Button
                onClick={claimBonusReward}
                disabled={rewardClaimed || !markerDetected}
                className={cn(
                  "text-white",
                  rewardClaimed
                    ? "bg-gray-500 cursor-not-allowed"
                    : !markerDetected
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700",
                )}
              >
                <Gift className="h-4 w-4 mr-2" />
                {rewardClaimed
                  ? language === "thai"
                    ? "รับแล้ว!"
                    : "Claimed!"
                  : `+${location?.rewardAmount || 10} ${language === "thai" ? "ไมล์" : "Miles"}`}
              </Button>
            </div>

            {/* Language Toggle */}
            <Button
              onClick={() =>
                setLanguage(language === "thai" ? "english" : "thai")
              }
              variant="outline"
              className="w-full text-white border-white/30 hover:bg-white/10"
            >
              <Languages className="h-4 w-4 mr-2" />
              {language === "thai" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
            </Button>
          </div>
        </div>
      )}

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-green-700 flex items-center gap-2">
              <Star className="h-5 w-5" />
              {language === "thai"
                ? `ยินดีต้อนรับสู่ ${location?.name}!`
                : `Welcome to ${location?.nameEn}!`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {location?.type === "tourist_spot" ? "🏞️" : "🏘️"}
              </div>
              <Badge className="mb-3">
                {location?.type === "tourist_spot"
                  ? "Tourist Spot"
                  : "Community Spot"}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {language === "thai"
                  ? "คุณมา��ึงจุดหมายที่ยั่งยืนแล้ว!"
                  : "You've arrived at a certified sustainable destination!"}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                {language === "thai"
                  ? location?.description
                  : location?.descriptionEn}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-medium mb-2">
                {language === "thai" ? "ขั้นตอนถัดไป:" : "Next Step:"}
              </p>
              <p className="text-sm text-blue-600 mb-2">
                {language === "thai"
                  ? "กดปุ่มด้านล่างเพื่อเปิดกล้องและสแกนเครื่องหมาย AR"
                  : "Tap the button below to open camera and scan AR marker"}
              </p>
              {location.protocol !== "https:" &&
                location.hostname !== "localhost" && (
                  <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded text-xs text-orange-700">
                    {language === "thai"
                      ? "⚠️ ต้องใช้ HTTPS เพื่อเข้าถึงกล้อง กรุณาใช้ลิงก์ปลอดภัย"
                      : "⚠️ HTTPS required for camera access. Please use secure link"}
                  </div>
                )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() =>
                  setLanguage(language === "thai" ? "english" : "thai")
                }
                variant="outline"
                className="flex-1"
              >
                <Languages className="h-4 w-4 mr-2" />
                {language === "thai" ? "English" : "ไทย"}
              </Button>

              <Button
                onClick={() => {
                  setShowWelcome(false);
                  startARExperience();
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                {language === "thai" ? "🎥 เปิดกล้อง AR" : "🎥 Open AR Camera"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Local Hero Dialog */}
      <Dialog open={showLocalHero} onOpenChange={setShowLocalHero}>
        <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-green-700 flex items-center gap-2">
              <Award className="h-5 w-5" />
              {language === "thai"
                ? `ฮีโร่ท้องถิ่น: ${location?.hero.name}`
                : `Local Eco-Hero: ${location?.hero.nameEn}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Hero Avatar */}
            <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-lg font-bold text-green-800">
                    {language === "thai"
                      ? location?.hero.name
                      : location?.hero.nameEn}
                  </p>
                  <p className="text-sm text-green-600">
                    {language === "thai"
                      ? location?.hero.role
                      : location?.hero.roleEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Line with Subtitles */}
            {showSubtitles && currentSubtitle && (
              <div className="bg-black/80 text-white p-3 rounded-lg">
                <p className="text-sm text-center italic">
                  "{currentSubtitle}"
                </p>
              </div>
            )}

            {/* Hero Story */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-semibold text-green-800 mb-2">
                {language === "thai" ? "เรื่องราว" : "Story"}
              </h4>
              <p className="text-sm text-green-700">
                {language === "thai"
                  ? location?.hero.story
                  : location?.hero.storyEn}
              </p>
            </div>

            {/* Achievements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-2">
                {language === "thai" ? "ความสำเร็จ" : "Achievements"}
              </h4>
              <ul className="space-y-1">
                {(language === "thai"
                  ? location?.hero.achievements
                  : location?.hero.achievementsEn
                )?.map((achievement, index) => (
                  <li
                    key={index}
                    className="text-sm text-blue-700 flex items-start gap-2"
                  >
                    <Star className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Audio Controls */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={toggleAudio}
                variant="outline"
                className="flex items-center gap-1"
              >
                {audioPlaying ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                {audioPlaying
                  ? language === "thai"
                    ? "หยุด"
                    : "Pause"
                  : language === "thai"
                    ? "ฟัง"
                    : "Listen"}
              </Button>

              <Button
                onClick={() => setShowSubtitles(!showSubtitles)}
                variant="outline"
                className="text-xs"
              >
                {showSubtitles ? "Hide" : "Show"} Sub
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Share2 className="h-3 w-3" />
                {language === "thai" ? "แชร์" : "Share"}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() =>
                  setLanguage(language === "thai" ? "english" : "thai")
                }
                variant="outline"
                className="flex-1"
              >
                <Languages className="h-4 w-4 mr-2" />
                {language === "thai" ? "English" : "ไทย"}
              </Button>

              <Button
                onClick={() => setShowLocalHero(false)}
                className="flex-1"
              >
                {language === "thai" ? "ด�� AR ต่อ" : "Continue AR"}
              </Button>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            onEnded={() => {
              setAudioPlaying(false);
              setCurrentSubtitle("");
            }}
            onLoadedMetadata={() => {
              // Set subtitle timing
              if (showSubtitles && location) {
                setCurrentSubtitle(
                  language === "thai"
                    ? location.hero.voiceLine
                    : location.hero.voiceLineEn,
                );
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Reward Claimed Notification */}
      {rewardClaimed && location && (
        <div className="absolute top-20 left-4 right-4 z-50">
          <Card className="p-4 bg-green-600 text-white text-center animate-bounce">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="h-6 w-6" />
              <span className="font-bold text-lg">
                +{location.rewardAmount}{" "}
                {language === "thai" ? "เกรีน ไมล์!" : "Green Miles!"}
              </span>
            </div>
            <p className="text-sm opacity-90">
              {language === "thai"
                ? `ขอบคุณที่��าเย���่ยมชม ${location.name}!`
                : `Thanks for visiting ${location.nameEn}!`}
            </p>
            <p className="text-xs opacity-75 mt-1">
              {language === "thai"
                ? "พบกับฮีโร่ท้องถิ่นและได้รับแรงบันดาลใจ"
                : "Met a local hero and got inspired!"}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
