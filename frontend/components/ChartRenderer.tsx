"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export interface ChartData {
  chartType: string;
  title: string;
  xAxis?: {
    label: string;
    data: string[] | number[];
  };
  yAxis?: {
    label: string;
  };
  series?: Array<{
    name: string;
    data: number[];
  }>;
  data?: Array<{ name: string; value: number }>;
  columns?: string[];
  rows?: string[][];
  insight: string;
  error?: string;
}

interface ChartRendererProps {
  data: ChartData;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function ChartRenderer({ data }: ChartRendererProps) {
  if (data.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error: {data.error}</p>
      </div>
    );
  }

  const getChart = () => {
    switch (data.chartType) {
      case "line":
        return renderLineChart();
      case "bar":
        return renderBarChart();
      case "pie":
        return renderPieChart();
      case "table":
        return renderTable();
      default:
        return <p>Unknown chart type: {data.chartType}</p>;
    }
  };

  function renderLineChart() {
    if (!data.xAxis?.data || !data.series) return null;

    const chartData = {
      labels: data.xAxis.data as string[],
      datasets: data.series.map((series, index) => ({
        label: series.name,
        data: series.data,
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length],
      })),
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { position: "top" as const },
        title: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: data.yAxis?.label || "",
          },
        },
        x: {
          title: {
            display: true,
            text: data.xAxis?.label || "",
          },
        },
      },
    };

    return <Line data={chartData} options={options} />;
  }

  function renderBarChart() {
    if (!data.xAxis?.data || !data.series) return null;

    const chartData = {
      labels: data.xAxis.data as string[],
      datasets: data.series.map((series, index) => ({
        label: series.name,
        data: series.data,
        backgroundColor: COLORS[index % COLORS.length],
      })),
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { position: "top" as const },
        title: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: data.yAxis?.label || "",
          },
        },
        x: {
          title: {
            display: true,
            text: data.xAxis?.label || "",
          },
        },
      },
    };

    return <Bar data={chartData} options={options} />;
  }

  function renderPieChart() {
    if (!data.data) return null;

    const chartData = {
      labels: data.data.map((d) => d.name),
      datasets: [
        {
          data: data.data.map((d) => d.value),
          backgroundColor: COLORS,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { position: "right" as const },
        title: { display: false },
      },
    };

    return <Doughnut data={chartData} options={options} />;
  }

  function renderTable() {
    if (!data.columns || !data.rows) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {data.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{data.title}</h2>
      {getChart()}
      {data.insight && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{data.insight}</p>
        </div>
      )}
    </div>
  );
}
