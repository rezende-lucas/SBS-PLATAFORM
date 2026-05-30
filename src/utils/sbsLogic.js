export function calculateNextMax(currentMax, percentage, reps) {
  let increase = 0;
  
  // Progressions based on AMAP sets
  if (percentage <= 0.75) {
    if (reps <= 10) increase = 0;
    else if (reps >= 11 && reps <= 12) increase = 5;
    else if (reps >= 13) increase = 10;
  } else if (percentage === 0.80) {
    if (reps <= 8) increase = 0;
    else if (reps >= 9 && reps <= 10) increase = 5;
    else if (reps >= 11) increase = 10;
  } else if (percentage === 0.85) {
    if (reps <= 5) increase = 0;
    else if (reps >= 6 && reps <= 7) increase = 5;
    else if (reps >= 8) increase = 10;
  } else if (percentage === 0.90) {
    if (reps <= 3) increase = 0;
    else if (reps >= 4 && reps <= 5) increase = 5;
    else if (reps >= 6) increase = 10;
  }

  return currentMax + increase;
}

export function calculateWeight(max, percentage) {
  // Round to nearest 2.5 kg or 5 lbs. Assuming lbs for now based on PDF (+5, +10)
  const weight = max * percentage;
  return Math.round(weight / 5) * 5;
}
