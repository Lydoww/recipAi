import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
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
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiApiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const mockRecipe: Recipe = {
    title: "Delicious Pasta Carbonara",
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale",
      "4 large eggs",
      "100g Pecorino Romano cheese",
      "Black pepper",
      "Salt",
    ],
    steps: [
      "Bring a large pot of salted water to boil and cook spaghetti according to package instructions",
      "While pasta cooks, cut pancetta into small cubes and fry in a pan until crispy",
      "In a bowl, whisk together eggs and grated Pecorino cheese",
      "Reserve 1 cup of pasta water, then drain pasta",
      "Remove pan from heat, add pasta to pancetta",
      "Quickly stir in egg mixture, adding pasta water to create creamy sauce",
      "Season with black pepper and serve immediately",
    ],
    duration: "20 minutes",
    category: "Italian",
    image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
    source_url: videoUrl,
  };

  return mockRecipe;
}
