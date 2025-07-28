// src/app/api/analyze/route.ts

import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const response = await axios.get(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
);
console.log("Available models:", response.data);

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

    const prompt = `
You are a helpful assistant that analyzes customer feedback for small businesses.
Please analyze the following feedback and summarize key sentiments, issues, and suggestions.

Feedback:
"${feedbackText}"
    `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const outputText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";

    return NextResponse.json({
      message: "Analysis complete.",
      analysis: outputText,
    });
  } catch (error: any) {
    console.error("API Route Error:", error?.response?.data || error.message);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || "Gemini API error";

      if (status === 401 || message.includes("API key")) {
        return NextResponse.json(
          { error: "Authentication failed. Check your GEMINI_API_KEY." },
          { status: 401 }
        );
      }

      if (status === 404 && message.includes("not found")) {
        return NextResponse.json(
          {
            error:
              "Model not found. Make sure your API key is from AI Studio and supports gemini-pro.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
