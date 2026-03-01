import { useState } from 'react';
import { UserProfile, DailyLog, FavoriteMeal } from '../../types';
import { Home, Calendar, TrendingUp, Settings, Plus } from 'lucide-react';
import { DashboardHome } from './dashboard-home';
import { DailyLogPage } from './daily-log-page';
import { HistoryPage } from './history-page';
import { SettingsPage } from './settings-page';
import { AddMealModal } from './add-meal-modal';

interface DashboardProps {
  userProfile: UserProfile;
  dailyLogs: DailyLog[];
  favoriteMeals?: FavoriteMeal[];
  onUpdateDailyLogs: (logs: DailyLog[]) => void;
  onUpdateFavoriteMeals?: (meals: FavoriteMeal[]) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

type DashboardPage = 'home' | 'log' | 'history' | 'settings';

export function Dashboard({
  userProfile,
  dailyLogs,
  favoriteMeals = [],
  onUpdateDailyLogs,
  onUpdateFavoriteMeals,
  onUpdateProfile,
  onLogout,
}: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('home');
  const [showAddMeal, setShowAddMeal] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find((log) => log.date === today);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar Navigation - Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <div className="w-5 h-5 rounded-lg bg-primary"></div>
            </div>
            <div>
              <h2 className="font-medium">CalorieTrack</h2>
              <p className="text-xs text-muted-foreground">{userProfile.name}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setCurrentPage('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentPage === 'home'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentPage('log')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentPage === 'log'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Daily Log</span>
            </button>

            <button
              onClick={() => setCurrentPage('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentPage === 'history'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>History</span>
            </button>

            <button
              onClick={() => setCurrentPage('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentPage === 'settings'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <div className="w-5 h-5 rounded-lg bg-primary"></div>
              </div>
              <div>
                <h2 className="font-medium">CalorieTrack</h2>
                <p className="text-xs text-muted-foreground">{userProfile.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {currentPage === 'home' && (
            <DashboardHome
              userProfile={userProfile}
              todayLog={todayLog}
              onAddMeal={() => setShowAddMeal(true)}
            />
          )}

          {currentPage === 'log' && (
            <DailyLogPage
              userProfile={userProfile}
              dailyLogs={dailyLogs}
              onUpdateDailyLogs={onUpdateDailyLogs}
              onAddMeal={() => setShowAddMeal(true)}
            />
          )}

          {currentPage === 'history' && (
            <HistoryPage userProfile={userProfile} dailyLogs={dailyLogs} />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              userProfile={userProfile}
              onUpdateProfile={onUpdateProfile}
              onLogout={onLogout}
            />
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden bg-card border-t border-border">
          <div className="grid grid-cols-4 gap-1 p-2">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${currentPage === 'home'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground'
                }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => setCurrentPage('log')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${currentPage === 'log'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground'
                }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Log</span>
            </button>

            <button
              onClick={() => setCurrentPage('history')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${currentPage === 'history'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground'
                }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs">History</span>
            </button>

            <button
              onClick={() => setCurrentPage('settings')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${currentPage === 'settings'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground'
                }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>

        {/* Floating Add Button - Mobile */}
        <button
          onClick={() => setShowAddMeal(true)}
          className="lg:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <AddMealModal
          userProfile={userProfile}
          dailyLogs={dailyLogs}
          favoriteMeals={favoriteMeals}
          onUpdateDailyLogs={onUpdateDailyLogs}
          onUpdateFavoriteMeals={onUpdateFavoriteMeals}
          onClose={() => setShowAddMeal(false)}
        />
      )}
    </div>
  );
}
