import { UserProfile, DailyLog } from '../../types';
import { Plus, Flame, TrendingUp } from 'lucide-react';
import { ProgressRing } from '../ui/progress-ring';
import { MacroBar } from '../ui/macro-bar';
import { NutritionFact } from './nutrition-fact';

interface DashboardHomeProps {
  userProfile: UserProfile;
  todayLog?: DailyLog;
  onAddMeal: () => void;
}

export function DashboardHome({ userProfile, todayLog, onAddMeal }: DashboardHomeProps) {
  const consumed = {
    calories: todayLog?.totalCalories || 0,
    protein: todayLog?.totalProtein || 0,
    fat: todayLog?.totalFat || 0,
    carbs: todayLog?.totalCarbs || 0,
  };

  const remaining = {
    calories: userProfile.dailyCalories - consumed.calories,
    protein: userProfile.dailyProtein - consumed.protein,
    fat: userProfile.dailyFat - consumed.fat,
    carbs: userProfile.dailyCarbs - consumed.carbs,
  };

  const calorieProgress = (consumed.calories / userProfile.dailyCalories) * 100;
  const proteinProgress = (consumed.protein / userProfile.dailyProtein) * 100;
  const fatProgress = (consumed.fat / userProfile.dailyFat) * 100;
  const carbsProgress = (consumed.carbs / userProfile.dailyCarbs) * 100;

  // Determine if macros are exceeded
  const isCaloriesExceeded = calorieProgress > 100;
  const isProteinExceeded = proteinProgress > 100;
  const isFatExceeded = fatProgress > 100;
  const isCarbsExceeded = carbsProgress > 100;

  const recentMeals = todayLog?.meals.slice(-3).reverse() || [];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Today's Progress</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Calorie Progress Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg mb-1">Calories</h3>
              <p className="text-sm text-muted-foreground">
                {remaining.calories > 0 ? `${remaining.calories} kcal remaining` : 'Goal reached!'}
              </p>
            </div>
            <Flame className="w-6 h-6 text-[#10b981]" />
          </div>

          <div className="flex items-center justify-center mb-6">
            <ProgressRing
              value={calorieProgress}
              size={180}
              strokeWidth={12}
              color="#10b981"
            >
              <div className="text-center">
                <div className="text-3xl font-medium mb-1">{consumed.calories}</div>
                <div className="text-sm text-muted-foreground">of {userProfile.dailyCalories}</div>
              </div>
            </ProgressRing>
          </div>

          <button
            onClick={onAddMeal}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Meal
          </button>
        </div>

        {/* Macros Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg mb-1">Macronutrients</h3>
              <p className="text-sm text-muted-foreground">Daily breakdown</p>
            </div>
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>

          <div className="space-y-6">
            {/* Protein */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Protein</span>
                <span className="text-sm font-medium">
                  {consumed.protein}g / {userProfile.dailyProtein}g
                </span>
              </div>
              <MacroBar progress={proteinProgress} color="#3b82f6" />
            </div>

            {/* Carbs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Carbs</span>
                <span className="text-sm font-medium">
                  {consumed.carbs}g / {userProfile.dailyCarbs}g
                </span>
              </div>
              <MacroBar progress={carbsProgress} color="#8b5cf6" />
            </div>

            {/* Fat */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Fat</span>
                <span className="text-sm font-medium">
                  {consumed.fat}g / {userProfile.dailyFat}g
                </span>
              </div>
              <MacroBar progress={fatProgress} color="#f59e0b" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      {recentMeals.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg mb-4">Recent Meals</h3>
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
              >
                <div>
                  <div className="font-medium mb-1">{meal.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(meal.time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{meal.calories} kcal</div>
                  <div className="text-sm text-muted-foreground">
                    P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentMeals.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg mb-2">No meals logged today</h3>
          <p className="text-muted-foreground mb-6">Start tracking your nutrition by adding your first meal</p>
          <button
            onClick={onAddMeal}
            className="inline-flex items-center gap-2 py-2 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Meal
          </button>
        </div>
      )}

      {/* Nutrition Fact of the Day */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">💡 Nutrition Tip of the Day</h2>
        <NutritionFact />
      </div>
    </div>
  );
}
