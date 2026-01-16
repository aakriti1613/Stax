# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get Gemini API Key

### Option A: Google AI Studio (Recommended)
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Option B: Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Create/Select a project
3. Enable "Generative Language API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the key

## Step 3: Create Environment File

Create `.env.local` in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

**⚠️ IMPORTANT**: Replace `your_api_key_here` with your actual API key!

## Step 4: Run the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## ✅ Verification

1. Home page loads with journey map
2. Click on any subject (e.g., "C++ Fundamentals")
3. Click on first unit
4. Theory should load (this confirms Gemini API is working)

## 🐛 If Something Goes Wrong

### API Key Issues
- Check `.env.local` exists in root directory
- Verify API key has no extra spaces
- Restart dev server: `Ctrl+C` then `npm run dev`

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

- Read `README.md` for full documentation
- Explore different subjects
- Try coding challenges
- Check API routes in `app/api/gemini/`

---

**Need Help?** Check the main README.md for detailed troubleshooting.


