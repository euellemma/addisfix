// Base64 SVG placeholder photos for clean card thumbnails
const PHO_POTHOLE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23334155'/><circle cx='50' cy='50' r='30' fill='%231e293b'/><ellipse cx='48' cy='52' rx='22' ry='16' fill='%230f172a'/><path d='M30 45 Q40 38 55 42 T70 55' stroke='%23475569' stroke-width='4' fill='none'/></svg>";
const PHO_DRAIN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23475569'/><rect x='20' y='20' width='60' height='60' rx='6' fill='%231e293b'/><line x1='30' y1='25' x2='30' y2='75' stroke='%230284c7' stroke-width='6'/><line x1='45' y1='25' x2='45' y2='75' stroke='%230284c7' stroke-width='6'/><line x1='60' y1='25' x2='60' y2='75' stroke='%230284c7' stroke-width='6'/><circle cx='50' cy='60' r='10' fill='%230369a1'/></svg>";
const PHO_LIGHT = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e293b'/><line x1='50' y1='80' x2='50' y2='30' stroke='%2364748b' stroke-width='8'/><circle cx='50' cy='25' r='14' fill='%23eab308'/><circle cx='50' cy='25' r='22' fill='%23fef08a' opacity='0.3'/></svg>";
const PHO_SIDEWALK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2394a3b8'/><path d='M10 20 L45 80 L55 80 L90 20 Z' fill='%2364748b'/><line x1='10' y1='50' x2='90' y2='50' stroke='%23475569' stroke-width='4'/><line x1='50' y1='20' x2='50' y2='80' stroke='%23475569' stroke-width='4'/></svg>";

export const INITIAL_INCIDENTS = [
  {
    id: "AF-101",
    title: "Pothole",
    category: "Pothole & Asphalt Damage",
    defectType: "pothole",
    subcity: "Bole Sub-City",
    landmark: "Bole Atlas near Ednamall",
    agency: "AACRA",
    severity: 90,
    status: "High Priority",
    urgency: 4,
    description: "Large deep pothole on main road causing severe traffic slowdown.",
    coords: [9.0010, 38.7830],
    reportedAt: "2h ago",
    sla: "4 Hours SLA",
    reporter: "+251911***23",
    photoUrl: PHO_POTHOLE
  },
  {
    id: "AF-102",
    title: "Blocked Drain",
    category: "Blocked Drainage & Flooding",
    defectType: "drainage",
    subcity: "Kirkos Sub-City",
    landmark: "Meshualekia opposite CBE",
    agency: "AACRA",
    severity: 75,
    status: "In Progress",
    urgency: 3,
    description: "Storm drain clogged with debris causing street water accumulation.",
    coords: [9.0125, 38.7580],
    reportedAt: "1d ago",
    sla: "12 Hours SLA",
    reporter: "+251922***89",
    photoUrl: PHO_DRAIN
  },
  {
    id: "AF-103",
    title: "Street Light",
    category: "Fallen Electric Wire / Utility",
    defectType: "power_utility",
    subcity: "Yeka Sub-City",
    landmark: "CMC Square near St. Michael",
    agency: "EEU",
    severity: 40,
    status: "Resolved",
    urgency: 1,
    description: "Broken streetlight fixture replaced by electrical utility crew.",
    coords: [9.0220, 38.8010],
    reportedAt: "2d ago",
    sla: "Resolved",
    reporter: "+251930***12",
    photoUrl: PHO_LIGHT
  },
  {
    id: "AF-104",
    title: "Sidewalk",
    category: "Damaged Sidewalk / Road Barrier",
    defectType: "road_damage",
    subcity: "Arada Sub-City",
    landmark: "Piazza Municipal Plaza",
    agency: "AACRA",
    severity: 65,
    status: "In Progress",
    urgency: 2,
    description: "Cracked concrete paver tiles creating a trip hazard for pedestrians.",
    coords: [9.0350, 38.7520],
    reportedAt: "3d ago",
    sla: "18 Hours SLA",
    reporter: "+251912***55",
    photoUrl: PHO_SIDEWALK
  },
  {
    id: "AF-105",
    title: "Water Leakage",
    category: "Water Pipe Burst (AAWSA)",
    defectType: "water_utility",
    subcity: "Addis Ketema Sub-City",
    landmark: "Mercato Raguel Church",
    agency: "AAWSA",
    severity: 88,
    status: "High Priority",
    urgency: 4,
    description: "Underground pipe burst spraying clean water onto sidewalk.",
    coords: [9.0310, 38.7390],
    reportedAt: "4h ago",
    sla: "2 Hours SLA",
    reporter: "+251944***01",
    photoUrl: PHO_DRAIN
  }
];

export const DEFECT_CATEGORIES = [
  { value: "pothole", label: "Pothole & Asphalt Damage", agency: "AACRA", categoryName: "Pothole", defaultPhoto: PHO_POTHOLE },
  { value: "drainage", label: "Blocked Drain & Flooding", agency: "AACRA", categoryName: "Blocked Drain", defaultPhoto: PHO_DRAIN },
  { value: "power_utility", label: "Street Light / Power Utility", agency: "EEU", categoryName: "Street Light", defaultPhoto: PHO_LIGHT },
  { value: "road_damage", label: "Damaged Sidewalk / Road", agency: "AACRA", categoryName: "Sidewalk", defaultPhoto: PHO_SIDEWALK },
  { value: "water_utility", label: "Water Leakage / Pipe Burst", agency: "AAWSA", categoryName: "Water Leakage", defaultPhoto: PHO_DRAIN },
  { value: "garbage", label: "Garbage / Solid Waste", agency: "Sanitation", categoryName: "Garbage", defaultPhoto: PHO_POTHOLE }
];

export const SUBCITIES = [
  "Bole Sub-City",
  "Kirkos Sub-City",
  "Arada Sub-City",
  "Addis Ketema Sub-City",
  "Nifas Silk-Lafto",
  "Yeka Sub-City",
  "Gullele Sub-City",
  "Lideta Sub-City",
  "Kolfe Keraniyo",
  "Akaky Kaliti"
];
