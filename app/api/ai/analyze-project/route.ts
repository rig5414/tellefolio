import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  // 2. Prepare prompt for Gemini
  const prompt = `You are an AI portfolio assistant. Analyze the following website HTML and GitHub repo info, and extract structured project details for a portfolio. Return a JSON object with: title, tagline, description, technologies (comma-separated).\n\nWebsite HTML:\n${html.slice(
    0,
    8000
  )}\n\nGitHub Repo:\n${JSON.stringify(repo)}\n\nJSON:`;

  // 3. Call Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { description: text };
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ error: "Gemini API error." }, { status: 500 });
  }
}
