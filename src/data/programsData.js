export const LIFT_PROGRAMS = {
  squat: [
    { id: 'sq_1x_beg', name: '1x Week - Beginner', daysPerWeek: 1 },
    { id: 'sq_1x_int', name: '1x Week - Intermediate', daysPerWeek: 1 },
    { id: 'sq_1x_adv', name: '1x Week - Advanced', daysPerWeek: 1 },
    { id: 'sq_2x_beg', name: '2x Week - Beginner', daysPerWeek: 2 },
    { id: 'sq_2x_int', name: '2x Week - Intermediate', daysPerWeek: 2 },
    { id: 'sq_2x_adv', name: '2x Week - Advanced', daysPerWeek: 2 },
    { id: 'sq_3x_beg', name: '3x Week - Beginner', daysPerWeek: 3 },
    { id: 'sq_3x_int_adv', name: '3x Week - Intermediate/Advanced', daysPerWeek: 3 },
  ],
  bench: [
    { id: 'bn_1x_beg', name: '1x Week - Beginner', daysPerWeek: 1 },
    { id: 'bn_1x_int', name: '1x Week - Intermediate', daysPerWeek: 1 },
    { id: 'bn_1x_adv', name: '1x Week - Advanced', daysPerWeek: 1 },
    { id: 'bn_2x_beg', name: '2x Week - Beginner', daysPerWeek: 2 },
    { id: 'bn_2x_int', name: '2x Week - Intermediate', daysPerWeek: 2 },
    { id: 'bn_2x_adv', name: '2x Week - Advanced', daysPerWeek: 2 },
    { id: 'bn_3x_beg', name: '3x Week - Beginner', daysPerWeek: 3 },
    { id: 'bn_3x_int_mod', name: '3x Week - Intermediate Moderate', daysPerWeek: 3 },
    { id: 'bn_3x_int_high', name: '3x Week - Intermediate High', daysPerWeek: 3 },
    { id: 'bn_3x_adv', name: '3x Week - Advanced', daysPerWeek: 3 },
  ],
  deadlift: [
    { id: 'dl_1x_beg', name: '1x Week - Beginner', daysPerWeek: 1 },
    { id: 'dl_1x_int', name: '1x Week - Intermediate', daysPerWeek: 1 },
    { id: 'dl_1x_adv', name: '1x Week - Advanced', daysPerWeek: 1 },
    { id: 'dl_2x_beg', name: '2x Week - Beginner', daysPerWeek: 2 },
    { id: 'dl_2x_int', name: '2x Week - Intermediate', daysPerWeek: 2 },
    { id: 'dl_2x_adv', name: '2x Week - Advanced', daysPerWeek: 2 },
    { id: 'dl_3x_beg', name: '3x Week - Beginner', daysPerWeek: 3 },
    { id: 'dl_3x_low', name: '3x Week - Lower Volume', daysPerWeek: 3 },
    { id: 'dl_3x_int_vol', name: '3x Week - Intermediate Volume', daysPerWeek: 3 },
    { id: 'dl_3x_high', name: '3x Week - Higher Volume', daysPerWeek: 3 },
  ]
};

// Generates generic workout template based on the day.
// In a full DB, every single set, rep, and percentage rule from the 28 spreadsheets would be here.
// For the platform logic, we return a schema:
export function getWorkoutSchema(programId, dayIndex) {
  // A generalized pattern matching for the purpose of the platform's functionality.
  // The user inputs exact weights, and AMAP set drives progression.
  const isBeginner = programId.includes('beg');
  const isAdvanced = programId.includes('adv');
  
  // Percentage decreases slightly on secondary days, or is higher for advanced.
  let percentage = 0.75;
  if (isAdvanced) percentage = 0.85;
  else if (!isBeginner && dayIndex === 1) percentage = 0.80; // Intermediate primary
  
  if (dayIndex > 1) percentage -= 0.05; // Lighter on subsequent days
  
  let totalSets = isBeginner ? 4 : (isAdvanced ? 6 : 5);
  let targetReps = isBeginner ? 5 : 3;

  const sets = [];
  for (let i = 1; i < totalSets; i++) {
    sets.push({ id: i, type: 'normal', targetReps, percentage });
  }
  
  // Last set is AMAP for Beginners and Intermediates, Advanced might just do normal sets.
  if (!isAdvanced || programId.includes('int_adv')) {
     sets.push({ id: totalSets, type: 'amap', targetReps: 'AMAP', percentage });
  } else {
     sets.push({ id: totalSets, type: 'normal', targetReps, percentage });
  }

  return sets;
}
