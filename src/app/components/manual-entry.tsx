'use client';

import { useState } from 'react';
import { Sparkles, Save, X } from 'lucide-react';

interface FoodData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ManualEntryProps {
  onSave: (foodData: FoodData) => void;
  onClose: () => void;
}

export default function ManualEntry({ onSave, onClose }: ManualEntryProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foodData, setFoodData] = useState<FoodData>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [showInputs, setShowInputs] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/parse-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      let data: { error?: string; items?: unknown[] };
      try {
        data = await response.json();
      } catch {
        if (response.status === 404) {
          alert('API недоступен (404). Запустите в отдельном терминале: npm run dev:api');
          return;
        }
        throw new Error('API request failed');
      }

      if (!response.ok) {
        alert(data?.error || 'Ошибка при анализе пищи.');
        return;
      }
      console.log('AI Response:', data);

      const items = Array.isArray(data?.items) ? data.items : [];
      const first = items[0] as any;
      if (first) {
        setFoodData({
          name: first.name ?? '',
          calories: Number(first.calories) || 0,
          protein: Number(first.protein) || 0,
          carbs: Number(first.carbs) || 0,
          fat: Number(first.fat) || 0,
        });
      } else {
        setFoodData({ name: 'Meal', calories: 0, protein: 0, carbs: 0, fat: 0 });
      }
      setShowInputs(true);
    } catch (error) {
      console.error('Error analyzing food:', error);
      alert('Error analyzing food. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Validation before saving
    if (!foodData.name.trim()) {
      alert('Please enter a meal name');
      return;
    }

    if (foodData.calories < 0 || foodData.calories > 5000) {
      alert('Calories must be between 0 and 5000');
      return;
    }

    if (foodData.protein < 0 || foodData.protein > 200) {
      alert('Protein must be between 0 and 200g');
      return;
    }

    if (foodData.carbs < 0 || foodData.carbs > 500) {
      alert('Carbs must be between 0 and 500g');
      return;
    }

    if (foodData.fat < 0 || foodData.fat > 200) {
      alert('Fat must be between 0 and 200g');
      return;
    }

    onSave(foodData);
  };

  const handleInputChange = (field: keyof FoodData, value: string | number) => {
    setFoodData(prev => ({
      ...prev,
      [field]: field === 'name' ? value : Number(value) || 0,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Добавить еду</h2>
            <p className="text-sm text-gray-600">Опишите что вы съели, и AI рассчитает КБЖУ</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Text Input */}
          <div className="mb-6">
            <label className="block mb-3 text-sm font-medium text-gray-700">
              Опишите вашу еду
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Например: я съел два яйца с тостами и выпил кофе"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Опишите продукты и их количество для точного расчета
            </p>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!query.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Анализирую...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze with AI
              </>
            )}
          </button>

          {/* Editable Inputs */}
          {showInputs && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Анализ завершен</h3>
                <p className="text-sm text-green-600">
                  Проверьте и отредактируйте данные перед сохранением
                </p>
              </div>

              {/* Name Input */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Название блюда
                </label>
                <input
                  type="text"
                  value={foodData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Название"
                />
              </div>

              {/* Nutrition Inputs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Калории
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={foodData.calories}
                      onChange={(e) => handleInputChange('calories', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">ккал</span>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Белки
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={foodData.protein}
                      onChange={(e) => handleInputChange('protein', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">г</span>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Углеводы
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={foodData.carbs}
                      onChange={(e) => handleInputChange('carbs', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">г</span>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Жиры
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={foodData.fat}
                      onChange={(e) => handleInputChange('fat', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">г</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save to Log
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
