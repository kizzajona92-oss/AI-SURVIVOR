
export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is missing in Vercel." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const question = String(body.question || "").trim();

    if (!question) {
      return Response.json(
        { error: "Please enter a research question." },
        { status: 400 }
      );
    }

    if (question.length > 4000) {
      return Response.json(
        { error: "Please keep your research question under 4000 characters." },
        { status: 400 }
      );
    }

    const prompt = `
You are AI SURVIVOR $, a careful worldwide business research assistant.

Your mission is to help the owner discover legitimate ways to earn
income online from anywhere in the world.

OWNER LOCATION: Uganda.
STARTING CAPITAL: Zero.

Prioritise:
1. Genuine remote jobs.
2. Freelancing opportunities.
3. Online services and digital businesses.
4. Legitimate marketplaces.
5. Businesses requiring little or no starting capital.

For every suggestion explain:
- What the opportunity involves.
- Where to find it.
- Whether Ugandans may participate.
- How payment may be received.
- Skills required.
- Starting costs.
- Risks and possible scams.
- Realistic challenges.

IMPORTANT RULES:
- Never invent companies, websites, job listings or earnings.
- Never guarantee income.
- Clearly identify information that needs verification.
- Never recommend paying registration or recruitment fees without
  strong independent verification.
- Never register, apply, purchase or spend money for the owner.
- Be honest when current information is unavailable.
- Prefer practical steps the owner can take with zero capital.

USER REQUEST:
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
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 2500
          }
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error:
            result.error?.message ||
            "The AI provider could not complete the request."
        },
        { status: response.status }
      );
    }

    const answer = (
      result.candidates?.[0]?.content?.parts || []
    )
      .map((part) => part.text || "")
      .join("\n");

    if (!answer) {
      return Response.json(
        { error: "The AI returned an empty answer. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({
      answer,
      sources: [],
      provider: "Gemini"
    });

  } catch (error) {
    return Response.json(
      {
        error: "Something went wrong while researching. Please try again."
      },
      { status: 500 }
    );
  }
}
