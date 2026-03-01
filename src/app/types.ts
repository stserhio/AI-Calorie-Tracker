export interface UserProfile {
  name: string;
  email: string;
  gender: 'male' | 'female';
  age: number;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'lose' | 'maintain' | 'gain';
  dailyCalories: number;
  dailyProtein: number;
  dailyFat: number;
  dailyCarbs: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  grams: number;
  time: Date;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface FavoriteMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  grams: number;
  createdAt: Date;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  weight?: number;
}
