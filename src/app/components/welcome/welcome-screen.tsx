import { useState } from 'react';
import { ArrowRight, Sparkles, Target, TrendingUp, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12 fade-in">
      <div className="w-full max-w-4xl slide-in">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Calorie<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Tracker</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your nutrition, reach your goals, and transform your health with intelligent calorie counting
          </p>

          <button
            onClick={onGetStarted}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 btn-hover"
          >
            Get Started
            <ArrowRight className={`w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg card-hover">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Goals</h3>
            <p className="text-gray-600">
              Set personalized calorie targets based on your age, weight, height, and activity level
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg card-hover">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h3>
            <p className="text-gray-600">
              Simply describe your meal and let AI automatically calculate calories and macros
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg card-hover">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your daily intake, track trends, and stay on top of your nutrition goals
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Join thousands achieving their health goals</span>
          </div>

          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <div>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div>Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1M+</div>
              <div>Meals Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div>App Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
