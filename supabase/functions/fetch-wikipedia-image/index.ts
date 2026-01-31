import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Fetches the main image (thumbnail) from a Wikipedia page URL.
 * Uses the Wikipedia API to get page images.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, title } = await req.json();

    if (!url && !title) {
      return new Response(
        JSON.stringify({ error: "Missing url or title parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let pageTitle = title;
    let lang = "en";

    // Extract page title and language from Wikipedia URL if provided
    if (url) {
      const urlMatch = url.match(/https?:\/\/([a-z]{2,3})\.wikipedia\.org\/wiki\/(.+)/i);
      if (urlMatch) {
        lang = urlMatch[1];
        pageTitle = decodeURIComponent(urlMatch[2].replace(/_/g, " "));
      }
    }

    if (!pageTitle) {
      return new Response(
        JSON.stringify({ error: "Could not extract page title" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching Wikipedia image for: "${pageTitle}" (lang: ${lang})`);

    // Use Wikipedia API to get page images - request both thumbnail and original
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
      return new Response(
        JSON.stringify({ error: "Page not found", imageUrl: null }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pages = Object.values(data.query.pages) as any[];
    const page = pages[0];

    if (!page || page.missing) {
      return new Response(
        JSON.stringify({ error: "Page not found", imageUrl: null }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the main thumbnail image or original
    let imageUrl = page.thumbnail?.source || page.original?.source || null;

    // If no thumbnail, try to get the first image from the page
    if (!imageUrl && page.images?.length > 0) {
      // Filter out common non-content images
      const contentImages = page.images.filter((img: any) => {
        const title = img.title.toLowerCase();
        return !title.includes("icon") && 
               !title.includes("logo") && 
               !title.includes("flag") &&
               !title.includes("commons-logo") &&
               !title.includes("disambig") &&
               !title.includes("edit-") &&
               (title.endsWith(".jpg") || title.endsWith(".jpeg") || title.endsWith(".png"));
      });

      if (contentImages.length > 0) {
        // Get the actual image URL for the first content image
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

    console.log(`Found image: ${imageUrl || "none"}`);

    return new Response(
      JSON.stringify({ 
        imageUrl,
        pageTitle: page.title,
        pageId: page.pageid
      }),
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
