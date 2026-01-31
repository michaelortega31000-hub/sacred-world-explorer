import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Languages to try for multilingual search
const LANGUAGES = ["en", "fr", "es", "de", "it", "pt", "ar", "ja", "zh"];

/**
 * Fetches the main image from a Wikipedia page.
 * Supports multilingual search for better coverage of sacred places worldwide.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, title, searchMultilingual = true } = await req.json();

    if (!url && !title) {
      return new Response(
        JSON.stringify({ error: "Missing url or title parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let pageTitle = title;
    let primaryLang = "en";

    // Extract page title and language from Wikipedia URL if provided
    if (url) {
      const urlMatch = url.match(/https?:\/\/([a-z]{2,3})\.wikipedia\.org\/wiki\/(.+)/i);
      if (urlMatch) {
        primaryLang = urlMatch[1];
        pageTitle = decodeURIComponent(urlMatch[2].replace(/_/g, " "));
      }
    }

    if (!pageTitle) {
      return new Response(
        JSON.stringify({ error: "Could not extract page title" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching Wikipedia image for: "${pageTitle}" (primary lang: ${primaryLang})`);

    // Try to fetch image from primary language first
    let result = await fetchWikipediaImage(pageTitle, primaryLang);
    
    // If no image found and multilingual search is enabled, try other languages
    if (!result.imageUrl && searchMultilingual) {
      for (const lang of LANGUAGES) {
        if (lang === primaryLang) continue;
        
        console.log(`Trying ${lang} Wikipedia for "${pageTitle}"...`);
        result = await fetchWikipediaImage(pageTitle, lang);
        
        if (result.imageUrl) {
          console.log(`Found image in ${lang} Wikipedia`);
          break;
        }
      }
    }

    // If still no image, try Wikimedia Commons directly
    if (!result.imageUrl) {
      console.log(`Trying Wikimedia Commons for "${pageTitle}"...`);
      result = await fetchFromWikimediaCommons(pageTitle);
    }

    console.log(`Final result: ${result.imageUrl || "no image found"}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error fetching Wikipedia image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage, imageUrl: null }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Fetch image from a specific Wikipedia language edition
 */
async function fetchWikipediaImage(pageTitle: string, lang: string): Promise<{
  imageUrl: string | null;
  pageTitle?: string;
  pageId?: number;
  source?: string;
}> {
  try {
    const apiUrl = `https://${lang}.wikipedia.org/w/api.php?` + new URLSearchParams({
      action: "query",
      titles: pageTitle,
      prop: "pageimages|images|info",
      piprop: "thumbnail|original",
      pithumbsize: "800",
      format: "json",
      origin: "*"
    });

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.query?.pages) {
      return { imageUrl: null };
    }

    const pages = Object.values(data.query.pages) as any[];
    const page = pages[0];

    if (!page || page.missing) {
      return { imageUrl: null };
    }

    // Get the main thumbnail image or original
    let imageUrl = page.thumbnail?.source || page.original?.source || null;

    // If no thumbnail, try to get the first image from the page
    if (!imageUrl && page.images?.length > 0) {
      const contentImages = page.images.filter((img: any) => {
        const title = img.title.toLowerCase();
        return !title.includes("icon") && 
               !title.includes("logo") && 
               !title.includes("flag") &&
               !title.includes("commons-logo") &&
               !title.includes("disambig") &&
               !title.includes("edit-") &&
               !title.includes("question_book") &&
               !title.includes("wiki") &&
               !title.includes("map") &&
               !title.includes("locator") &&
               (title.endsWith(".jpg") || title.endsWith(".jpeg") || title.endsWith(".png"));
      });

      if (contentImages.length > 0) {
        const imageTitle = contentImages[0].title;
        const imageInfoUrl = `https://${lang}.wikipedia.org/w/api.php?` + new URLSearchParams({
          action: "query",
          titles: imageTitle,
          prop: "imageinfo",
          iiprop: "url",
          iiurlwidth: "800",
          format: "json",
          origin: "*"
        });

        const imageInfoResponse = await fetch(imageInfoUrl);
        const imageInfoData = await imageInfoResponse.json();
        const imagePages = Object.values(imageInfoData.query?.pages || {}) as any[];
        
        if (imagePages[0]?.imageinfo?.[0]) {
          imageUrl = imagePages[0].imageinfo[0].thumburl || imagePages[0].imageinfo[0].url;
        }
      }
    }

    return {
      imageUrl,
      pageTitle: page.title,
      pageId: page.pageid,
      source: `${lang}.wikipedia.org`
    };
  } catch (error) {
    console.error(`Error fetching from ${lang} Wikipedia:`, error);
    return { imageUrl: null };
  }
}

/**
 * Fetch image directly from Wikimedia Commons
 */
async function fetchFromWikimediaCommons(searchQuery: string): Promise<{
  imageUrl: string | null;
  source?: string;
}> {
  try {
    // Search for images on Commons
    const searchUrl = `https://commons.wikimedia.org/w/api.php?` + new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: searchQuery,
      srnamespace: "6", // File namespace
      srlimit: "5",
      format: "json",
      origin: "*"
    });

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.query?.search?.length) {
      return { imageUrl: null };
    }

    // Filter for actual photos (not maps, icons, etc.)
    const photoResults = searchData.query.search.filter((result: any) => {
      const title = result.title.toLowerCase();
      return !title.includes("map") &&
             !title.includes("icon") &&
             !title.includes("logo") &&
             !title.includes("flag") &&
             !title.includes("coat_of_arms") &&
             (title.endsWith(".jpg") || title.endsWith(".jpeg") || title.endsWith(".png"));
    });

    if (photoResults.length === 0) {
      return { imageUrl: null };
    }

    // Get image info for the first result
    const fileTitle = photoResults[0].title;
    const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?` + new URLSearchParams({
      action: "query",
      titles: fileTitle,
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: "800",
      format: "json",
      origin: "*"
    });

    const imageInfoResponse = await fetch(imageInfoUrl);
    const imageInfoData = await imageInfoResponse.json();
    const pages = Object.values(imageInfoData.query?.pages || {}) as any[];

    if (pages[0]?.imageinfo?.[0]) {
      return {
        imageUrl: pages[0].imageinfo[0].thumburl || pages[0].imageinfo[0].url,
        source: "commons.wikimedia.org"
      };
    }

    return { imageUrl: null };
  } catch (error) {
    console.error("Error fetching from Wikimedia Commons:", error);
    return { imageUrl: null };
  }
}
