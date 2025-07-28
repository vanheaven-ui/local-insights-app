// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { AnalysisResult } from "./types/api/analysis";
import { analyzeFeedback } from "./lib/api/analysisService";

export default function Home() {
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAnalyze = async () => {
    if (!feedbackText.trim()) {
      setError("Please enter some feedback to analyze.");
      setAnalysisResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Temporary placeholder for analysis for now since backend is not yet implemented
      // Remove this block once the backend is ready and deployed
      if (process.env.NODE_ENV === "development") {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAnalysisResult({
          summary:
            "Customers generally appreciate the coffee quality and friendly staff, but frequently complain about long wait times and uncomfortable seating.",
          sentiment: "Mixed",
          keyThemes: {
            positive: ["Coffee quality", "Friendly staff", "Atmosphere"],
            negative: [
              "Long wait times",
              "Uncomfortable seating",
              "Lack of parking",
            ],
          },
          actionableInsights:
            "Focus on improving operational efficiency during peak hours to reduce wait times. Consider upgrading seating options or adding more comfortable alternatives. Leverage the positive feedback on coffee and staff in marketing efforts.",
          keyTakeaways: [
            "Operational bottlenecks during peak hours are impacting customer satisfaction.",
            "Comfort and waiting experience are significant pain points.",
            "Strong points are product quality (coffee) and human interaction (staff).",
          ],
          recommendations: [
            "Implement a digital queuing system or pre-ordering app to manage wait times.",
            "Conduct a seating audit and gradually replace/add more ergonomic chairs.",
            "Introduce a 'customer appreciation' program for staff members who receive positive mentions.",
          ],
        });
        setIsLoading(false);
        return;
      }
      // End temporary placeholder

      const data = await analyzeFeedback(feedbackText);
      setAnalysisResult(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("Frontend error during analysis:", err);
      setError(errorMessage || "Failed to analyze feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/topography.svg')] bg-repeat bg-center -z-20"
        style={{
          filter: "blur(3px)",
          transform: "scale(1.02)",
        }}
      ></div>
      <div className="absolute inset-0 bg-gray-50 opacity-80 -z-10"></div>

      <header
        className={`fixed top-0 left-0 right-0 z-10 w-full bg-gray-50 text-center
                          transition-all duration-300 ease-in-out
                          ${isHeaderScrolled ? "py-3 shadow-lg" : "py-6"}`}
      >
        <h1
          className={`font-extrabold text-gray-900 transition-all duration-300 ease-in-out
                        ${
                          isHeaderScrolled
                            ? "text-3xl sm:text-4xl lg:text-5xl"
                            : "text-4xl sm:text-5xl lg:text-6xl"
                        }`}
        >
          Local Insights
        </h1>
        <p
          className={`mt-3 text-gray-600 transition-all duration-300 ease-in-out
                       ${isHeaderScrolled ? "text-lg" : "text-xl"}`}
        >
          AI-Powered Customer Feedback Analyst for Small Businesses
        </p>
      </header>

      <main className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 space-y-8 mt-40 z-0">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Paste Customer Feedback Here
          </h2>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="e.g., 'The coffee was great but the wait was too long.' or 'Fantastic service, my new favorite salon!'"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            disabled={isLoading}
          ></textarea>
          <button
            onClick={handleAnalyze}
            className={`mt-4 w-full py-3 px-6 rounded-md transition duration-300 ease-in-out transform ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
            } text-white font-bold`}
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Feedback"}
          </button>
        </section>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Analysis Results
          </h2>
          <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
            {isLoading && (
              <p className="text-gray-600 flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing feedback... This might take a moment.
              </p>
            )}

            {!isLoading && !analysisResult && !error && (
              <p className="text-gray-500 italic">
                Results will appear here after analysis.
              </p>
            )}

            {!isLoading && analysisResult && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    Summary:
                  </h3>
                  <p className="text-gray-900 leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    Key Themes:
                  </h3>
                  {analysisResult.keyThemes.positive.length > 0 && (
                    <div className="mb-2">
                      <p className="font-semibold text-green-700">Positive:</p>
                      <ul className="list-disc list-inside text-gray-900 ml-4">
                        {analysisResult.keyThemes.positive.map(
                          (theme: string, index: number) => (
                            <li key={`pos-${index}`}>{theme}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {analysisResult.keyThemes.negative.length > 0 && (
                    <div>
                      <p className="font-semibold text-red-700">Negative:</p>
                      <ul className="list-disc list-inside text-gray-900 ml-4">
                        {analysisResult.keyThemes.negative.map(
                          (theme: string, index: number) => (
                            <li key={`neg-${index}`}>{theme}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {analysisResult.keyThemes.positive.length === 0 &&
                    analysisResult.keyThemes.negative.length === 0 && (
                      <p className="text-gray-600 italic">
                        No specific themes identified.
                      </p>
                    )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    Sentiment:
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                      analysisResult.sentiment
                        .toLowerCase()
                        .includes("positive")
                        ? "bg-green-100 text-green-800"
                        : analysisResult.sentiment
                            .toLowerCase()
                            .includes("negative")
                        ? "bg-red-100 text-red-800"
                        : analysisResult.sentiment
                            .toLowerCase()
                            .includes("mixed")
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {analysisResult.sentiment}
                  </span>
                </div>

                {/* NEW: Key Takeaways Section */}
                {analysisResult.keyTakeaways &&
                  analysisResult.keyTakeaways.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-1">
                        Key Takeaways:
                      </h3>
                      <ul className="list-disc list-inside text-gray-900 ml-4">
                        {analysisResult.keyTakeaways.map(
                          (takeaway: string, index: number) => (
                            <li key={`takeaway-${index}`}>{takeaway}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* NEW: Recommendations Section */}
                {analysisResult.recommendations &&
                  analysisResult.recommendations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-1">
                        Recommendations:
                      </h3>
                      <ul className="list-disc list-inside text-gray-900 ml-4">
                        {analysisResult.recommendations.map(
                          (recommendation: string, index: number) => (
                            <li key={`recommendation-${index}`}>
                              {recommendation}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    Actionable Insights:
                  </h3>
                  <p className="text-gray-900 leading-relaxed">
                    {analysisResult.actionableInsights}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
