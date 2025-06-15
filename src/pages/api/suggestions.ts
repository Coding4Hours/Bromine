import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q")

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  try {
    const externalApiUrl = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}`
    const response = await fetch(externalApiUrl)

    if (!response.ok) {
      // Forward the error status from the external API
      return new Response(await response.text(), {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "text/plain",
        },
      })
    }

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Add CORS headers if you want this API route to be accessible by other origins
        // For internal use (client-side of the same Astro app), this isn't strictly needed,
        // but it's good practice if you anticipate external usage.
        // "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error fetching suggestions from external API:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
