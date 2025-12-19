# 🚀 Motia Studio Pro - Setup Guide

## Quick Start (5 minutes)

### 1. Get Groq API Key (FREE)
1. Visit https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

### 2. Configure Environment
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add your Groq API key:
GROQ_API_KEY=your_actual_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Browser
Go to http://localhost:3000

---

## Features

- **AI Code Generation** - Describe your backend, AI generates Motia code
- **Visual Workflow Builder** - Drag-and-drop backend components
- **One-Click Deploy** - Deploy to Motia Cloud instantly
- **5 Production Templates** - Ready-to-use backend templates
- **Built-in Observability** - Real-time metrics and logs

---

## Usage

### Generate Backend with AI
1. Open http://localhost:3000/studio
2. Click "AI Chat" tab
3. Describe your backend (e.g., "Build a REST API for todo management")
4. AI generates production-ready Motia code
5. Click "Deploy" to go live

### Use Template
1. Go to homepage
2. Scroll to "Templates" section
3. Click "Use Template" on any template
4. Customize if needed
5. Deploy

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **AI:** Groq API (Free tier - llama-3.1-8b-instant)
- **Code Editor:** Monaco Editor
- **Visual Builder:** React Flow
- **Database:** In-memory (MVP) - Use PostgreSQL for production

---

## Groq API Free Tier

✅ Fully free - no credit card required
✅ Fast inference with llama-3.1-8b-instant
✅ OpenAI-compatible API
✅ Perfect for hackathons and MVPs

Get your key: https://console.groq.com

---

## Troubleshooting

**"AI Generation Failed"**
- Check if GROQ_API_KEY is set in .env.local
- Verify the API key is valid (should start with `gsk_`)
- Check console for error messages

**"Port 3000 already in use"**
```bash
# Kill the process
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

**TypeScript Errors**
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

---

## For Production

1. Replace in-memory database with PostgreSQL
2. Add user authentication (GitHub OAuth)
3. Implement real Motia deployment
4. Add rate limiting
5. Set up monitoring

---

**Made with ❤️ for Backend Reloaded Hackathon**
