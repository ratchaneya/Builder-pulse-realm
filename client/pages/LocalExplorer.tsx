import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocalDestinationCard } from "@/components/ui/local-destination-card";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  MapPin,
  Compass,
  Coffee,
  Utensils,
  Palette,
  Mountain,
  Sparkles,
  TreePine,
  ArrowLeft,
} from "lucide-react";

interface LocalDestination {
  id: string;
  name: string;
  description: string;
  type: "cafe" | "local_food" | "workshop" | "scenic" | "market" | "cultural";
  openingHours: string;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
    district: string;
  };
  highlights: string[];
  priceRange: "budget" | "moderate" | "premium";
  isOpen?: boolean;
}

// Local destinations outside Nimman area
const localDestinations: LocalDestination[] = [
  {
    id: "aunt_pen_cafe",
    name: "คาเฟ่ป้าเป็น",
    description: "คาเฟ่เล็กๆ ริมลำธาร เสิร์ฟกาแฟหอมกรุ่นและขนมโฮมเมด",
    type: "cafe",
    openingHours: "07:00-18:00",
    location: {
      name: "หมู่บ้านแม่เหียะ",
      coordinates: { lat: 18.7261, lng: 98.9389 },
      district: "แม่เหียะ",
    },
    highlights: ["กาแฟดริป", "ขนมโฮมเมด", "ริมลำธาร"],
    priceRange: "budget",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "grandma_mali_weaving",
    name: "เวิร์คช็อปทอผ้ายายมาลี",
    description: "เรียนรู้การทอผ้าแบบดั้งเดิม ใช้สีจากธรรมชาติ",
    type: "workshop",
    openingHours: "09:00-17:00",
    location: {
      name: "หมู่บ้านบ้านโป่ง",
      coordinates: { lat: 18.8147, lng: 99.0525 },
      district: "บ้านโป่ง",
    },
    highlights: ["ทอผ้าด้วยมือ", "สีธรรมชาติ", "ภูมิปัญญาท้องถิ่น"],
    priceRange: "moderate",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "khun_chai_pottery",
    name: "เวิร์คช็อปปั้นดินเผาลุงชาย",
    description: "ปั้นดินเผาแบบดั้งเดิม เผาด้วยฟืน ไม่ใช้เครื่องจักร",
    type: "workshop",
    openingHours: "08:00-16:00",
    location: {
      name: "หมู่บ้านเครื่อง��ั้นดินเผา",
      coordinates: { lat: 18.6719, lng: 98.9342 },
      district: "หางดง",
    },
    highlights: ["ปั้นดินเผา", "เผาด้วยฟืน", "วิธีดั้งเดิม"],
    priceRange: "moderate",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1565193286027-0332605e6c92?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "mae_sa_waterfall_cafe",
    name: "คาเฟ่น้ำตกแม่สา",
    description: "คาเฟ่กลางป่า ริมน้ำตก เสียงธรรมชาติผ่อนคลาย",
    type: "cafe",
    openingHours: "08:00-17:00",
    location: {
      name: "น้ำตกแม่สา",
      coordinates: { lat: 18.9167, lng: 99.0833 },
      district: "แม่ริม",
    },
    highlights: ["ริมน้ำตก", "กลางป่า", "เสียงธรรมชาติ"],
    priceRange: "moderate",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1493804714600-6edb1cd93080?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "doi_saket_coffee_farm",
    name: "ไร่กาแฟดอยสะเก็ด",
    description: "ไร่กาแฟอินทรีย์บนดอยสูง ชิมกาแฟสดใหม่จากต้น",
    type: "scenic",
    openingHours: "06:00-18:00",
    location: {
      name: "ดอยสะเก็ด",
      coordinates: { lat: 18.9167, lng: 99.2167 },
      district: "ดอยสะเก็ด",
    },
    highlights: ["กาแฟอินทรีย์", "วิวดอยสูง", "ทัวร์ไร่กาแฟ"],
    priceRange: "moderate",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "ban_tawai_woodcarving",
    name: "หมู่บ้านแกะสลักไม้บ้านถวาย",
    description: "แกะสลักไม้ระดับศิลปกรรม ชมการสาธิตและซื้อของฝาก",
    type: "cultural",
    openingHours: "08:00-18:00",
    location: {
      name: "บ้านถวาย",
      coordinates: { lat: 18.6547, lng: 98.9275 },
      district: "หางดง",
    },
    highlights: ["แกะสลักไม้", "ศิลปกรรม", "ของฝากพิเศษ"],
    priceRange: "budget",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1565193286027-0332605e6c92?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "san_kamphaeng_night_market",
    name: "ตลาดค่ำสันกำแพง",
    description: "ตลาดค่ำท้องถิ่น อาหารอร่อย ราคาถูก บรรยากาศดี",
    type: "market",
    openingHours: "17:00-22:00",
    location: {
      name: "ตลาดสันกำแพง",
      coordinates: { lat: 18.7606, lng: 99.1828 },
      district: "สันกำแพง",
    },
    highlights: ["อาหารริมทาง", "ราคาถูก", "ของใช้ท้องถิ่น"],
    priceRange: "budget",
    isOpen: false,
    imageUrl:
      "https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "mae_taeng_elephant_sanctuary",
    name: "ปางช้างแม่แตง",
    description: "อนุรักษ์ช้างอย่างยั่งยืน ไม่มีการบังคับช้างแสดง",
    type: "scenic",
    openingHours: "08:00-17:00",
    location: {
      name: "แม่แตง",
      coordinates: { lat: 19.1167, lng: 98.9833 },
      district: "แม่แตง",
    },
    highlights: ["อนุรักษ์ช้าง", "การท่องเที่ยวยั่งยืน", "ธรรมชาติ"],
    priceRange: "premium",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1551845041-63e8e76836bb?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "baan_kang_wat_community",
    name: "ชุมชนบ้านข้างวัด",
    description: "ชุมชนท่องเที่ยวเชิงวัฒนธรรม เรียนรู้วิถีชีวิตท้องถิ่น",
    type: "cultural",
    openingHours: "09:00-16:00",
    location: {
      name: "บ้านข้างวัด",
      coordinates: { lat: 18.8456, lng: 99.0123 },
      district: "สันทราย",
    },
    highlights: ["ท่องเที่ยวชุมชน", "วัฒนธรรมท้องถิ่น", "วิถีชีวิต"],
    priceRange: "budget",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1552832230-6ab2069bb588?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "khao_soi_mae_manee",
    name: "ข้าวซอยแม่มณี",
    description: "ข้าวซอยแม่มณี อร่อยระดับตำนาน เปิดมา 40 ปี",
    type: "local_food",
    openingHours: "10:00-15:00",
    location: {
      name: "ตลาดสด",
      coordinates: { lat: 18.7123, lng: 98.9876 },
      district: "เมือง",
    },
    highlights: ["ข้าวซอยต้นตำรับ", "40 ปี", "รสชาติดั้งเดิม"],
    priceRange: "budget",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03246963d24a?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "organic_farm_mae_jo",
    name: "ฟาร์มออร์แกนิคแม่โจ้",
    description: "ฟาร์มผักออร์แกนิค เก็บผักสด ทำอาหารด้วยตนเอง",
    type: "workshop",
    openingHours: "09:00-17:00",
    location: {
      name: "มหาวิทยาลัยแม่โจ้",
      coordinates: { lat: 18.8978, lng: 99.2234 },
      district: "สันทราย",
    },
    highlights: ["ผักออร์แกนิค", "ทำอาหารเอง", "เรียนรู้การเกษตร"],
    priceRange: "moderate",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "huai_kaew_waterfall",
    name: "น้ำตกห้วยแก้ว",
    description: "น้ำตกสวยงาม เส้นทางเดินป่าไม่ยาก เหมาะพักผ่อน",
    type: "scenic",
    openingHours: "06:00-18:00",
    location: {
      name: "อุทยานแห่งชาติดอยสุเทพ-ปุย",
      coordinates: { lat: 18.8156, lng: 98.9234 },
      district: "เมือง",
    },
    highlights: ["น้ำตกสวย", "เดินป่า", "ธรรมชาติ"],
    priceRange: "budget",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
  },
];

