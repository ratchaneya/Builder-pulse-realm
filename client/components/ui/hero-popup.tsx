import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Star,
  Volume2,
  VolumeX,
  Share2,
  Trophy,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";

interface Hero {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  story: string;
  storyEn: string;
  voiceLine: string;
  voiceLineEn: string;
  avatarUrl: string;
  achievements: string[];
  achievementsEn: string[];
}

interface HeroPopupProps {
  hero: Hero;
  locationName: string;
  locationNameEn: string;
  greenMilesEarned: number;
  onClose: () => void;
  onShare?: () => void;
  className?: string;
  language?: "th" | "en";
}

export const HeroPopup: React.FC<HeroPopupProps> = ({
  hero,
  locationName,
  locationNameEn,
  greenMilesEarned,
  onClose,
  onShare,
  className,
  language = "th",
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showAchievements, setShowAchievements] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const isEnglish = language === "en";
  const heroName = isEnglish ? hero.nameEn : hero.name;
  const heroRole = isEnglish ? hero.roleEn : hero.role;
  const heroStory = isEnglish ? hero.storyEn : hero.story;
  const heroVoiceLine = isEnglish ? hero.voiceLineEn : hero.voiceLine;
  const heroAchievements = isEnglish ? hero.achievementsEn : hero.achievements;
  const displayLocationName = isEnglish ? locationNameEn : locationName;

  // Play/pause voice line
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle audio events
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        className={cn(
          "w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-2xl animate-in zoom-in-95 duration-300",
          className,
        )}
      >
        <CardContent className="p-0">
          {/* Header with close button */}
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-lg">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-3 pr-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-white/30 overflow-hidden bg-white/20">
                  {hero.avatarUrl ? (
                    <img
                      src={hero.avatarUrl}
                      alt={heroName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Star className="w-8 h-8 text-white/60" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg">{heroName}</h3>
                <p className="text-green-100 text-sm">{heroRole}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-green-200" />
                  <span className="text-xs text-green-100">
                    {displayLocationName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Green Miles Reward */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span className="font-bold text-lg text-yellow-800">
                  +{greenMilesEarned} Green Miles!
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                {isEnglish
                  ? "Congratulations on your eco-friendly visit!"
                  : "ยินดีด้วย! คุณได้รับคะแนนจากการท่องเที่ยวอย่างยั่งยืน"}
              </p>
            </div>

            {/* Hero Message */}
            <div className="space-y-3">
              <div className="bg-white border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3 mb-2">
                      <p className="text-sm text-gray-800 italic">
                        "{heroVoiceLine}"
                      </p>
                    </div>
                    <p className="text-sm text-green-700 leading-relaxed">
                      {heroStory}
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Control */}
              <div className="flex items-center justify-center">
                <Button
                  onClick={toggleAudio}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  {isPlaying ? (
                    <VolumeX className="w-4 h-4 mr-2" />
                  ) : (
                    <Volume2 className="w-4 h-4 mr-2" />
                  )}
                  {isEnglish
                    ? isPlaying
                      ? "Stop Voice"
                      : "Play Voice"
                    : isPlaying
                      ? "หยุดเสีย���"
                      : "ฟังเสียง"}
                </Button>
              </div>

              {/* Hidden audio element */}
              <audio ref={audioRef} preload="metadata">
                <source
                  src={`/audio/heroes/${hero.id}_${language}.mp3`}
                  type="audio/mpeg"
                />
              </audio>
            </div>

            {/* Achievements */}
            {heroAchievements.length > 0 && (
              <div className="space-y-2">
                <Button
                  onClick={() => setShowAchievements(!showAchievements)}
                  variant="ghost"
                  size="sm"
                  className="w-full text-green-700 hover:bg-green-50"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  {isEnglish
                    ? `View Achievements (${heroAchievements.length})`
                    : `ดูความสำเร็จ (${heroAchievements.length})`}
                </Button>

                {showAchievements && (
                  <div className="space-y-2 animate-in slide-in-from-top duration-200">
                    {heroAchievements.map((achievement, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="w-full justify-start p-2 bg-green-50 text-green-800 border-green-200"
                      >
                        <Star className="w-3 h-3 mr-2" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {onShare && (
                <Button
                  onClick={onShare}
                  variant="outline"
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {isEnglish ? "Share" : "แชร์"}
                </Button>
              )}

              <Button
                onClick={onClose}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isEnglish ? "Continue Journey" : "เดินทางต่อ"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hero data for check-in locations
export const checkInHeroes: Record<string, Hero> = {
  farmer_somjai: {
    id: "farmer_somjai",
    name: "นายสมใจ",
    nameEn: "Farmer Somjai",
    role: "เกษตรกรปลอดสารพิษ",
    roleEn: "Organic Farmer",
    story:
      "ผมทำการเกษตรอินทรีย์มา 15 ปีแล้ว ไม่ใช้สารเคมี ปลูกผักสวนครัวให้ครอบครัวและขายในตลาดท้องถิน",
    storyEn:
      "I've been practicing organic farming for 15 years, growing chemical-free vegetables for my family and the local market.",
    voiceLine:
      "ดินที่ดีจะให้ผลผลิตที่ดี ถ้าเราใส่ใจดูแลธรรมชาติ ธรรมชาติจะดูแลเรา",
    voiceLineEn:
      "Good soil gives good harvest. If we take care of nature, nature will take care of us.",
    avatarUrl: "/images/heroes/farmer_somjai.jpg",
    achievements: [
      "ปลูกผักอินทรีย์มากกว่า 20 ชนิด",
      "ไม่ใช้สารเคมีเป็นเวลา 15 ปี",
      "สอนเด็กๆ เรื่องการเกษตรยั่งยืน",
    ],
    achievementsEn: [
      "Grows 20+ organic vegetable varieties",
      "Chemical-free farming for 15 years",
      "Teaches children about sustainable agriculture",
    ],
  },
  artisan_malee: {
    id: "artisan_malee",
    name: "ยายมาลี",
    nameEn: "Artisan Malee",
    role: "ช่างทอผ้าพื้นบ้าน",
    roleEn: "Traditional Weaver",
    story:
      "ยายทอผ้าด้วยมือมาตั้งแต่อายุ 12 ปี ใช้สีจากธรรมชาติ เก็บใบไผ่และดอกไม้มาย้อมสี",
    storyEn:
      "I've been hand-weaving since age 12, using natural dyes from bamboo leaves and flowers.",
    voiceLine:
      "ผ้าที่ทอด้วยมือมีวิญญาณ สีจากธรรมชาติจะไม่เฟดง่าย คงทนกว่าสีเคมี",
    voiceLineEn:
      "Hand-woven fabric has soul. Natural colors last longer than chemicals and won't fade easily.",
    avatarUrl: "/images/heroes/artisan_malee.jpg",
    achievements: [
      "ทอผ้ามาแล้วกว่า 50 ปี",
      "ใช้สีธรรมชาติ 100%",
      "สืบทอดภูมิปัญญาให้ลูกหลาน",
    ],
    achievementsEn: [
      "Weaving for over 50 years",
      "100% natural dyes only",
      "Preserving wisdom for generations",
    ],
  },
  ranger_niran: {
    id: "ranger_niran",
    name: "นายนิรันดร์",
    nameEn: "Ranger Niran",
    role: "เจ้าหน้าที่อนุรักษ์ป่า",
    roleEn: "Forest Conservation Officer",
    story:
      "ผมดูแลป่าแม่สามา 20 ปี เห็นการเปลี่ยนแปลงของสิ่งแวดล้อม ปลูกต้นไม้ใหม่ทุกปี",
    storyEn:
      "I've protected Mae Sa forest for 20 years, witnessing environmental changes and planting new trees annually.",
    voiceLine: "ป่าคือบ้านของสัตว์ป่าและปอดของเรา ทุกต้นไม้มีความสำคัญ",
    voiceLineEn:
      "The forest is home to wildlife and our lungs. Every tree matters.",
    avatarUrl: "/images/heroes/ranger_niran.jpg",
    achievements: [
      "ปลูกต้นไม้แล้วกว่า 5,000 ต้น",
      "ป้องกันไฟป่ามา 20 ปี",
      "อบรมเยาวชน���รื่องการอนุรักษ์",
    ],
    achievementsEn: [
      "Planted over 5,000 trees",
      "20 years of forest fire prevention",
      "Training youth in conservation",
    ],
  },
  potter_khun_chai: {
    id: "potter_khun_chai",
    name: "ลุงชาย",
    nameEn: "Uncle Chai",
    role: "ช่างปั้นดินเผา",
    roleEn: "Pottery Master",
    story:
      "ลุงทำเครื่องปั้นดินเผามา 30 ปี ใช้ดินท้องถิ่นและเผาด้วยฟืน ไม่ใช้เครื่องจักร",
    storyEn:
      "I've been making pottery for 30 years using local clay and wood firing, no machines.",
    voiceLine:
      "ดินเป็นของมีชีวิต ต้องใส่ใจปั้น ใส่ใจเผา จิตใจของช่างจะอยู่ในงาน",
    voiceLineEn:
      "Clay is alive. You must shape with care, fire with heart. The craftsman's spirit lives in the work.",
    avatarUrl: "/images/heroes/potter_chai.jpg",
    achievements: [
      "ปั้นดินเผามากกว่า 10,000 ชิ้น",
      "ใช้วิธีดั้งเดิมเท่านั้���",
      "สอนศิลปะให้คนรุ่นใหม่",
    ],
    achievementsEn: [
      "Created over 10,000 pottery pieces",
      "Traditional methods only",
      "Teaching art to new generations",
    ],
  },
  wellness_expert_pim: {
    id: "wellness_expert_pim",
    name: "หมอปิ่ม",
    nameEn: "Wellness Expert Pim",
    role: "ผู้เชี่ยวชาญสุขภาพธรรมชาติ",
    roleEn: "Natural Wellness Expert",
    story:
      "เรียนการแพทย์แผนไทยมา 25 ปี ใช้สมุนไพรท้องถิ่นรักษา เชื่อในพลังการรักษาของธรรมชาติ",
    storyEn:
      "I've studied traditional Thai medicine for 25 years, using local herbs and believing in nature's healing power.",
    voiceLine: "น้ำพุร้อนธรรมชาติช่วยบำบัดได้ สมุนไพรใกล้ตัวคื��ยาดี",
    voiceLineEn:
      "Natural hot springs can heal. Local herbs are the best medicine.",
    avatarUrl: "/images/heroes/wellness_pim.jpg",
    achievements: [
      "รักษาคนมาแล้วกว่า 5,000 คน",
      "อนุรักษ์สมุนไพรไทย 200+ ชนิด",
      "ฝึกอบรมหมอพื้นบ้าน",
    ],
    achievementsEn: [
      "Treated over 5,000 patients",
      "Conserved 200+ Thai herb species",
      "Training folk healers",
    ],
  },
  coffee_farmer_somsak: {
    id: "coffee_farmer_somsak",
    name: "พ่อสมศักดิ์",
    nameEn: "Coffee Farmer Somsak",
    role: "เกษตรกรกาแฟดอยสูง",
    roleEn: "Highland Coffee Farmer",
    story:
      "ปลูกกาแฟอาราบิก้าบนดอยสูงมา 18 ปี ใช้วิธีการปลูกแบบยั่งยืน ไม่ตัดป่า",
    storyEn:
      "Growing arabica coffee on highlands for 18 years using sustainable methods without deforestation.",
    voiceLine: "กาแฟดีต้องมาจากดินดี น้ำดี อากาศดี และใจรักของเกษตรกร",
    voiceLineEn:
      "Good coffee comes from good soil, good water, good air, and a farmer's loving heart.",
    avatarUrl: "/images/heroes/coffee_somsak.jpg",
    achievements: [
      "ปลูกกาแฟอินทรีย์ 15 ไร่",
      "รักษาป่าต้นน้ำ",
      "กาแฟได้รางวัลระดับชาติ",
    ],
    achievementsEn: [
      "15 acres of organic coffee",
      "Watershed forest conservation",
      "National coffee award winner",
    ],
  },
};
