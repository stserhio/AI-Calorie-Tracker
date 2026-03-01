# Calorie and Macro Calculation Formulas

## Basal Metabolic Rate (BMR) Formulas

### Mifflin-St Jeor Equation (Recommended)
**For Men:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```

**For Women:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
```

### Harris-Benedict Equation (Alternative)
**For Men:**
```
BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
```

**For Women:**
```
BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)
```

## Total Daily Energy Expenditure (TDEE)

Multiply BMR by activity level:

- **Sedentary:** BMR × 1.2
  - Little or no exercise, desk job
- **Light:** BMR × 1.375
  - Light exercise/sports 1-3 days/week
- **Moderate:** BMR × 1.55
  - Moderate exercise/sports 3-5 days/week
- **Active:** BMR × 1.725
  - Hard exercise/sports 6-7 days a week
- **Very Active:** BMR × 1.9
  - Very hard exercise/sports & physical job

## Calorie Goals Based on Objective

### Weight Loss
```
Target Calories = TDEE - 500 (for 1lb/week loss)
Target Calories = TDEE - 1000 (for 2lbs/week loss)
```

### Weight Maintenance
```
Target Calories = TDEE
```

### Weight Gain
```
Target Calories = TDEE + 300-500 (for lean muscle gain)
Target Calories = TDEE + 500-1000 (for faster weight gain)
```

## Macronutrient Distribution

### Standard Distribution (40/30/30)
- **Protein:** 30% of total calories ÷ 4 calories per gram
- **Carbs:** 40% of total calories ÷ 4 calories per gram  
- **Fat:** 30% of total calories ÷ 9 calories per gram

### High Protein (40/30/30)
- **Protein:** 40% of total calories ÷ 4
- **Carbs:** 30% of total calories ÷ 4
- **Fat:** 30% of total calories ÷ 9

### Low Carb (20/50/30)
- **Protein:** 50% of total calories ÷ 4
- **Carbs:** 20% of total calories ÷ 4
- **Fat:** 30% of total calories ÷ 9

## Implementation in Code

```typescript
function calculateDailyTargets(profile: UserProfile) {
  // Calculate BMR using Mifflin-St Jeor
  let bmr: number;
  if (profile.gender === 'male') {
    bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5;
  } else {
    bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
  }

  // Apply activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9
  };
  
  const tdee = bmr * activityMultipliers[profile.activityLevel];

  // Adjust for goal
  let targetCalories: number;
  switch (profile.goal) {
    case 'lose':
      targetCalories = tdee - 500; // 1lb per week loss
      break;
    case 'gain':
      targetCalories = tdee + 500; // Lean muscle gain
      break;
    case 'maintain':
    default:
      targetCalories = tdee;
      break;
  }

  // Calculate macros (using 40/30/30 distribution)
  const protein = Math.round((targetCalories * 0.3) / 4); // 30% protein
  const carbs = Math.round((targetCalories * 0.4) / 4);   // 40% carbs
  const fat = Math.round((targetCalories * 0.3) / 9);    // 30% fat

  return {
    dailyCalories: Math.round(targetCalories),
    dailyProtein: protein,
    dailyCarbs: carbs,
    dailyFat: fat
  };
}
```

## Notes

1. **Minimum calories:** Never go below 1200 calories for women or 1500 calories for men
2. **Protein minimum:** Minimum 0.8g per kg bodyweight for sedentary, 1.2-1.6g for active individuals
3. **Fat minimum:** Minimum 20-25% of total calories for hormone production
4. **Carb minimum:** Minimum 130g per day for brain function
5. **Adjustments:** These formulas provide starting points - individual results may vary based on genetics, metabolism, and other factors
