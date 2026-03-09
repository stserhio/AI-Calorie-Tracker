
![calorietracker-final](https://github.com/user-attachments/assets/eb503f14-465a-40af-a1e2-29ea69d04cb1)

# Calorie Tracker - Advanced Calories & Macros Tracking App

An intelligent nutrition tracking application with AI-powered food analysis and scientifically accurate macros calculations.

## ✨ Features

- 🤖 **AI Food Analysis** - Natural language input via Anthropic Claude API
- 🎯 **Goal-Specific Macros** - Personalized for lose/gain/maintain
- 📊 **Progress Visualization** - Real-time tracking with charts
- 🍽 **Manual Entry** - Full control over nutrition data
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern UI** - Tailwind CSS + Radix UI components
- 🛡️ **Error Handling** - Comprehensive error boundaries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-calorie-tracker.git
cd ai-calorie-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
- **ESLint** for code linting
- **Prettier** for code formatting  
- **TypeScript** for type safety
- **Error Boundaries** for graceful error handling

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/      # Main dashboard components
│   │   ├── onboarding/    # User setup flow
│   │   ├── welcome/        # Landing page
│   │   ├── manual-entry/   # Manual nutrition entry
│   │   └── ui/            # Reusable UI components
│   ├── types.ts             # TypeScript type definitions
│   └── App.tsx             # Main application component
├── styles/                  # CSS and styling
├── docs/                    # Documentation
└── package.json
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Environment
NODE_ENV=development

# Database (future implementation)
DATABASE_URL=postgresql://username:password@localhost:5432/calorietracker

# JWT Secret (future implementation)  
JWT_SECRET=your_jwt_secret_here
```

## Calorie Calculation

The app uses the **Mifflin-St Jeor Equation** for accurate BMR calculation:

### For Men:
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
```

### For Women:
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
```

Activity multipliers and goal adjustments are applied to calculate daily targets.

## Validation Rules

- **Age**: 16-80 years
- **Height**: 100-250 cm (1.0-2.5m)  
- **Weight**: 30-300 kg
- **Calories**: 0-5000 per meal
- **Macros**: Realistic ranges with validation

## Future Roadmap

- [ ] Real authentication (email/Google OAuth)
- [ ] Database integration (PostgreSQL)
- [ ] Advanced analytics and insights
- [ ] Meal planning and recipes
- [ ] Social features and sharing
- [ ] Mobile app (React Native)
- [ ] Wearables integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- AI powered by [Anthropic](https://anthropic.com/)

---

**Start your health journey today!** 
