import { useState } from 'react';
import { UserProfile } from '@/app/types';
import { LogOut, User, Target, Activity, Save } from 'lucide-react';

interface SettingsPageProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

export function SettingsPage({ userProfile, onUpdateProfile, onLogout }: SettingsPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: userProfile.age.toString(),
    height: userProfile.height.toString(),
    weight: userProfile.weight.toString(),
    activityLevel: userProfile.activityLevel,
    goal: userProfile.goal,
  });

  const handleSave = () => {
    // Recalculate targets with new data
    const age = parseInt(formData.age);
    const height = parseInt(formData.height);
    const weight = parseInt(formData.weight);
    const { activityLevel, goal } = formData;
    const { gender } = userProfile;

    // Calculate BMR
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9,
    };

    let tdee = bmr * activityMultipliers[activityLevel];

    // Adjust for goal
    if (goal === 'lose') {
      tdee -= 500;
    } else if (goal === 'gain') {
      tdee += 300;
    }

    const dailyCalories = Math.round(tdee);
    const dailyProtein = Math.round((dailyCalories * 0.3) / 4);
    const dailyCarbs = Math.round((dailyCalories * 0.4) / 4);
    const dailyFat = Math.round((dailyCalories * 0.3) / 9);

    const updatedProfile: UserProfile = {
      ...userProfile,
      age,
      height,
      weight,
      activityLevel,
      goal,
      dailyCalories,
      dailyProtein,
      dailyCarbs,
      dailyFat,
    };

    onUpdateProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      age: userProfile.age.toString(),
      height: userProfile.height.toString(),
      weight: userProfile.weight.toString(),
      activityLevel: userProfile.activityLevel,
      goal: userProfile.goal,
    });
    setIsEditing(false);
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {/* Profile Info */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg">{userProfile.name}</h3>
            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 p-4 rounded-xl bg-accent/50">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Gender</div>
            <div className="capitalize">{userProfile.gender}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Age</div>
            <div>{userProfile.age} years</div>
          </div>
        </div>
      </div>

      {/* Physical Stats */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-lg">Physical Stats</h3>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Height (cm)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min="100"
                  max="250"
                />
              ) : (
                <div className="px-4 py-2 rounded-xl bg-accent/50">{userProfile.height} cm</div>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">Weight (kg)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min="30"
                  max="300"
                />
              ) : (
                <div className="px-4 py-2 rounded-xl bg-accent/50">{userProfile.weight} kg</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Activity Level</label>
            {isEditing ? (
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                className="w-full px-4 py-2 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="sedentary">Sedentary - Little or no exercise</option>
                <option value="light">Lightly active - Exercise 1-3 days/week</option>
                <option value="moderate">Moderately active - Exercise 3-5 days/week</option>
                <option value="active">Very active - Exercise 6-7 days/week</option>
                <option value="very-active">Extremely active - Physical job or training twice a day</option>
              </select>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-accent/50 capitalize">
                {userProfile.activityLevel.replace('-', ' ')}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg">Daily Goals</h3>
        </div>

        <div>
          <label className="block text-sm mb-2">Goal</label>
          {isEditing ? (
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
              className="w-full px-4 py-2 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
            >
              <option value="lose">Lose weight - Calorie deficit</option>
              <option value="maintain">Maintain weight - Balanced calories</option>
              <option value="gain">Gain weight - Calorie surplus</option>
            </select>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-accent/50 mb-4 capitalize">
              {userProfile.goal} weight
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Daily Calories</div>
            <div className="text-xl font-medium">{userProfile.dailyCalories} kcal</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Daily Protein</div>
            <div className="text-xl font-medium">{userProfile.dailyProtein}g</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Daily Carbs</div>
            <div className="text-xl font-medium">{userProfile.dailyCarbs}g</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Daily Fat</div>
            <div className="text-xl font-medium">{userProfile.dailyFat}g</div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
