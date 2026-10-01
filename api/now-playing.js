const STATS_URL = "https://s03.svrdedicado.org:8046/stats?json=1";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const upstream = await fetch(STATS_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return response.status(502).json({ error: "Streaming metadata unavailable" });
    }

    const data = await upstream.json();

    response.setHeader("Cache-Control", "no-store, max-age=0");
    return response.status(200).json({
      songtitle: typeof data?.songtitle === "string" ? data.songtitle : null,
    });
  } catch (error) {
    console.error("Erro ao buscar metadados do streaming:", error);
    return response.status(502).json({ error: "Streaming metadata unavailable" });
  }
}
