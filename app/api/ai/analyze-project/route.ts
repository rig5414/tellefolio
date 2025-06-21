import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { productionUrl, repo } = await req.json();

  // 1. Fetch the HTML content of the production URL
  let html = "";
  try {
    const res = await fetch(productionUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch production URL." },
      { status: 400 }
    );
  }

  // 2. Prepare prompt for OpenAI
  const prompt = `You are an AI portfolio assistant. Analyze the following website HTML and GitHub repo info, and extract structured project details for a portfolio. Return a JSON object with: title, tagline, description, technologies (comma-separated).\n\nWebsite HTML:\n${html.slice(
    0,
    8000
  )}\n\nGitHub Repo:\n${JSON.stringify(repo)}\n\nJSON:`;

  // 3. Call OpenAI API
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts project details for a portfolio.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 400,
    });
    // 4. Parse the JSON from the AI response
    const text = completion.choices[0].message?.content || "{}";
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { description: text };
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "OpenAI API error." }, { status: 500 });
  }
}
