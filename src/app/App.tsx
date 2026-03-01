import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/error/error-boundary';
import { LoginPage } from './components/auth/login-page';
import { RegisterPage } from './components/auth/register-page';
import { ForgotPasswordPage } from './components/auth/forgot-password-page';
import { WelcomeScreen } from './components/welcome/welcome-screen';
import { OnboardingFlow } from './components/onboarding/onboarding-flow';
import { Dashboard } from './components/dashboard/dashboard';
import { UserProfile, DailyLog, FavoriteMeal } from './types';

type Page = 'welcome' | 'login' | 'register' | 'forgot-password' | 'onboarding' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<FavoriteMeal[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedLogs = localStorage.getItem('dailyLogs');
    const savedFavorites = localStorage.getItem('favoriteMeals');
    const savedAuth = localStorage.getItem('isAuthenticated');

    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('onboarding');
      }
    } else {
      // If not authenticated, show welcome screen
      setCurrentPage('welcome');
    }

    if (savedLogs) {
      setDailyLogs(JSON.parse(savedLogs));
    }

    if (savedFavorites) {
      setFavoriteMeals(JSON.parse(savedFavorites));
    }
  }, []);

  const handleGetStarted = () => {
    setCurrentPage('register');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');

    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('onboarding');
    }
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setCurrentPage('onboarding');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userProfile');
    setCurrentPage('login');
  };

  const updateDailyLogs = (logs: DailyLog[]) => {
    setDailyLogs(logs);
    localStorage.setItem('dailyLogs', JSON.stringify(logs));
  };

  const updateFavoriteMeals = (meals: FavoriteMeal[]) => {
    setFavoriteMeals(meals);
    localStorage.setItem('favoriteMeals', JSON.stringify(meals));
  };

  return (
    <ErrorBoundary>
      <div className="size-full">
        {currentPage === 'welcome' && (
          <WelcomeScreen onGetStarted={handleGetStarted} />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={() => setCurrentPage('register')}
            onNavigateToForgotPassword={() => setCurrentPage('forgot-password')}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPasswordPage onNavigateToLogin={() => setCurrentPage('login')} />
        )}

        {currentPage === 'onboarding' && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}

        {currentPage === 'dashboard' && userProfile && (
          <Dashboard
            userProfile={userProfile}
            dailyLogs={dailyLogs}
            favoriteMeals={favoriteMeals}
            onUpdateDailyLogs={updateDailyLogs}
            onUpdateFavoriteMeals={updateFavoriteMeals}
            onUpdateProfile={(profile) => {
              setUserProfile(profile);
              localStorage.setItem('userProfile', JSON.stringify(profile));
            }}
            onLogout={handleLogout}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}