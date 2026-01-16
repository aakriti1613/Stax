# 🚀 Quick Start Guide

## ✅ Step 1: Install Dependencies

```bash
npm install
```

## ✅ Step 2: Add Gemini API Key

1. Get your key from: https://aistudio.google.com/app/apikey
2. Create `.env.local` file in root directory
3. Add:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## ✅ Step 3: Add Judge0 API Key (Optional but Recommended)

### Option A: RapidAPI (Easiest) ⭐

1. Sign up: https://rapidapi.com/
2. Subscribe: https://rapidapi.com/judge0-official/api/judge0-ce
3. Get your API key from RapidAPI dashboard
4. Add to `.env.local`:
   ```env
   JUDGE0_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

### Option B: Skip Judge0 (Mock Execution)

- Code will run with mock results
- No real execution, but platform still works
- Good for testing UI/UX

## ✅ Step 4: Run the App

```bash
npm run dev
```

Visit: **http://localhost:3000**

## ✅ Step 5: Test It!

1. Click any subject (e.g., "C++ Fundamentals")
2. Click first unit
3. Theory should load (Gemini working ✅)
4. Complete MCQ gate
5. Try coding challenge
6. Run code (Judge0 working ✅)

## 🎉 You're Done!

The platform is now fully functional!

---

**Need Help?**
- See `README.md` for full documentation
- See `JUDGE0_INTEGRATION.md` for Judge0 details
- See `API_INTEGRATION.md` for Gemini details


