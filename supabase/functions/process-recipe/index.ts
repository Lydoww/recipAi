import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ProcessRecipeRequest {
  url: string;
}

interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
  duration?: string;
  category?: string;
  image_url?: string;
  source_url: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { url }: ProcessRecipeRequest = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    const normalizedUrl = normalizeUrl(url);

    const { data: existingRecipe } = await supabaseClient
      .from("recipes")
      .select("*")
      .eq("source_url", normalizedUrl)
      .single();

    if (existingRecipe) {
      return new Response(
        JSON.stringify({
          recipe: existingRecipe,
          cached: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const recipe = await processVideoToRecipe(url);

    const { data: savedRecipe, error } = await supabaseClient
      .from("recipes")
      .insert({
        ...recipe,
        source_url: normalizedUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        recipe: savedRecipe,
        cached: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.search = "";
    urlObj.hash = "";
    return urlObj.toString();
  } catch {
    return url.trim();
  }
}

async function processVideoToRecipe(videoUrl: string): Promise<Recipe> {
  // Phase 2b: Using OpenAI GPT-4o for recipe extraction
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

  if (!openaiApiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const openai = new OpenAI({
    apiKey: openaiApiKey,
  });

  // For now, simulate a video transcript (Phase 2c will download real video + Whisper)
  const mockTranscript = `
    Hey guys! Today I'm making my favorite pasta carbonara.
    You'll need 400 grams of spaghetti, 200 grams of pancetta,
    4 eggs, and 100 grams of Pecorino Romano cheese.
    Also black pepper and salt.

    First, boil salted water and cook the spaghetti.
    While that's cooking, cut the pancetta into small cubes and fry until crispy.
    In a bowl, whisk the eggs with grated cheese.
    Save a cup of pasta water before draining.
    Take the pan off the heat, add the pasta to the pancetta,
    then quickly mix in the egg mixture with some pasta water to make it creamy.
    Add pepper and serve! This takes about 20 minutes total.
  `;

  // Call GPT-4o to extract structured recipe
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a recipe extraction assistant. Extract recipe information from transcripts and return ONLY valid JSON with this exact structure:
{
  "title": "Recipe name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"],
  "duration": "X minutes",
  "category": "cuisine type"
}`,
      },
      {
        role: "user",
        content: `Extract the recipe from this video transcript:\n\n${mockTranscript}`,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error("No response from OpenAI");
  }

  const parsedRecipe = JSON.parse(responseContent);

  const category = parsedRecipe.category || "General";
  const imageUrl = getCategoryImage(category);

  const recipe: Recipe = {
    title: parsedRecipe.title || "Untitled Recipe",
    ingredients: parsedRecipe.ingredients || [],
    steps: parsedRecipe.steps || [],
    duration: parsedRecipe.duration,
    category: category,
    image_url: imageUrl,
    source_url: videoUrl,
  };

  return recipe;
}

function getCategoryImage(category: string): string {
  const categoryImages: Record<string, string> = {
    italian: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    asian: "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
    japanese: "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
    chinese: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
    mexican: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
    french: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    american: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    dessert: "https://images.unsplash.com/photo-1551024506-0bccd828d307",
    breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666",
    salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
    seafood: "https://images.unsplash.com/photo-1559737558-2f5a70f5775c",
    meat: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba",
    vegetarian: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    vegan: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    thai: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4",
    mediterranean: "https://images.unsplash.com/photo-1529042410759-befb1204b468",
  };

  const normalizedCategory = category.toLowerCase().trim();
  return categoryImages[normalizedCategory] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
}
