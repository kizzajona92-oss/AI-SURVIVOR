
export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is missing. Check Vercel settings." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const question = String(body.question || "").trim();

    if (!question) {
      return Response.json(
        { error: "Please enter what you want AI SURVIVOR to research." },
        { status: 400 }
      );
    }

    const prompt = `
You are the worldwide business research engine for AI SURVIVOR $.

Research real, legitimate ways to earn income anywhere on the internet.
Prioritise opportunities requiring zero or very little starting capital.

The owner is based in Uganda. Check whether people in Uganda can
register, participate and withdraw payments wherever possible.

Look for actual opportunities, platforms and current listings.
Include source links, eligibility, skills required, costs, payment
methods, risks and realistic barriers.

Separate verified facts from estimates. Never invent listings,
earnings, payment methods or eligibility. If something cannot be
verified, say so clearly. Warn about scams and upfront-fee risks.

Do not register, apply, purchase, pay or contact anyone.

User's research request:
${question}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          tools: [{ google_search: {} }]
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: result.error?.message || "Gemini request failed." },
        { status: response.status }
      );
    }

    const answer = (result.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("\n");

    const sources =
      result.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((item) => ({
          title: item.web?.title || "Web source",
          url: item.web?.uri
        }))
        .filter((item) => item.url) || [];

    return Response.json({ answer, sources });
  } catch (error) {
    return Response.json(
      { error: "Research failed. Please try again." },
      { status: 500 }
    );
  }
}
