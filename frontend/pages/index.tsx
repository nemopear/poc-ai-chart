"use client";

import React, { useState } from "react";
import ChartRenderer, { ChartData } from "../components/ChartRenderer";
// const MOCK_CHART=[{
//     "chartType": "line",
//     "title": "Monthly Revenue Trend",
//     "xAxis": {
//         "label": "Month",
//         "data": [
//             "January",
//             "February",
//             "March",
//             "April",
//             "May",
//             "June",
//             "July",
//             "August",
//             "September",
//             "October",
//             "November",
//             "December"
//         ]
//     },
//     "yAxis": {
//         "label": "Revenue"
//     },
//     "series": [
//         {
//             "name": "Revenue",
//             "data": [
//                 120000,
//                 135000,
//                 150000,
//                 142000,
//                 165000,
//                 180000,
//                 195000,
//                 210000,
//                 225000,
//                 240000,
//                 280000,
//                 320000
//             ]
//         }
//     ],
//     "insight": ""
// }]

const MOCK_CHART: ChartData = {
    "chartType": "line",
    "title": "Monthly Revenue Trend",
    "xAxis": {
        "label": "Month",
        "data": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
    },
    "yAxis": {
        "label": "Revenue"
    },
    "series": [
        {
            "name": "Revenue",
            "data": [
                120000,
                135000,
                150000,
                142000,
                165000,
                180000,
                195000,
                210000,
                225000,
                240000,
                280000,
                320000
            ]
        }
    ],
    "insight": "Revenue increased throughout the year, with a peak in December."
};
export default function Home() {
  const [question, setQuestion] = useState("");
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setChartData(null);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "Show monthly revenue trend",
    "Compare product sales by category",
    "Show revenue breakdown by product",
    "Display customer growth over time",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Data Visualization Chatbot
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ask questions about your data and get interactive charts
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your data (e.g., 'Show monthly revenue trend')"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Processing..." : "Generate Chart"}
              </button>
            </div>
          </form>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Try these questions:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((eq, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(eq)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {(chartData || !chartData) && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ChartRenderer data={chartData || MOCK_CHART} />
            </div>
          )}

          {loading && (
            <div className="text-center py-12 text-gray-500">
              <p>Loading chart...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
