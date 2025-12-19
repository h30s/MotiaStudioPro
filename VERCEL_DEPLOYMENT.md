# Deploying to Vercel

## Quick Setup

### 1. Environment Variables
Make sure to set these in your Vercel Project Settings → Environment Variables:

```bash
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 2. Deploy
```bash
git push origin main
```

Vercel will automatically deploy when you push to `main`.

## Important Notes

### ⚠️ Database Limitations on Vercel

The app currently uses **different storage modes**:

- **Local Development**: Filesystem-based (`.data/` directory) - data persists
- **Vercel/Production**: In-memory storage - **data resets on cold starts**

This means on Vercel:
- ✅ Generated code works perfectly
- ✅ You can deploy projects
- ⚠️ **Deployments are ephemeral** - they reset when the serverless function cold starts (typically after ~15 minutes of inactivity)

### 🚀 For Production Use

To make deployments persistent, integrate one of:

1. **Vercel KV (Redis)** - Easiest for MVP
   ```bash
   npm install @vercel/kv
   ```

2. **Vercel Postgres** - For relational data
   ```bash
   npm install @vercel/postgres
   ```

3. **Prisma + PostgreSQL** - Full ORM support
   ```bash
   npm install prisma @prisma/client
   ```

See implementation examples in `src/lib/db-adapter.ts`

## Troubleshooting

### 405 Method Not Allowed
- Make sure `GROQ_API_KEY` is set in Vercel environment variables
- Check that API routes have `export const runtime = 'nodejs'`

### Cold Start Issues
- This is normal for serverless
- First request after inactivity will be slower (~2-3s)
- Consider using Vercel KV for persistence

### Environment Variables Not Working
- Ensure you're setting them in **Vercel dashboard**, not just `.env`
- Redeploy after adding new environment variables
- Use `NEXT_PUBLIC_` prefix only for client-side variables

## Monitoring

Check your deployment logs:
```bash
vercel logs
```

Or view them in the Vercel dashboard under your project's "Logs" tab.
