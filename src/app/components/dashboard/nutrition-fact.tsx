import { Lightbulb, Heart, Brain, Zap } from 'lucide-react';

interface NutritionFactProps {
  className?: string;
}

export function NutritionFact({ className = "" }: NutritionFactProps) {
  const facts = [
    {
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      title: "Brain Food",
      fact: "Did you know? Your brain consumes about 20% of your daily calories, making it the most energy-hungry organ in your body.",
      color: "purple"
    },
    {
      icon: <Heart className="w-5 h-5 text-red-500" />,
      title: "Protein Power",
      fact: "Protein has the highest thermic effect of all macronutrients - your body burns 25-30% more calories digesting it compared to carbs and fats.",
      color: "red"
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: "Metabolism Boost",
      fact: "Eating spicy foods can temporarily increase your metabolism by up to 8% and help burn an extra 50 calories per meal.",
      color: "yellow"
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-blue-500" />,
      title: "Hydration Hero",
      fact: "Drinking 500ml of water can increase metabolic rate by 30% for up to 90 minutes. Stay hydrated, stay efficient!",
      color: "blue"
    }
  ];

  const randomFact = facts[Math.floor(Math.random() * facts.length)];

  const colorClasses = {
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    red: "bg-red-50 border-red-200 text-red-800", 
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800"
  };

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 shadow-sm hover:shadow-md transition-all duration-300 ${colorClasses[randomFact.color as keyof typeof colorClasses]} ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {randomFact.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
            {randomFact.title}
            <Lightbulb className="w-4 h-4 text-gray-400" />
          </h4>
          <p className="text-sm leading-relaxed">
            {randomFact.fact}
          </p>
        </div>
      </div>
    </div>
  );
}