export default function LocalExplorer() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [filteredDestinations, setFilteredDestinations] =
    React.useState(localDestinations);

  // Filter destinations based on search and type
  React.useEffect(() => {
    let filtered = localDestinations;

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((dest) => dest.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.location.district
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          dest.highlights.some((highlight) =>
            highlight.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, selectedType]);

  const typeOptions = [
    { value: "all", label: "ทั้งหมด", icon: Compass },
    { value: "cafe", label: "คาเฟ่", icon: Coffee },
    { value: "local_food", label: "อาหารท้องถิ่น", icon: Utensils },
    { value: "workshop", label: "เวิร์คช็อป", icon: Palette },
    { value: "scenic", label: "จุดชมวิว", icon: Mountain },
    { value: "market", label: "ตลาดท้องถิ่น", icon: Sparkles },
    { value: "cultural", label: "วัฒนธรรม", icon: TreePine },
  ];

  const getTypeCount = (type: string) => {
    if (type === "all") return localDestinations.length;
    return localDestinations.filter((dest) => dest.type === type).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1552832230-6ab2069bb588?w=1200&h=800&fit=crop&crop=center"
          alt="Traditional Thai village"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 to-emerald-50/90"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-green-200 shadow-sm sticky top-0">
        <div className="container max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="text-green-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              กลับ
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-green-900">
                Local Explorer
              </h1>
              <p className="text-sm text-green-600">
                สำรวจสถานที่ท้องถิ่นนอกเมือง
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="container max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="ค้นหาสถานที่, อาหาร, กิจกรรม..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-green-200 focus:border-green-400"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full bg-white border-green-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{option.label}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {getTypeCount(option.value)}
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>พบ {filteredDestinations.length} สถานที่</span>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="text-green-600 hover:text-green-700"
            >
              ล้างการค้นหา
            </Button>
          )}
        </div>
      </section>

      {/* Destinations List */}
      <main className="container max-w-md mx-auto px-4 pb-6">
        {filteredDestinations.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-8 text-center">
              <Compass className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ไม่พบสถานที่ที่ค้นหา
              </h3>
              <p className="text-gray-600 mb-4">
                ลองเปลี่ยนคำค้นหาหรือประเภทสถานที่
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                }}
                variant="outline"
                className="border-green-300 text-green-700"
              >
                แสดงทั้งหมด
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDestinations.map((destination) => (
              <LocalDestinationCard
                key={destination.id}
                destination={destination}
                onNavigate={(dest) => {
                  console.log(`Navigating to ${dest.name}`);
                  // Track analytics here if needed
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Info */}
      <footer className="container max-w-md mx-auto px-4 pb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Compass className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-blue-900 mb-1">
              สนับสนุนการท่องเที่ยวยั่งยืน
            </h3>
            <p className="text-sm text-blue-700">
              สำรวจสถานที่ท้องถิ่นนอกเมือง ลดความแออัด สร้างรายได้ให้ชุมชน
            </p>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
