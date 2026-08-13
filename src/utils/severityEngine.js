export function calculateSeverityScore(defectType, urgency, isGpsVerified = true) {
  let baseScore = 32;

  const categoryWeights = {
    pothole: 25,
    water_utility: 30,
    power_utility: 35,
    hazard: 40,
    drainage: 25,
    garbage: 15,
    road_damage: 15,
    delayed_build: 10
  };

  baseScore += (categoryWeights[defectType] || 15);
  baseScore += (urgency * 12);

  // GPS precision boost
  if (isGpsVerified) {
    baseScore += 6;
  }

  const score = Math.min(Math.max(baseScore, 10), 99);

  let levelText = "Low";
  let levelClass = "low";

  if (score >= 85) {
    levelText = "Critical";
    levelClass = "critical";
  } else if (score >= 70) {
    levelText = "High";
    levelClass = "high";
  } else if (score >= 45) {
    levelText = "Medium";
    levelClass = "medium";
  }

  return { score, levelText, levelClass };
}

export function getSeverityColor(score) {
  if (score >= 85) return '#ef4444'; // Red
  if (score >= 70) return '#f59e0b'; // Amber
  if (score >= 45) return '#0284c7'; // Blue
  return '#10b981'; // Green
}
