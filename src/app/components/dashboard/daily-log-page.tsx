import { useState } from 'react';
import { UserProfile, DailyLog, Meal } from '@/app/types';
import { Plus, Trash2, Coffee, Sun, Moon, Apple, Calendar } from 'lucide-react';

interface DailyLogPageProps {
  userProfile: UserProfile;
  dailyLogs: DailyLog[];
  onUpdateDailyLogs: (logs: DailyLog[]) => void;
  onAddMeal: () => void;
}

export function DailyLogPage({ userProfile, dailyLogs, onUpdateDailyLogs, onAddMeal }: DailyLogPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const selectedLog = dailyLogs.find(log => log.date === selectedDate);
  
  const getMealsByCategory = (category: Meal['category']) => {
    return selectedLog?.meals.filter(meal => meal.category === category) || [];
  };

  const handleDeleteMeal = (mealId: string) => {
    if (!selectedLog) return;
    
    const updatedMeals = selectedLog.meals.filter(meal => meal.id !== mealId);
    const updatedLog: DailyLog = {
      ...selectedLog,
      meals: updatedMeals,
      totalCalories: updatedMeals.reduce((sum, m) => sum + m.calories, 0),
      totalProtein: updatedMeals.reduce((sum, m) => sum + m.protein, 0),
      totalFat: updatedMeals.reduce((sum, m) => sum + m.fat, 0),
      totalCarbs: updatedMeals.reduce((sum, m) => sum + m.carbs, 0),
    };

    const logIndex = dailyLogs.findIndex(log => log.date === selectedDate);
    const updatedLogs = [...dailyLogs];
    updatedLogs[logIndex] = updatedLog;
    
    onUpdateDailyLogs(updatedLogs);
  };

  const categoryIcons = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snack: Apple,
  };

  const categoryLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks',
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-4">Daily Log</h1>
        
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Summary Card */}
      {selectedLog && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg mb-4">Daily Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Calories</div>
              <div className="text-2xl font-medium">{selectedLog.totalCalories}</div>
              <div className="text-xs text-muted-foreground">/ {userProfile.dailyCalories}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Protein</div>
              <div className="text-2xl font-medium">{selectedLog.totalProtein}g</div>
              <div className="text-xs text-muted-foreground">/ {userProfile.dailyProtein}g</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Carbs</div>
              <div className="text-2xl font-medium">{selectedLog.totalCarbs}g</div>
              <div className="text-xs text-muted-foreground">/ {userProfile.dailyCarbs}g</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Fat</div>
              <div className="text-2xl font-medium">{selectedLog.totalFat}g</div>
              <div className="text-xs text-muted-foreground">/ {userProfile.dailyFat}g</div>
            </div>
          </div>
        </div>
      )}

      {/* Meals by Category */}
      <div className="space-y-6">
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((category) => {
          const meals = getMealsByCategory(category);
          const Icon = categoryIcons[category];
          
          return (
            <div key={category} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg">{categoryLabels[category]}</h3>
                    {meals.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {meals.reduce((sum, m) => sum + m.calories, 0)} kcal
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {meals.length > 0 ? (
                <div className="space-y-2">
                  {meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="font-medium mb-1">{meal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {meal.calories} kcal · P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(meal.time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="w-9 h-9 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No meals logged for {categoryLabels[category].toLowerCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Meal Button */}
      <button
        onClick={onAddMeal}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
      >
        <Plus className="w-5 h-5" />
        Add Meal
      </button>
    </div>
  );
}
