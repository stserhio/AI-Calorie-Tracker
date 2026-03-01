import { useState } from 'react';
import { UserProfile, DailyLog } from '@/app/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';

interface HistoryPageProps {
  userProfile: UserProfile;
  dailyLogs: DailyLog[];
}

export function HistoryPage({ userProfile, dailyLogs }: HistoryPageProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Get logs for the selected period
  const now = new Date();
  const daysToShow = viewMode === 'week' ? 7 : 30;
  
  const getPastDays = (days: number) => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const pastDates = getPastDays(daysToShow);
  
  // Prepare chart data
  const chartData = pastDates.map(date => {
    const log = dailyLogs.find(l => l.date === date);
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    return {
      date: dayName,
      calories: log?.totalCalories || 0,
      protein: log?.totalProtein || 0,
      carbs: log?.totalCarbs || 0,
      fat: log?.totalFat || 0,
      target: userProfile.dailyCalories,
    };
  });

  // Calculate averages
  const logsInPeriod = dailyLogs.filter(log => pastDates.includes(log.date));
  const avgCalories = logsInPeriod.length > 0
    ? Math.round(logsInPeriod.reduce((sum, log) => sum + log.totalCalories, 0) / logsInPeriod.length)
    : 0;
  
  const avgProtein = logsInPeriod.length > 0
    ? Math.round(logsInPeriod.reduce((sum, log) => sum + log.totalProtein, 0) / logsInPeriod.length)
    : 0;

  const caloriesDiff = avgCalories - userProfile.dailyCalories;
  const proteinDiff = avgProtein - userProfile.dailyProtein;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-4">History & Analytics</h1>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                viewMode === 'week'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-foreground hover:bg-accent/80'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                viewMode === 'month'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-foreground hover:bg-accent/80'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg mb-4">Average Calories</h3>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-medium">{avgCalories}</div>
            <div className="text-muted-foreground mb-1">kcal/day</div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {caloriesDiff > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">+{caloriesDiff} over target</span>
              </>
            ) : caloriesDiff < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">{Math.abs(caloriesDiff)} under target</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">On target</span>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg mb-4">Average Protein</h3>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-medium">{avgProtein}</div>
            <div className="text-muted-foreground mb-1">g/day</div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {proteinDiff > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">+{proteinDiff}g over target</span>
              </>
            ) : proteinDiff < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">{Math.abs(proteinDiff)}g under target</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">On target</span>
            )}
          </div>
        </div>
      </div>

      {/* Calorie Trend Chart */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-lg mb-6">Calorie Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#94a3b8"
              strokeDasharray="5 5"
              name="Target"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#10b981"
              strokeWidth={2}
              name="Calories"
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Macros Distribution Chart */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg mb-6">Macronutrients Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
              }}
            />
            <Legend />
            <Bar dataKey="protein" fill="#3b82f6" name="Protein (g)" />
            <Bar dataKey="carbs" fill="#8b5cf6" name="Carbs (g)" />
            <Bar dataKey="fat" fill="#f59e0b" name="Fat (g)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
