# 🚀 AI Tutor Platform - Gamified CS Learning Ecosystem

> **Next-generation AI-powered, gamified Computer Science learning platform**

A visually stunning, game-like learning ecosystem where users progress through knowledge like a journey. Built with Next.js, TypeScript, Gemini AI, and modern animations.

![Platform Preview](https://via.placeholder.com/800x400/0a0a0f/00ffff?text=AI+Tutor+Platform)

## ✨ Features

### 🎮 Core Learning Flow
- **Visual Journey Map** - Animated roadmap with locked/unlocked states
- **Concept Learning** - AI-generated theory with animations and visualizations
- **MCQ Gates** - Mandatory progression with reinforcement learning
- **Leaderboard Unlocks** - Gamified achievement system
- **Coding Challenges** - Basic → Medium → Advanced progression
- **AI Line-by-Line Debugging** - Hints without revealing solutions
- **Adaptive Difficulty** - Automatic difficulty adjustment based on performance

### 🎨 UI/UX Highlights
- **Dark Mode** with neon accents (cyan, pink, purple, green)
- **Glassmorphism** design elements
- **Smooth Animations** using Framer Motion
- **Micro-interactions** throughout
- **Confetti Celebrations** on achievements
- **Responsive Design** for all devices

### 📚 Subjects Covered
- **C++ Fundamentals**
- **Java Fundamentals**
- **Python Fundamentals**
- **Data Structures & Algorithms (DSA)**
- **Object-Oriented Programming (OOPS)**
- **Database Management Systems (DBMS)**

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Monaco Editor** - VS Code-like code editor
- **Canvas Confetti** - Celebration effects
- **React Hot Toast** - Notifications

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Gemini AI** - Content generation engine

### AI Integration
- **Google Gemini Pro** - Dynamic content generation
  - Theory generation
  - MCQ creation
  - Coding problems
  - Hints and explanations
  - Reinforcement learning

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Gemini API Key** (see API setup below)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-tutor-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Gemini API Configuration (REQUIRED)
GEMINI_API_KEY=your_gemini_api_key_here

# Judge0 API Configuration (OPTIONAL - for real code execution)
# Option 1: RapidAPI (Recommended)
JUDGE0_RAPIDAPI_KEY=your_rapidapi_key_here

# Option 2: Self-Hosted Judge0
# NEXT_PUBLIC_JUDGE0_API_URL=http://localhost:2358

# Database Configuration (Optional - for future features)
DATABASE_URL=postgresql://user:password@localhost:5432/ai_tutor
# OR for MongoDB:
# MONGODB_URI=mongodb://localhost:27017/ai_tutor

# Redis Configuration (Optional - for caching)
REDIS_URL=redis://localhost:6379

# JWT Secret (Optional - for authentication)
JWT_SECRET=your_jwt_secret_here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Your API Keys

#### Gemini API Key (REQUIRED)

#### Step-by-Step Guide:

1. **Visit Google AI Studio**
   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Or visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **Sign In**
   - Use your Google account to sign in

3. **Create API Key**
   - Click "Create API Key"
   - Select a Google Cloud project (or create a new one)
   - Copy the generated API key

4. **Add to Environment**
   - Paste the API key into your `.env.local` file:
     ```env
     GEMINI_API_KEY=AIzaSy...your_key_here
     ```

#### ⚠️ Important Notes:
- **Free Tier**: Gemini API offers a free tier with generous limits
- **Rate Limits**: Be aware of rate limits (60 requests per minute on free tier)
- **Security**: Never commit your API key to version control
- **Billing**: Check Google Cloud billing settings if using paid tier

#### Judge0 API Key (OPTIONAL - for real code execution)

**Option 1: RapidAPI (Recommended)**
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce)
3. Copy your RapidAPI key
4. Add to `.env.local`: `JUDGE0_RAPIDAPI_KEY=your_key_here`

**Option 2: Self-Hosted**
- Run Judge0 with Docker (see `JUDGE0_INTEGRATION.md`)
- Add: `NEXT_PUBLIC_JUDGE0_API_URL=http://localhost:2358`

**Note:** Without Judge0, code execution will use mock results. The platform still works, but real execution requires Judge0.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ai-tutor-platform/
├── app/
│   ├── api/
│   │   └── gemini/
│   │       ├── theory/route.ts          # Theory generation endpoint
│   │       ├── mcq/route.ts              # MCQ generation endpoint
│   │       ├── coding-problem/route.ts  # Coding problem generation
│   │       ├── hint/route.ts             # AI hint generation
│   │       ├── reteach/route.ts          # Re-teaching endpoint
│   │       └── reinforcement-mcq/route.ts # Reinforcement MCQ
│   ├── subject/
│   │   └── [subjectId]/
│   │       ├── page.tsx                  # Subject overview
│   │       └── unit/
│   │           └── [unitId]/
│   │               └── page.tsx           # Unit learning flow
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Home page
│   └── globals.css                        # Global styles
├── components/
│   ├── JourneyMap.tsx                     # Visual journey map
│   ├── ConceptLearning.tsx                # Theory learning phase
│   ├── MCQGate.tsx                        # MCQ progression gate
│   ├── LeaderboardUnlock.tsx              # Achievement unlock
│   └── CodingChallenge.tsx                 # Coding interface
├── lib/
│   ├── gemini.ts                          # Gemini API integration
│   └── subjects.ts                        # Subject configurations
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔌 API Integration Details

### Required API: Google Gemini

