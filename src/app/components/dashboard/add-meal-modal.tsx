import { useState } from 'react';
import { X, Sparkles, Check, Coffee, Sun, Moon, Apple, Edit3, Heart, Star } from 'lucide-react';
import { UserProfile, DailyLog, Meal, FavoriteMeal } from '../../types';

interface AddMealModalProps {
  userProfile: UserProfile;
  dailyLogs: DailyLog[];
  onUpdateDailyLogs: (logs: DailyLog[]) => void;
  onClose: () => void;
  favoriteMeals?: FavoriteMeal[];
  onUpdateFavoriteMeals?: (meals: FavoriteMeal[]) => void;
}

interface ParsedFood {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export function AddMealModal({ userProfile, dailyLogs, onUpdateDailyLogs, onClose, favoriteMeals = [], onUpdateFavoriteMeals }: AddMealModalProps) {
  const [input, setInput] = useState('');
  const [category, setCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedFoods, setParsedFoods] = useState<ParsedFood[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [editableFoods, setEditableFoods] = useState<ParsedFood[]>([]);

  // Manual entry state
  const [manualQuery, setManualQuery] = useState('');
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [manualFoodData, setManualFoodData] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [showManualInputs, setShowManualInputs] = useState(false);

  const handleManualEntrySave = (foodData: { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
    const newFood: ParsedFood = {
      name: foodData.name,
      calories: foodData.calories,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fat: foodData.fat,
      grams: 100, // По умолчанию 100г для ручного ввода
    };

    setParsedFoods([newFood]);
    setEditableFoods([newFood]);
    setShowManualEntry(false);
    setShowConfirmation(true);
  };

  // Manual entry functions
  const handleManualAnalyze = async () => {
    if (!manualQuery.trim()) return;

    setIsManualLoading(true);

    try {
      const response = await fetch('/api/parse-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: manualQuery }),
      });

      let data: { error?: string; items?: unknown[] };
      try {
        data = await response.json();
      } catch {
        if (response.status === 404) {
          alert('API unavailable (404). Run in separate terminal: npm run dev:api');
          setIsManualLoading(false);
          return;
        }
        throw new Error('Failed to parse response');
      }

      if (data.error || !data.items || !Array.isArray(data.items)) {
        alert('Please enter correct data');
        setIsManualLoading(false);
        return;
      }

      const item = data.items[0];
      if (item && typeof item === 'object' && 'name' in item && 'calories' in item) {
        const food = item as {
          name: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          grams?: number;
        };

        setManualFoodData({
          name: food.name || 'Meal',
          calories: food.calories || 0,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0,
        });
        setShowManualInputs(true);
      }
    } catch (error) {
      console.error('Manual analysis error:', error);
      alert('Please enter correct data');
    } finally {
      setIsManualLoading(false);
    }
  };

  const handleManualInputChange = (field: keyof typeof manualFoodData, value: string | number) => {
    setManualFoodData(prev => ({
      ...prev,
      [field]: field === 'name' ? value : Number(value) || 0,
    }));
  };

  const handleManualSave = () => {
    if (!manualFoodData.name || manualFoodData.calories <= 0) {
      alert('Please enter correct data');
      return;
    }

    const newFood: ParsedFood = {
      name: manualFoodData.name,
      calories: manualFoodData.calories,
      protein: manualFoodData.protein,
      carbs: manualFoodData.carbs,
      fat: manualFoodData.fat,
      grams: 100,
    };

    setParsedFoods([newFood]);
    setEditableFoods([newFood]);
    setShowManualEntry(false);
    setShowConfirmation(true);

    // Reset manual entry state
    setManualQuery('');
    setManualFoodData({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
    setShowManualInputs(false);
  };

  const handleProcess = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/parse-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      let data: { error?: string; items?: unknown[] };
      try {
        data = await response.json();
      } catch {
        if (!response.ok) {
          alert('API unavailable (404). Run in separate terminal: npm run dev:api');
          return;
        }
        throw new Error('Invalid API response');
      }

      if (!response.ok) {
        alert(data?.error || 'Error analyzing food.');
        return;
      }

      const items = Array.isArray(data?.items) ? data.items : [];
      const mapped: ParsedFood[] = items.map((item: { name?: string; grams?: number; calories?: number; protein?: number; fat?: number; carbs?: number }) => ({
        name: typeof item.name === 'string' ? item.name : 'Meal',
        grams: Number(item.grams) || 100,
        calories: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        fat: Number(item.fat) || 0,
        carbs: Number(item.carbs) || 0,
      }));

      if (mapped.length > 0) {
        setParsedFoods(mapped);
        setEditableFoods(mapped);
        setShowConfirmation(true);
      } else {
        alert('Could not recognize foods. Try describing dishes and grams (e.g., baked pork 200g, french fries 150g)');
      }
    } catch (error) {
      console.error('Error parsing food:', error);
      alert('Error parsing food. Try a different input format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (editableFoods.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const todayLogIndex = dailyLogs.findIndex(log => log.date === today);

    const newMeals: Meal[] = editableFoods.map(food => ({
      id: `${Date.now()}-${Math.random()}`,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      grams: food.grams,
      time: new Date(),
      category,
    }));

    let updatedLogs: DailyLog[];

    if (todayLogIndex >= 0) {
      // Update existing log
      const updatedLog = { ...dailyLogs[todayLogIndex] };
      updatedLog.meals = [...updatedLog.meals, ...newMeals];
      updatedLog.totalCalories = updatedLog.meals.reduce((sum, m) => sum + m.calories, 0);
      updatedLog.totalProtein = updatedLog.meals.reduce((sum, m) => sum + m.protein, 0);
      updatedLog.totalFat = updatedLog.meals.reduce((sum, m) => sum + m.fat, 0);
      updatedLog.totalCarbs = updatedLog.meals.reduce((sum, m) => sum + m.carbs, 0);

      updatedLogs = [...dailyLogs];
      updatedLogs[todayLogIndex] = updatedLog;
    } else {
      // Create new log for today
      const newLog: DailyLog = {
        date: today,
        meals: newMeals,
        totalCalories: newMeals.reduce((sum, m) => sum + m.calories, 0),
        totalProtein: newMeals.reduce((sum, m) => sum + m.protein, 0),
        totalFat: newMeals.reduce((sum, m) => sum + m.fat, 0),
        totalCarbs: newMeals.reduce((sum, m) => sum + m.carbs, 0),
      };

      updatedLogs = [...dailyLogs, newLog];
    }

    onUpdateDailyLogs(updatedLogs);
    onClose();
  };

  const totalNutrition = editableFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      fat: acc.fat + food.fat,
      carbs: acc.carbs + food.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const updateEditableFood = (index: number, field: keyof ParsedFood, value: string | number) => {
    const updated = [...editableFoods];
    updated[index] = {
      ...updated[index],
      [field]: field === 'name' ? value : Number(value) || 0,
    };
    setEditableFoods(updated);
  };

  const addToFavorites = (food: ParsedFood) => {
    const favorite: FavoriteMeal = {
      id: `${Date.now()}-${Math.random()}`,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      grams: food.grams,
      createdAt: new Date(),
    };

    const updatedFavorites = [...favoriteMeals, favorite];
    if (onUpdateFavoriteMeals) {
      onUpdateFavoriteMeals(updatedFavorites);
      localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavorites));
    }
  };

  const useFavoriteMeal = (favorite: FavoriteMeal) => {
    const food: ParsedFood = {
      name: favorite.name,
      calories: favorite.calories,
      protein: favorite.protein,
      fat: favorite.fat,
      carbs: favorite.carbs,
      grams: favorite.grams,
    };

    setParsedFoods([food]);
    setEditableFoods([food]);
    setShowConfirmation(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl mb-1">Add Meal</h2>
            <p className="text-sm text-muted-foreground">Describe your food and let AI calculate nutrition</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-accent transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!showConfirmation && !showManualEntry ? (
            <>
              {/* Favorite Meals */}
              {favoriteMeals.length > 0 && (
                <div className="mb-6">
                  <label className="block mb-3 text-sm">Favorite Meals</label>
                  <div className="grid gap-2 max-h-32 overflow-y-auto">
                    {favoriteMeals.map((favorite) => (
                      <button
                        key={favorite.id}
                        onClick={() => useFavoriteMeal(favorite)}
                        className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 transition-all text-left"
                      >
                        <div className="flex-1">
                          <span className="font-medium">{favorite.name}</span>
                          <div className="text-xs text-muted-foreground">
                            {favorite.calories} kcal, {favorite.grams}g
                          </div>
                        </div>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block mb-3 text-sm">Meal Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'breakfast', label: 'Breakfast', icon: Coffee },
                    { value: 'lunch', label: 'Lunch', icon: Sun },
                    { value: 'dinner', label: 'Dinner', icon: Moon },
                    { value: 'snack', label: 'Snack', icon: Apple },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value as any)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${category === cat.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Input */}
              <div className="mb-6">
                <label className="block mb-3 text-sm">Describe your meal</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 200g grilled chicken, 150g rice with vegetables or pasta with tomato sauce"
                  className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Tip: Include weight in grams for accurate calculations
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleProcess}
                  disabled={!input.trim() || isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Calculate Nutrition
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowManualEntry(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-accent transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                  Enter Nutrition Manually
                </button>
              </div>
            </>
          ) : showManualEntry ? (
            <>
              {/* Manual Entry View */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg mb-4">Enter Nutrition Manually</h3>

                  {/* Category Selection */}
                  <div className="mb-6">
                    <label className="block mb-3 text-sm">Meal Category</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: 'breakfast', label: 'Breakfast', icon: Coffee },
                        { value: 'lunch', label: 'Lunch', icon: Sun },
                        { value: 'dinner', label: 'Dinner', icon: Moon },
                        { value: 'snack', label: 'Snack', icon: Apple },
                      ].map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value as any)}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${category === cat.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                              }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="mb-6">
                    <label className="block mb-3 text-sm">Describe your meal (optional)</label>
                    <textarea
                      value={manualQuery}
                      onChange={(e) => setManualQuery(e.target.value)}
                      placeholder="e.g. chicken breast, rice, vegetables"
                      className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleManualAnalyze}
                      disabled={!manualQuery.trim() || isManualLoading}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isManualLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Analyze with AI
                        </>
                      )}
                    </button>
                  </div>

                  {/* Manual Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm">Meal Name *</label>
                      <input
                        type="text"
                        value={manualFoodData.name}
                        onChange={(e) => handleManualInputChange('name', e.target.value)}
                        placeholder="e.g. Grilled Chicken Salad"
                        className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm">Calories *</label>
                        <input
                          type="number"
                          value={manualFoodData.calories || ''}
                          onChange={(e) => handleManualInputChange('calories', e.target.value)}
                          placeholder="250"
                          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm">Protein (g)</label>
                        <input
                          type="number"
                          value={manualFoodData.protein || ''}
                          onChange={(e) => handleManualInputChange('protein', e.target.value)}
                          placeholder="25"
                          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm">Carbs (g)</label>
                        <input
                          type="number"
                          value={manualFoodData.carbs || ''}
                          onChange={(e) => handleManualInputChange('carbs', e.target.value)}
                          placeholder="30"
                          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm">Fat (g)</label>
                        <input
                          type="number"
                          value={manualFoodData.fat || ''}
                          onChange={(e) => handleManualInputChange('fat', e.target.value)}
                          placeholder="10"
                          className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowManualEntry(false)}
                      className="flex-1 py-3 px-4 rounded-xl border border-border hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleManualSave}
                      className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Add Meal
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Confirmation View */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg">Nutrition Calculated</h3>
                </div>

                {editableFoods.length === 0 ? (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-destructive">
                      Couldn't parse any foods. Try including grams (e.g., "200g chicken")
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Individual Foods - Editable */}
                    <div className="space-y-3 mb-6">
                      {editableFoods.map((food, index) => (
                        <div
                          key={index}
                          className="bg-accent/50 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <input
                              type="text"
                              value={food.name}
                              onChange={(e) => updateEditableFood(index, 'name', e.target.value)}
                              className="font-medium bg-transparent border-b border-border focus:border-primary outline-none px-1 py-0.5"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => addToFavorites(food)}
                                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                                title="Add to favorites"
                              >
                                <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                              </button>
                              <input
                                type="number"
                                value={food.grams}
                                onChange={(e) => updateEditableFood(index, 'grams', e.target.value)}
                                className="w-16 text-sm bg-transparent border border-border focus:border-primary outline-none rounded px-1 py-0.5"
                              />
                              <span className="text-sm text-muted-foreground">g</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Calories</div>
                              <input
                                type="number"
                                value={food.calories}
                                onChange={(e) => updateEditableFood(index, 'calories', e.target.value)}
                                className="font-medium w-full bg-transparent border border-border focus:border-primary outline-none rounded px-1 py-0.5"
                              />
                            </div>
                            <div>
                              <div className="text-muted-foreground">Protein</div>
                              <input
                                type="number"
                                value={food.protein}
                                onChange={(e) => updateEditableFood(index, 'protein', e.target.value)}
                                className="font-medium w-full bg-transparent border border-border focus:border-primary outline-none rounded px-1 py-0.5"
                              />
                              <span className="text-xs text-muted-foreground">g</span>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Carbs</div>
                              <input
                                type="number"
                                value={food.carbs}
                                onChange={(e) => updateEditableFood(index, 'carbs', e.target.value)}
                                className="font-medium w-full bg-transparent border border-border focus:border-primary outline-none rounded px-1 py-0.5"
                              />
                              <span className="text-xs text-muted-foreground">g</span>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Fat</div>
                              <input
                                type="number"
                                value={food.fat}
                                onChange={(e) => updateEditableFood(index, 'fat', e.target.value)}
                                className="font-medium w-full bg-transparent border border-border focus:border-primary outline-none rounded px-1 py-0.5"
                              />
                              <span className="text-xs text-muted-foreground">g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div className="text-sm text-muted-foreground mb-2">Total Nutrition</div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Calories</div>
                          <div className="text-xl font-medium">{totalNutrition.calories}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                          <div className="text-xl font-medium">{totalNutrition.protein}g</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Carbs</div>
                          <div className="text-xl font-medium">{totalNutrition.carbs}g</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Fat</div>
                          <div className="text-xl font-medium">{totalNutrition.fat}g</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Confirmation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setEditableFoods([]);
                    setParsedFoods([]);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-border hover:bg-accent transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={editableFoods.length === 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Log
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
