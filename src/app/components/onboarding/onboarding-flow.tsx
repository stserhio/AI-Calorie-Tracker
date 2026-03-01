import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../../types';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'male' as 'male' | 'female',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
    goal: 'maintain' as 'lose' | 'maintain' | 'gain',
  });

  const [validationErrors, setValidationErrors] = useState<{
    age?: string;
    height?: string;
    weight?: string;
  }>({});

  const totalSteps = 4;

  const validatePhysicalStats = () => {
    const errors: { age?: string; height?: string; weight?: string } = {};

    const age = parseInt(formData.age);
    const height = parseInt(formData.height);
    const weight = parseInt(formData.weight);

    // Age validation
    if (isNaN(age) || age < 16 || age > 80) {
      errors.age = 'Please enter correct data';
    }

    // Height validation
    if (isNaN(height) || height < 100 || height > 250) {
      errors.height = 'Please enter correct data';
    }

    // Weight validation
    if (isNaN(weight) || weight < 30 || weight > 300) {
      errors.weight = 'Please enter correct data';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 2) {
      if (!validatePhysicalStats()) {
        return; // Block transition if there are errors
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const calculateDailyTargets = () => {
    const age = parseInt(formData.age);
    const height = parseInt(formData.height);
    const weight = parseInt(formData.weight);
    const { gender, activityLevel, goal } = formData;

    // Calculate BMR using Mifflin-St Jeor Equation
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
      tdee -= 500; // 500 calorie deficit
    } else if (goal === 'gain') {
      tdee += 300; // 300 calorie surplus
    }

    const dailyCalories = Math.round(tdee);

    // Calculate macros based on scientific recommendations
    let dailyProtein: number, dailyCarbs: number, dailyFat: number;

    if (goal === 'lose') {
      // Weight loss: higher protein, moderate fat, lower carbs
      dailyProtein = Math.round((dailyCalories * 0.35) / 4); // 35% protein (1.4g per kg)
      dailyFat = Math.round((dailyCalories * 0.30) / 9);     // 30% fat
      dailyCarbs = Math.round((dailyCalories * 0.35) / 4);    // 35% carbs
    } else if (goal === 'gain') {
      // Muscle gain: high protein, moderate fat, high carbs
      dailyProtein = Math.round((dailyCalories * 0.30) / 4); // 30% protein (1.6-2.2g per kg)
      dailyFat = Math.round((dailyCalories * 0.25) / 9);     // 25% fat
      dailyCarbs = Math.round((dailyCalories * 0.45) / 4);    // 45% carbs
    } else {
      // Maintenance: balanced distribution
      dailyProtein = Math.round((dailyCalories * 0.25) / 4); // 25% protein (0.8-1.2g per kg)
      dailyFat = Math.round((dailyCalories * 0.30) / 9);     // 30% fat
      dailyCarbs = Math.round((dailyCalories * 0.45) / 4);    // 45% carbs
    }

    // Ensure minimum values for health
    dailyProtein = Math.max(dailyProtein, Math.round(weight * 0.8)); // Min 0.8g per kg
    dailyFat = Math.max(dailyFat, Math.round(weight * 0.8));     // Min 0.8g per kg  
    dailyCarbs = Math.max(dailyCarbs, 130);                   // Min 130g for brain function

    return {
      dailyCalories,
      dailyProtein,
      dailyCarbs,
      dailyFat,
    };
  };

  const handleComplete = () => {
    const targets = calculateDailyTargets();

    const profile: UserProfile = {
      name: formData.name,
      email: formData.email,
      gender: formData.gender,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      ...targets,
    };

    onComplete(profile);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.gender !== null && formData.gender !== undefined;
      case 2:
        // Check that all fields are filled and no validation errors
        return formData.age !== '' && formData.height !== '' && formData.weight !== '' &&
          Object.keys(validationErrors).length === 0;
      case 3:
        return formData.activityLevel !== null && formData.activityLevel !== undefined;
      case 4:
        return formData.goal !== null && formData.goal !== undefined;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl step-transition-enter-active">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          {/* Step 1: Gender */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl mb-2">What's your gender?</h2>
              <p className="text-muted-foreground mb-8">This helps us calculate your calorie needs</p>

              <div className="grid gap-3">
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, gender: option.value as any })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.gender === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                      }`}
                  >
                    <span className="text-lg">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Physical stats */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground mb-8">We need some basic information</p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="age" className="block mb-2 text-sm">
                    Age
                  </label>
                  <div className="relative">
                    <input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => {
                        setFormData({ ...formData, age: e.target.value });
                        // Clear error when value changes
                        if (validationErrors.age) {
                          setValidationErrors({ ...validationErrors, age: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-input-background border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${validationErrors.age
                        ? 'border-destructive focus:ring-destructive/20'
                        : 'border-border'
                        }`}
                      placeholder="25"
                      min="16"
                      max="80"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      years
                    </span>
                  </div>
                  {validationErrors.age && (
                    <p className="text-sm text-destructive mt-2">{validationErrors.age}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="height" className="block mb-2 text-sm">
                    Height
                  </label>
                  <div className="relative">
                    <input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => {
                        setFormData({ ...formData, height: e.target.value });
                        if (validationErrors.height) {
                          setValidationErrors({ ...validationErrors, height: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-input-background border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${validationErrors.height
                        ? 'border-destructive focus:ring-destructive/20'
                        : 'border-border'
                        }`}
                      placeholder="175"
                      min="100"
                      max="250"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      cm
                    </span>
                  </div>
                  {validationErrors.height && (
                    <p className="text-sm text-destructive mt-2">{validationErrors.height}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="weight" className="block mb-2 text-sm">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => {
                        setFormData({ ...formData, weight: e.target.value });
                        if (validationErrors.weight) {
                          setValidationErrors({ ...validationErrors, weight: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-input-background border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${validationErrors.weight
                        ? 'border-destructive focus:ring-destructive/20'
                        : 'border-border'
                        }`}
                      placeholder="70"
                      min="30"
                      max="300"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      kg
                    </span>
                  </div>
                  {validationErrors.weight && (
                    <p className="text-sm text-destructive mt-2">{validationErrors.weight}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Activity level */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl mb-2">How active are you?</h2>
              <p className="text-muted-foreground mb-8">Choose your typical activity level</p>

              <div className="grid gap-3">
                {[
                  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
                  { value: 'light', label: 'Lightly active', description: 'Exercise 1-3 days/week' },
                  { value: 'moderate', label: 'Moderately active', description: 'Exercise 3-5 days/week' },
                  { value: 'active', label: 'Very active', description: 'Exercise 6-7 days/week' },
                  { value: 'very-active', label: 'Extremely active', description: 'Physical job or training twice a day' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, activityLevel: option.value as any })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.activityLevel === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                      }`}
                  >
                    <div className="text-lg mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Goal */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl mb-2">What's your goal?</h2>
              <p className="text-muted-foreground mb-8">This will help us set your daily targets</p>

              <div className="grid gap-3">
                {[
                  { value: 'lose', label: 'Lose weight', description: 'We\'ll create a calorie deficit', icon: '📉' },
                  { value: 'maintain', label: 'Maintain weight', description: 'Keep your current weight', icon: '⚖️' },
                  { value: 'gain', label: 'Gain weight', description: 'We\'ll create a calorie surplus', icon: '📈' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, goal: option.value as any })}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${formData.goal === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{option.icon}</span>
                      <div className="flex-1">
                        <div className="text-lg mb-1">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {step === totalSteps ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
