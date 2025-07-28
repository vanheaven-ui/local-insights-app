// src/app/api/analyze/route.ts
import { NextResponse } from "next/server";
// Import the Google Generative AI library
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
// Make sure your GEMINI_API_KEY is set in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { feedbackText } = await request.json();

    if (
      !feedbackText ||
      typeof feedbackText !== "string" ||
      feedbackText.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Feedback text is required." },
        { status: 400 }
      );
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Construct the prompt for Gemini
    const prompt = `
      You are a helpful assistant that analyzes customer feedback for small businesses.
      Analyze the following customer feedback and provide:
      1. A concise summary.
      2. Key positive themes (as a list of strings).
      3. Key negative themes (as a list of strings).
      4. Overall sentiment (Positive, Negative, Mixed, or Neutral).
      5. Actionable insights (a detailed paragraph).
      6. 2-3 key takeaways (as a list of strings).
      7. 2-3 specific recommendations (as a list of strings).

      Format your response as a JSON object with the following keys:
      'summary': string,
      'sentiment': string,
      'keyThemes': { 'positive': string[], 'negative': string[] },
      'actionableInsights': string,
      'keyTakeaways': string[],
      'recommendations': string[].

      Ensure all lists are actual JSON arrays, even if empty.

      Customer Feedback: "${feedbackText}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawContent = response.text(); // Gemini returns content as text

    if (!rawContent) {
      console.error("Gemini API returned null content.");
      return NextResponse.json(
        { error: "Failed to get analysis from AI." },
        { status: 500 }
      );
    }

    let analysisResult;
    try {
      // Attempt to parse the raw content as JSON
      analysisResult = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw AI response:", rawContent);
      // Sometimes the model might include markdown backticks, try to clean it
      const cleanedContent = rawContent
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      try {
        analysisResult = JSON.parse(cleanedContent);
      } catch (secondParseError) {
        console.error(
          "Failed to parse cleaned AI response as JSON:",
          secondParseError
        );
        return NextResponse.json(
          { error: "AI response was not valid JSON after cleaning." },
          { status: 500 }
        );
      }
    }

    // Basic validation for all expected fields
    if (
      !analysisResult.summary ||
      !analysisResult.sentiment ||
      !analysisResult.keyThemes ||
      !analysisResult.actionableInsights ||
      !analysisResult.keyTakeaways ||
      !analysisResult.recommendations ||
      !Array.isArray(analysisResult.keyThemes.positive) ||
      !Array.isArray(analysisResult.keyThemes.negative) ||
      !Array.isArray(analysisResult.keyTakeaways) ||
      !Array.isArray(analysisResult.recommendations)
    ) {
      console.warn(
        "AI response missing expected keys or arrays are not arrays:",
        analysisResult
      );
      return NextResponse.json(
        {
          error: "AI response structure is incomplete or malformed.",
          result: analysisResult,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error: any) {
    console.error("API Route Error:", error);
    if (error.name === "SyntaxError") {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred on the server." },
      { status: 500 }
    );
  }
}