The platform **requires** the Gemini API for all content generation. Here's what it's used for:

> **Note:** See `API_INTEGRATION.md` for detailed Gemini setup instructions.

#### 1. **Theory Generation** (`/api/gemini/theory`)
- Generates comprehensive theory content
- Creates code examples
- Provides visual descriptions
- Formats content with markdown

**Request:**
```json
{
  "subject": "C++ Fundamentals",
  "unit": "Variables & Data Types"
}
```

**Response:**
```json
{
  "theory": {
    "title": "Variables & Data Types",
    "overview": "...",
    "sections": [...],
    "keyTakeaways": [...]
  }
}
```

#### 2. **MCQ Generation** (`/api/gemini/mcq`)
- Creates 5 high-quality MCQs
- Includes explanations
- Tests deep understanding

**Request:**
```json
{
  "subject": "C++ Fundamentals",
  "unit": "Variables",
  "concept": "Variables & Data Types"
}
```

#### 3. **Coding Problems** (`/api/gemini/coding-problem`)
- Generates problems by difficulty
- Creates examples and constraints
- Provides progressive hints

**Request:**
```json
{
  "subject": "C++ Fundamentals",
  "unit": "Variables",
  "difficulty": "Basic" // or "Medium" or "Advanced"
}
```

#### 4. **AI Hints** (`/api/gemini/hint`)
- Analyzes code for errors
- Provides line-by-line hints
- Never reveals full solutions

**Request:**
```json
{
  "code": "student code here",
  "error": "runtime error description",
  "subject": "C++ Fundamentals",
  "unit": "Variables"
}
```

#### 5. **Re-teaching** (`/api/gemini/reteach`)
- Simplifies explanations
- Adds analogies
- Breaks concepts into steps

#### 6. **Reinforcement MCQs** (`/api/gemini/reinforcement-mcq`)
- Creates simpler MCQs for failed concepts
- Tests understanding after re-teaching

### Optional API: Judge0 (Code Execution)

The platform supports **real code execution** via Judge0. Without it, code runs with mock results.

**Setup Options:**
1. **RapidAPI** (Recommended) - Free tier: 100 requests/day
2. **Self-Hosted** - Run Judge0 with Docker

> **Note:** See `JUDGE0_INTEGRATION.md` for detailed setup instructions.

### API Rate Limits & Costs

**Gemini:**
- **Free Tier**: 60 requests per minute
- **Paid Tier**: Higher limits available
- **Cost**: Check [Google AI Pricing](https://ai.google.dev/pricing)

**Judge0 (RapidAPI):**
- **Free Tier**: 100 requests/day, 10 requests/minute
- **Paid Plans**: Starting at $9.99/month
- **Self-Hosted**: Free (server costs only)

### Error Handling

The platform includes fallback mechanisms:
- If API fails, shows error message
- Retry buttons for failed requests
- Graceful degradation

## 🎯 Usage Guide

### For Students

1. **Start Your Journey**
   - Select a subject from the journey map
   - Choose an unlocked unit

2. **Learn Concepts**
   - Read through animated theory sections
   - Review code examples
   - Complete all sections

3. **Pass MCQ Gate**
   - Answer questions correctly
   - Get reinforcement if you fail
   - Score 70%+ to proceed

4. **Unlock Coding Mode**
   - Celebrate your achievement
   - View your leaderboard rank

5. **Solve Coding Challenges**
   - Start with Basic difficulty
   - Use AI hints when stuck
   - Progress to Medium and Advanced

### For Developers

#### Adding a New Subject

1. Edit `lib/subjects.ts`:
```typescript
export const SUBJECTS: Record<Subject, SubjectConfig> = {
  // ... existing subjects
  newSubject: {
    id: 'newSubject',
    name: 'New Subject Name',
    icon: '🎯',
    color: 'neon-cyan',
    units: [...]
  }
}
```

#### Customizing Prompts

Edit `lib/gemini.ts` to modify prompt templates:
```typescript
export const PROMPT_TEMPLATES = {
  theory: (subject: string, unit: string) => `
    // Your custom prompt here
  `
}
```

#### Adding Features

- Components are modular and reusable
- API routes follow RESTful patterns
- State management uses React hooks

## 🐛 Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY is not set"**
   - Ensure `.env.local` exists
   - Check API key is correctly formatted
   - Restart dev server after adding env vars

2. **API Rate Limit Errors**
   - Wait 1 minute between requests
   - Consider upgrading to paid tier
   - Implement caching (future feature)

3. **Monaco Editor Not Loading**
   - Check browser console for errors
   - Ensure JavaScript is enabled
   - Try clearing browser cache

4. **Build Errors**
   - Run `npm install` again
   - Delete `node_modules` and `.next` folders
   - Check Node.js version (18+)

## 🚧 Future Enhancements

- [ ] User authentication & profiles
- [ ] Progress persistence (database)
- [ ] Real code execution (Judge0 integration)
- [ ] Voice narration
- [ ] Multiplayer challenges
- [ ] Advanced analytics
- [ ] Mobile app version
- [ ] More subjects (GATE prep, System Design)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review API documentation

## 🎉 Acknowledgments

- **Google Gemini** for AI capabilities
- **Next.js Team** for the amazing framework
- **Framer Motion** for smooth animations
- **Monaco Editor** for code editing

---

**Built with ❤️ for the next generation of CS learners**

*"If Duolingo, LeetCode, and a AAA game studio had a child — this is it."*

