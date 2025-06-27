export interface ARHero {
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

export interface ARLocation {
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

export const arHeroLocations: ARLocation[] = [
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
        "ในป่าผืนนี้มีต้นไม้มากกว่า 300 ชนิด เราปลูกใหม่ทุกปี ป่าจะอยู่กับเรา ถ้าเราอยู่กับป่า",
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
      english: "Met a real forest guardian at Doi Pui 🌲🇹🇭 #EcoHero #ChiangMai",
    },
  },
  {
    id: "aunt_pen_cafe",
    name: "ร้านกาแฟป้าเป็น",
    nameEn: "Aunt Pen's Café",
    type: "community_spot",
    description: "ร้านกาแฟชุมชนที่เลิกใช้พลาสติกตั้งแต่ปี 2562",
    descriptionEn: "Community café that went plastic-free since 2019",
    sustainabilityFeature: "ปลอดพลาสติก ใช้ถ้วยไผ่และหลอดกระดาษ",
    sustainabilityFeatureEn: "Plastic-free with bamboo cups and paper straws",
    coordinates: { lat: 18.7756, lng: 98.9856 },
    arMarkerId: "pen_cafe_marker",
    hero: {
      id: "aunt_pen",
      name: "ป้าเป็น",
      nameEn: "Aunt Pen",
      role: "เจ้าของร้านกาแฟ",
      roleEn: "Café Owner",
      story: "ป้าเป็นเป็นคนแรกในย่านที่เลิกใช้พลาสติก เธอทำให้ร้านอื่น ๆ ตามมา",
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
        "เป็นแรงบันดาลใจให้ร���าน 20+ ร้าน",
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
  {
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
  {
    id: "huai_kaew_waterfall",
    name: "น้ำตกห้วยแก้ว",
    nameEn: "Huai Kaew Waterfall",
    type: "tourist_spot",
    description: "น้ำตกที่มีระบบผลิตไฟฟ้าจากพลังน้ำขนาดเล็ก",
    descriptionEn: "Waterfall with small-scale hydroelectric power generation",
    sustainabilityFeature: "ใช้พลังน้ำผลิตไฟฟ้าสำหรับเส้นทางเดิน",
    sustainabilityFeatureEn: "Hydroelectric power for walking trail lighting",
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
      voiceLine: "น้ำตกนี้ให้พลังงานสะอาดแก่เราทุกวัน โดยไม่ทำร้ายธรรมชาติ",
      voiceLineEn:
        "This waterfall gives us clean energy every day without harming nature.",
      audioUrl: "/audio/niran-thai.mp3",
      audioUrlEn: "/audio/niran-english.mp3",
      imageUrl: "/images/ranger-niran.jpg",
      avatarUrl: "/avatars/niran-3d.glb",
      achievements: [
        "ออกแบบระบบไฟฟ้าเป็นมิตรกับสิ่งแวดล้อม",
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
      thai: "พบกับนักอนุ��ักษ์พลังงานที่น้ำตกห้วยแก้ว ⚡🇹🇭 #CleanEnergy #ChiangMai",
      english:
        "Met an energy conservationist at Huai Kaew Waterfall ⚡🇹🇭 #CleanEnergy #ChiangMai",
    },
  },
];

export function getARLocationById(id: string): ARLocation | null {
  return arHeroLocations.find((location) => location.id === id) || null;
}

export function getARLocationByMarkerId(markerId: string): ARLocation | null {
  return (
    arHeroLocations.find((location) => location.arMarkerId === markerId) || null
  );
}

export function getAllARLocations(): ARLocation[] {
  return arHeroLocations;
}

export function getLocationsByType(
  type: "tourist_spot" | "community_spot",
): ARLocation[] {
  return arHeroLocations.filter((location) => location.type === type);
}
