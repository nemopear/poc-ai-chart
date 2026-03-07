export interface MockChartData {
  chartType: string;
  title: string;
  xAxis?: { label: string; data: string[] | number[] };
  yAxis?: { label: string };
  series?: Array<{ name: string; data: number[] }>;
  data?: Array<{ name: string; value: number }>;
  columns?: string[];
  rows?: string[][];
  insight: string;
}

export interface MockExample {
  question: string;
  answer: MockChartData;
  streamingText: string;
}

export const MOCK_EXAMPLES: MockExample[] = [
  {
    question: "Show batch release status by line",
    streamingText: `Based on the production data, here is the batch release status across all manufacturing lines:

• Line A: 98% release rate (highest performer)
• Line B: 94% release rate  
• Line C: 91% release rate
• Line D: 89% release rate

The data shows Line A consistently exceeds targets, while Line D needs attention.`,
    answer: {
      chartType: "bar",
      title: "Batch Release Status by Line",
      xAxis: { label: "Manufacturing Line", data: ["Line A", "Line B", "Line C", "Line D"] },
      yAxis: { label: "Release Rate (%)" },
      series: [{ name: "Release Rate", data: [98, 94, 91, 89] }],
      insight: "Line A leads with 98% release rate, while Line D at 89% needs improvement."
    }
  },
  {
    question: "Display equipment utilization rate",
    streamingText: `Here's the current equipment utilization analysis:

• CNC Machine 1: 95% utilization
• CNC Machine 2: 88% utilization
• Assembly Line: 92% utilization
• Packaging Unit: 78% utilization

Overall equipment effectiveness (OEE) is at 88%, which is above industry average.`,
    answer: {
      chartType: "bar",
      title: "Equipment Utilization Rate",
      xAxis: { label: "Equipment", data: ["CNC 1", "CNC 2", "Assembly", "Packaging"] },
      yAxis: { label: "Utilization (%)" },
      series: [{ name: "Utilization", data: [95, 88, 92, 78] }],
      insight: "CNC Machine 1 has highest utilization at 95%. Packaging unit at 78% has room for improvement."
    }
  },
  {
    question: "Show production plan vs actual",
    streamingText: `Production plan vs actual output comparison:

• Week 1: Planned 1000, Actual 980 (98%)
• Week 2: Planned 1200, Actual 1150 (96%)
• Week 3: Planned 1100, Actual 1120 (102%)
• Week 4: Planned 1300, Actual 1250 (96%)

Week 3 exceeded targets by 2%. Average achievement is 98%.`,
    answer: {
      chartType: "bar",
      title: "Production Plan vs Actual",
      xAxis: { label: "Week", data: ["Week 1", "Week 2", "Week 3", "Week 4"] },
      yAxis: { label: "Units" },
      series: [
        { name: "Plan", data: [1000, 1200, 1100, 1300] },
        { name: "Actual", data: [980, 1150, 1120, 1250] }
      ],
      insight: "Week 3 exceeded plan by 2%. Overall 98% achievement rate."
    }
  },
  {
    question: "Display order fulfillment rate",
    streamingText: `Order fulfillment analysis for the past month:

• On-time: 85% of orders
• Early: 10% of orders
• Late: 5% of orders

Key insights:
• 95% of orders delivered on or before due date
• Late orders mainly from Line C
• Customer satisfaction remains high at 4.5/5`,
    answer: {
      chartType: "pie",
      title: "Order Fulfillment Rate",
      data: [
        { name: "On-time", value: 85 },
        { name: "Early", value: 10 },
        { name: "Late", value: 5 }
      ],
      insight: "95% on-time or early delivery rate. Only 5% late orders."
    }
  }
];

export function getMockExample(question: string): MockExample | undefined {
  const lowerQuestion = question.toLowerCase();
  return MOCK_EXAMPLES.find(ex => 
    lowerQuestion.includes(ex.question.toLowerCase()) ||
    ex.question.toLowerCase().includes(lowerQuestion)
  );
}

export function getAllMockExamples(): MockExample[] {
  return MOCK_EXAMPLES;
}
