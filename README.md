# 🍳 RecipAI - AI-Powered Recipe Extractor

> Transform TikTok/Instagram recipe videos into structured recipe cards automatically using AI.

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-blue)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-green)](https://supabase.com/)

---

## 📋 **Project Overview**

**Problem Identified** (validated with 113 survey responses):
- 70% find recipes on social media
- 58% struggle to find recipes they've seen before
- 81% prefer re-Googling over searching saved recipes
- 50% use disorganized screenshots
- 40% have scattered bookmarks across multiple apps

**Solution:**
User shares TikTok/Instagram URL → AI extracts recipe (title, ingredients, steps, time, image) → Saves in app, organized and searchable.

---

## 🎯 **Project Status**

### ✅ **Phase 1: Foundations (COMPLETED)**
- [x] Full TypeScript migration (100% typed, zero `any`)
- [x] Expo Router file-based navigation
- [x] Reusable component library
- [x] Design system (colors, spacing, typography)
- [x] Custom React hooks
- [x] Environment variables security
- [x] Supabase client with typed Database
- [x] URL validation (TikTok/Instagram)
- [x] Clean architecture (40+ unused files removed)

### ✅ **Phase 2a: Backend MVP - Mock Data (COMPLETED)**
- [x] Supabase Edge Function created (`process-recipe`)
  - [x] Receive video URL
  - [x] Validate and normalize URL
  - [x] Check cache (source_url unique constraint)
  - [x] Save to database
  - [x] Return recipe data
  - [x] Mock recipe generation (Pasta Carbonara)
- [x] Frontend integration
  - [x] Call Edge Function from `add-recipe.tsx`
  - [x] Loading states
  - [x] Success/Error handling
  - [x] Redirect to recipe detail
  - [x] Cache detection ("generated" vs "loaded from cache")
- [x] Protections
  - [x] URL cache (avoid reprocessing)
  - [x] CORS headers
  - [x] Error handling
- [x] Deployment & Testing
  - [x] Deployed to Supabase production
  - [x] Tested with curl (200 OK)
  - [x] Tested in mobile app (success)
  - [x] Cache verified (same URL = same recipe ID)
  - [x] Persistence verified (recipes appear on home screen)
- [x] Documentation
  - [x] Deployment guide created (`DEPLOYMENT.md`)
  - [x] README updated

### ✅ **Phase 2b: OpenAI Integration (COMPLETED)**
- [x] OpenAI API integration
  - [x] OpenAI SDK installed (Deno)
  - [x] API key configured in Supabase secrets
  - [x] GPT-4o-mini for recipe parsing
  - [x] Mock transcript parsing (Phase 2c will add real video)
  - [x] Category-based image mapping (19 cuisines)
- [x] Cost protections
  - [x] Budget limit ($10/month hard cap)
  - [x] Usage alerts (50%, 80%, 100%)
  - [x] GPT-4o-mini (~$0.0002 per recipe)
  - [x] URL cache (avoid reprocessing)

### ✅ **Phase 2c: Search & Discovery (COMPLETED)**
- [x] Search bar with Ionicons
  - [x] Focus effects (sage green border, icon color change)
  - [x] Clear button when typing
  - [x] 300ms debounce for performance
- [x] Real-time filtering
  - [x] Search by recipe title
  - [x] Search by ingredients
  - [x] Search by category
- [x] 2-column grid layout
  - [x] Smaller recipe cards (140px images)
  - [x] Compact typography
  - [x] Responsive flex layout
- [x] Empty search state with helpful message
- [x] useDebounce custom hook

### ✅ **Phase 2d: Advanced Filters (COMPLETED)**
- [x] Category filter chips
  - [x] 10 popular cuisines (Italian, Japanese, Mexican, etc.)
  - [x] Horizontal scroll for categories
  - [x] Toggle selection (click to select/deselect)
- [x] Duration filter chips
  - [x] < 15 min, 15-30 min, > 30 min
  - [x] Range-based filtering (min/max minutes)
  - [x] Parse duration from recipe metadata
- [x] Combined filtering logic
  - [x] Search + Category + Duration work together
  - [x] All filters are combinable (AND logic)
- [x] Clear all filters button
  - [x] Appears when any filter is active
  - [x] Resets search, category, and duration
- [x] FilterChip component
  - [x] Reusable chip with selected state
  - [x] Premium styling with shadows and borders
  - [x] Sage green highlight when selected

### ✅ **Phase 2e: Recipe Editing (COMPLETED)**
- [x] Edit recipe screen
  - [x] Pre-filled form with existing recipe data
  - [x] Edit title, duration, category
  - [x] Edit ingredients (one per line)
  - [x] Edit steps (one per line)
  - [x] Validation for required fields
- [x] Edit button on recipe detail screen
  - [x] Circular edit button (pencil icon)
  - [x] Premium styling with shadows
- [x] Update recipe API
  - [x] Supabase UPDATE query
  - [x] Set edited_by_user flag to true
  - [x] Success/error handling
- [x] Database schema update
  - [x] Added edited_by_user boolean column
  - [x] Default value: false
  - [x] Migration file created
- [x] "Edited by you" badge
  - [x] Shows on recipe detail if edited_by_user is true
  - [x] Green badge with white text and white checkmark
- [x] Success feedback
  - [x] Trophy animation on successful edit
  - [x] "Recipe edited successfully!" message

### 🚧 **Phase 3: Video Processing (NEXT)**
- [ ] Real video download (TikTok/Instagram scraping with yt-dlp)
- [ ] Audio extraction from video
- [ ] Whisper API transcription
- [ ] Replace mock transcript with real audio transcription
- [ ] Rate limiting (10 recipes/day/user)
- [ ] Cost monitoring dashboard

### 📅 **Phase 3: Beta Launch (Future)**
- [ ] User accounts (Google, Apple ID)
- [ ] Advanced categorization
- [ ] Collections
- [ ] Multi-language translation
- [ ] Website URL import
- [ ] Offline mode
- [ ] Advanced filters

---

## 🏗️ **Architecture**

```
recipai/
├── 📱 app/                          # Expo Router routes
│   ├── _layout.tsx                  # Root Stack layout
│   ├── (tabs)/                      # Tab Navigator
│   │   ├── _layout.tsx              # Tabs configuration
│   │   ├── index.tsx                # Tab 1: Recipes list with filters
│   │   ├── add.tsx                  # Tab 2: Add recipe from URL
│   │   └── settings.tsx             # Tab 3: Settings
│   ├── recipe-detail.tsx            # Recipe details with edit button
│   └── edit-recipe.tsx              # Edit recipe form
│
├── 🧩 components/                   # Reusable UI components
│   ├── Button.tsx                   # Premium button with shadows
│   ├── EmptyState.tsx               # Empty state with action
│   ├── ErrorState.tsx               # Error state with retry
│   ├── FilterChip.tsx               # Filter chip for categories/duration
│   ├── LoadingState.tsx             # Loading spinner
│   ├── RecipeCard.tsx               # Recipe card (premium design)
│   ├── SuccessAnimation.tsx         # Lottie trophy animation
│   └── index.ts                     # Centralized exports
│
├── 🎬 assets/animations/            # Lottie animations
│   └── Trophy.json                  # Success animation
│
├── 🎨 constants/                    # Design system
│   └── theme.ts                     # Colors, spacing, typography, shadows
│
├── 🪝 hooks/                        # Custom React hooks
│   ├── useAsyncState.ts             # Generic async state management
│   ├── useRecipes.ts                # Fetch recipes from Supabase
│   ├── useDebounce.ts               # Debounce hook for search
│   └── index.ts                     # Centralized exports
│
├── 🛠️ lib/                          # Utilities & configs
│   ├── api.ts                       # API helpers, error handling
│   ├── config.ts                    # Environment vars validation
│   ├── supabase.ts                  # Typed Supabase client
│   ├── validation.ts                # URL validation (TikTok/Instagram)
│   └── index.ts                     # Centralized exports
│
├── 📝 types/                        # TypeScript types
│   ├── database.ts                  # Supabase DB types
│   ├── api.ts                       # API request/response types
│   ├── navigation.ts                # Expo Router route types
│   ├── ui.ts                        # UI component prop types
│   └── index.ts                     # Centralized exports
│
├── 🖼️ assets/images/                # App assets
│
├── ⚙️ Configuration files
│   ├── .env                         # Environment variables (gitignored)
│   ├── .env.example                 # Environment template
│   ├── app.config.ts                # Expo configuration
│   ├── tsconfig.json                # TypeScript config
│   └── package.json                 # Dependencies
```

---

## 🚀 **Tech Stack**

### **Frontend**
- **React Native** with **Expo** (SDK 52+)
- **Expo Router** (file-based routing)
- **TypeScript** (strict mode, 100% typed)
- **StyleSheet** (native styling, no external lib)

### **Backend**
- **Supabase** (PostgreSQL + Edge Functions)
- **OpenAI API**
  - Whisper (audio transcription)
  - GPT-4o (recipe parsing)

### **Database Schema**
```sql
Table: recipes
- id (uuid, primary key)
- title (text)
- ingredients (text[])
- steps (text[])
- duration (text)
- category (text)
- image_url (text)
- source_url (text, unique)
- edited_by_user (boolean, default: false)
- created_at (timestamp)
```

---

## 🔑 **Environment Variables**

Create a `.env` file at the root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your_key_here
```

**Important:**
- `.env` is gitignored (never committed)
- Use `.env.example` as template
- Prefix with `EXPO_PUBLIC_` for client-side access

---

## 📦 **Installation**

```bash
# Clone the repo
git clone https://github.com/Lydoww/recipAi.git
cd recipAi

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start Expo dev server
npx expo start
```

**Scan QR code** with Expo Go app (iOS/Android)

---

## 🎨 **Design System**

All design tokens are centralized in `constants/theme.ts`:

### **Colors - Premium Minimalist Palette**
- Primary: `#84A98C` (sage green - natural, calming)
- Primary Dark: `#52796F` (eucalyptus - sophisticated)
- Background: `#FAFAF9` (warm off-white)
- Text Primary: `#2F3E46` (charcoal - excellent contrast)
- Secondary: `#CAD2C5` (pale sage - neutral accent)

### **Spacing**
- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px, 2xl: 24px...

### **Typography**
- Font sizes: xs (12px) → 6xl (32px)
- Font weights: normal, medium, semibold, bold

### **Shadows**
- sm, md, lg (pre-configured with elevation)

**Usage:**
```typescript
import { colors, spacing, typography } from '../constants/theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    fontSize: typography.fontSize.xl,
  },
});
```

---

## 🧩 **Component Library**

### **Button**
```typescript
<Button
  label="Generate Recipe"
  onPress={handleSubmit}
  variant="primary"      // primary | secondary | outline
  size="medium"          // small | medium | large
  loading={isLoading}
  disabled={!isValid}
  fullWidth
/>
```

### **RecipeCard**
```typescript
<RecipeCard
  recipe={recipeData}
  onPress={() => navigateToDetail(recipe)}
/>
```

### **FilterChip**
```typescript
<FilterChip
  label="Italian"
  selected={selectedCategory === 'Italian'}
  onPress={() => setSelectedCategory('Italian')}
/>
```

### **States**
```typescript
<LoadingState message="Loading recipes..." />
<EmptyState
  icon="📱"
  title="No recipes yet"
  subtitle="Add your first recipe!"
  actionLabel="+ Add Recipe"
  onAction={() => router.push('/add-recipe')}
/>
<ErrorState
  message="Failed to load recipes"
  onRetry={refetch}
/>
```

---

## 🪝 **Custom Hooks**

### **useRecipes**
```typescript
const { recipes, loading, error, refetch } = useRecipes();
```
Automatically fetches recipes from Supabase with error handling.

### **useAsyncState**
```typescript
const { data, loading, error, setData, setError, reset } = useAsyncState<Recipe[]>([]);
```
Generic hook for async operations.

### **useDebounce**
```typescript
const debouncedSearchQuery = useDebounce(searchQuery, 300);
```
Debounces input value for performance optimization (e.g., search).

---

## 🛡️ **Security & Budget Protections**

### **Environment Variables**
- All secrets in `.env` (gitignored)
- Validation on app startup (`lib/config.ts`)

### **OpenAI Cost Protection**
- **Hard limit:** $10/month (configured in OpenAI dashboard)
- **Alerts:** 50%, 80%, 100% usage notifications
- **Cache:** Same URL = reuse existing recipe (no OpenAI call)
- **Model:** GPT-4o-mini (most cost-effective)

### **Current Costs (Phase 2b - Mock Data)**
- GPT-4o-mini: ~$0.0002/recipe (parsing mock transcript)
- **Budget:** $10/month = ~50,000 recipes

### **Future Costs (Phase 2c - Real Videos)**
- Whisper: ~$0.006/min → $0.12/video (20min avg)
- GPT-4o-mini: ~$0.0002/request
- **Total:** ~$0.12/recipe × 80 recipes = **$10/month**

---

## 📊 **Market Validation**

**Survey Results (113 responses):**
- 85% search recipes regularly
- 73% cook 3+ times/week
- 70% find recipes on social media
- 71% prefer text format (even from video)
- 55% dissatisfied with current system

**Top Pain Points:**
1. "Centralize everything in one place" (15+ mentions)
2. "Better organization/structure" (10+ mentions)
3. "Effective search/filtering" (8+ mentions)
4. "Stop disorganized screenshots" (6+ mentions)

---

## 🎯 **Business Model (Future)**

### **Freemium**
```
FREE TIER:
- 5 recipes/month
- Basic features

PREMIUM ($2.99/month):
- Unlimited recipes
- Collections
- PDF export
- Auto-translation
- Priority support
```

### **Revenue Streams (Phase 3+)**
- Affiliate links (Amazon, e-commerce)
- B2B API for food brands
- Data licensing (trending recipes)
- Partnership with food influencers

---

## 🐛 **Debugging & Common Issues**

### **"Missing required environment variables"**
```bash
# Make sure .env exists and contains:
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...

# Restart Expo with cache clear:
npx expo start --clear
```

### **TypeScript errors in node_modules**
These are dependency type conflicts (safe to ignore):
```bash
# Focus on errors in your own code (app/, components/, etc.)
```

### **"Failed to download remote update"**
- Ensure phone & computer on same WiFi
- Try tunnel mode: `npx expo start --tunnel`

---

## 📝 **Git Workflow**

### **Branch Strategy**
```bash
main          # Production-ready code
├── feature/* # New features
├── fix/*     # Bug fixes
└── docs/*    # Documentation
```

### **Commit Guidelines**
```bash
# Format
feat: Add recipe detail screen
fix: Resolve TypeScript error in useRecipes
docs: Update README with API documentation
refactor: Clean up validation logic
chore: Remove unused dependencies

# Always include Claude signature
🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🧪 **Testing (Future)**

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npx tsc --noEmit
```

---

## 📚 **Resources & Documentation**

### **Expo**
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Expo SDK Reference](https://docs.expo.dev/versions/latest/)

### **Supabase**
- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions](https://supabase.com/docs/guides/functions)

### **OpenAI**
- [Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [GPT-4o API](https://platform.openai.com/docs/guides/text-generation)

---

## 🤝 **Contributing**

This is a personal MVP project. Not accepting contributions yet.

---

## 📄 **License**

Private project - All rights reserved

---

## 💡 **Notes for Claude (AI Assistant)**

### **Context Reminders**
- Always read this README at session start
- Update this file after completing features
- Remove all `console.log` and unnecessary comments before commits
- Use design system constants (never hardcode colors/spacing)
- Maintain TypeScript strict mode (zero `any`)

### **Key Decisions Made**
- ✅ Expo Router over React Navigation (file-based routing)
- ✅ StyleSheet over Tailwind/NativeWind (keep it simple)
- ✅ Supabase over Firebase (better PostgreSQL, cheaper)
- ✅ TypeScript strict (catch bugs early)
- ✅ DRY components (60% less code in screens)

### **Project Files**
- Supabase Project: `https://tcromatgngintrgxxaul.supabase.co`
- Supabase Region: Singapore
- GitHub: `https://github.com/Lydoww/recipAi.git`

### **Important Rules**
1. **Never** commit `.env` file
2. **Always** use types from `types/` folder
3. **Always** use theme constants from `constants/theme.ts`
4. **Remove** all `console.log` before commits
5. **Remove** unnecessary comments before commits
6. **Update** this README after each major feature

---

**Last Updated:** 2025-01-19
**Current Phase:** Phase 2e Complete (Recipe Editing)
**Status:** Full CRUD + Filters working ✅ | Phase 3 (Real Video) next 🚧

### **Recent Updates**
- ✅ Recipe editing with full form (title, duration, category, ingredients, steps)
- ✅ "Edited by you" badge on edited recipes
- ✅ Database migration for edited_by_user column
- ✅ Advanced filters (category + duration chips)
- ✅ Combined filtering logic (search + category + duration)
- ✅ Clear all filters button
- ✅ Search with debounce and focus effects
- ✅ 2-column grid layout with compact cards
- ✅ Real-time filtering (title, ingredients, category)
- ✅ OpenAI GPT-4o-mini integration
- ✅ Category-based image mapping
- ✅ Bottom tab navigation (Recipes, Add, Settings)
- ✅ Premium minimalist design system
- ✅ Lottie success animations
- ✅ Cost protection ($10/month hard limit)
