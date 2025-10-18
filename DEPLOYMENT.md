# 🚀 Deployment Guide

## Prerequisites
- Supabase account
- OpenAI API key (for Phase 2b)
- Supabase CLI installed (`npx supabase --version`)

---

## Step 1: Login to Supabase

```bash
npx supabase login
```

Follow the prompts to authenticate with your Supabase account.

---

## Step 2: Link to Your Project

```bash
npx supabase link --project-ref tcromatgngintrgxxaul
```

This links your local project to the Supabase project.

---

## Step 3: Deploy Edge Function

```bash
npx supabase functions deploy process-recipe
```

This deploys the `process-recipe` Edge Function to Supabase.

Expected output:
```
Deploying process-recipe (project ref: tcromatgngintrgxxaul)
Function URL: https://tcromatgngintrgxxaul.supabase.co/functions/v1/process-recipe
```

---

## Step 4: Set Environment Secrets (Optional for now)

For Phase 2b (real OpenAI integration):

```bash
npx supabase secrets set OPENAI_API_KEY=sk-your-openai-key-here
```

---

## Step 5: Test the Deployment

### Test with curl:

```bash
curl -i --location --request POST \
  'https://tcromatgngintrgxxaul.supabase.co/functions/v1/process-recipe' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"url":"https://www.tiktok.com/@test/video/123"}'
```

Replace `YOUR_ANON_KEY` with your Supabase anon key from `.env`.

### Test from app:

1. Start Expo: `npx expo start`
2. Open app on phone
3. Go to "Add Recipe"
4. Paste any TikTok/Instagram URL
5. Click "Generate Recipe"
6. Should see success alert + recipe details

---

## Troubleshooting

### "Function not found"
- Make sure you're logged in: `npx supabase login`
- Check project link: `npx supabase projects list`

### "Missing environment variables"
- Set secrets: `npx supabase secrets set VAR_NAME=value`
- List secrets: `npx supabase secrets list`

### "CORS error"
- Edge Function includes CORS headers
- Check browser console for specific error

---

## Updating the Function

After making changes to `supabase/functions/process-recipe/index.ts`:

```bash
npx supabase functions deploy process-recipe
```

Changes are deployed immediately.

---

## Monitoring & Logs

View function logs:
```bash
npx supabase functions logs process-recipe
```

Or in Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Edge Functions → process-recipe → Logs

---

## Cost Monitoring

### Current Status (Mock Data)
- **Cost:** $0/month (no OpenAI calls yet)
- **Supabase:** Free tier (500MB DB, 2GB bandwidth)

### Future with OpenAI (Phase 2b)
- **Estimated:** ~$0.13/recipe
- **Hard limit:** $50/month (set in OpenAI dashboard)
- **Rate limiting:** 10 recipes/day/user (enforced by app)

Monitor costs:
- OpenAI Dashboard: https://platform.openai.com/usage
- Set billing alerts at $10, $25, $50

---

## Rollback

If deployment causes issues:

```bash
# View deployment history
npx supabase functions list

# Rollback to previous version (not directly supported)
# Best practice: revert code changes and redeploy
git revert HEAD
npx supabase functions deploy process-recipe
```

---

**Last Updated:** 2025-01-19
