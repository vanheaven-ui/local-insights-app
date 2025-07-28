// src/lib/api/analysisService.ts
import { AnalysisResult } from "@/app/types/api/analysis";
import axios, { AxiosError } from "axios";

// Define the shape of the data sent to the API
interface AnalyzeRequestBody {
  feedbackText: string;
}

/**
 * Calls the backend API to analyze customer feedback using AI.
 * @param feedbackText The text containing customer reviews/feedback.
 * @returns A Promise that resolves to the AnalysisResult or rejects with an error.
 */
export async function analyzeFeedback(
  feedbackText: string
): Promise<AnalysisResult> {
  try {
    const response = await axios.post<AnalysisResult>("/api/analyze", {
      feedbackText,
    } as AnalyzeRequestBody);
    return response.data;
  } catch (err: unknown) {
    // Change from 'any' to 'unknown'
    // More robust error handling for Axios errors
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ error?: string }>; // Cast to AxiosError
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          axiosError.response.data?.error ||
            `Server Error: ${axiosError.response.status}`
        );
      } else if (axiosError.request) {
        // The request was made but no response was received
        throw new Error(
          "No response from server. Please check your network connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Request Error: ${axiosError.message}`);
      }
    } else if (err instanceof Error) {
      // Handle generic JavaScript Error objects
      throw new Error(
        err.message || "An unknown error occurred during analysis."
      );
    } else {
      // Fallback for truly unexpected non-Error objects
      throw new Error("An unexpected error occurred during analysis.");
    }
  }
}
