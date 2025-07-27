"use client";

import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
          Local Insights
        </h1>
        <p className="mt-3 text-xl text-gray-600">
          AI-Powered Customer Feedback Analyst for Small Businesses
        </p>
      </header>

      <main className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 space-y-8">
        {/* Input Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Paste Customer Feedback Here
          </h2>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="e.g., 'The coffee was great but the wait was too long.' or 'Fantastic service, my new favorite salon!'"
          ></textarea>
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
            Analyze Feedback
          </button>
        </section>

        {/* Results Section (will be populated by AI later) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Analysis Results
          </h2>
          <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
            <p className="text-gray-500 italic">
              Results will appear here after analysis.
            </p>
            {/* Example of what results might look like (will be dynamic) */}
            {/*
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Summary:</h3>
                <p className="text-gray-900">Customers generally like the products but are frustrated by slow service.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Key Themes:</h3>
                <ul className="list-disc list-inside text-gray-900">
                  <li>Positive: Coffee quality, Friendly staff</li>
                  <li>Negative: Long wait times, Cleanliness</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Sentiment:</h3>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Mixed (Slightly Negative)
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Actionable Insights:</h3>
                <p className="text-gray-900">Consider optimizing staffing during peak hours to reduce wait times. Implement a daily cleaning checklist for common areas.</p>
              </div>
            </div>
            */}
          </div>
        </section>
      </main>
    </div>
  );
}
