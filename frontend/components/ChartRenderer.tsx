"use client";

import React, { useRef } from "react";
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
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { Box, Typography, Paper, useTheme, IconButton, Tooltip as MuiTooltip } from "@mui/material";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import DownloadIcon from "@mui/icons-material/Download";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
  showExportButton?: boolean;
}

const CHART_COLORS = {
  light: [
    "#06a24a",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#84cc16",
    "#ec4899",
  ],
  dark: [
    "#4ade80",
    "#60a5fa",
    "#a78bfa",
    "#fbbf24",
    "#f87171",
    "#22d3ee",
    "#a3e635",
    "#f472b6",
  ],
};

export default function ChartRenderer({ data, showExportButton = true }: ChartRendererProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const colors = isDark ? CHART_COLORS.dark : CHART_COLORS.light;
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${data.title.replace(/\s+/g, "-").toLowerCase()}-chart.jpeg`;
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: "easeInOutQuart" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDark ? "#94a3b8" : "#64748b",
          usePointStyle: true,
          padding: 16,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        titleColor: isDark ? "#f1f5f9" : "#1e293b",
        bodyColor: isDark ? "#94a3b8" : "#64748b",
        borderColor: isDark ? "#334155" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? "#334155" : "#f1f5f9",
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: isDark ? "#334155" : "#f1f5f9",
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    ...chartOptions,
    scales: undefined,
  };

  if (data.error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)",
          border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)"}`,
          borderRadius: 2,
        }}
      >
        <Typography color="error" sx={{ fontWeight: 500 }}>
          Error: {data.error}
        </Typography>
      </Paper>
    );
  }

  const renderChart = () => {
    switch (data.chartType) {
      case "line":
        return renderLineChart();
      case "bar":
        return renderBarChart();
      case "pie":
      case "doughnut":
        return renderPieChart();
      case "area":
        return renderAreaChart();
      case "table":
        return renderTable();
      default:
        return renderBarChart();
    }
  };

  function renderLineChart() {
    if (!data.xAxis?.data || !data.series) return null;

    const chartData = {
      labels: data.xAxis.data as string[],
      datasets: data.series.map((series, index) => ({
        label: series.name,
        data: series.data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length],
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    };

    return (
      <Box sx={{ height: 300 }}>
        <Line data={chartData} options={chartOptions as any} />
      </Box>
    );
  }

  function renderAreaChart() {
    if (!data.xAxis?.data || !data.series) return null;

    const chartData = {
      labels: data.xAxis.data as string[],
      datasets: data.series.map((series, index) => ({
        label: series.name,
        data: series.data,
        borderColor: colors[index % colors.length],
        backgroundColor: `${colors[index % colors.length]}30`,
        fill: true,
        tension: 0.4,
      })),
    };

    return (
      <Box sx={{ height: 300 }}>
        <Line data={chartData} options={chartOptions as any} />
      </Box>
    );
  }

  function renderBarChart() {
    if (!data.xAxis?.data || !data.series) return null;

    const chartData = {
      labels: data.xAxis.data as string[],
      datasets: data.series.map((series, index) => ({
        label: series.name,
        data: series.data,
        backgroundColor: `${colors[index % colors.length]}cc`,
        borderColor: colors[index % colors.length],
        borderWidth: 1,
        borderRadius: 6,
      })),
    };

    return (
      <Box sx={{ height: 300 }}>
        <Bar data={chartData} options={chartOptions as any} />
      </Box>
    );
  }

  function renderPieChart() {
    if (!data.data) return null;

    const chartData = {
      labels: data.data.map((d) => d.name),
      datasets: [
        {
          data: data.data.map((d) => d.value),
          backgroundColor: colors,
          borderColor: isDark ? "#1e293b" : "#ffffff",
          borderWidth: 2,
        },
      ],
    };

    const options = {
      ...pieOptions,
      plugins: {
        ...pieOptions.plugins,
        legend: {
          position: "right" as const,
          labels: {
            color: isDark ? "#94a3b8" : "#64748b",
            usePointStyle: true,
            padding: 12,
          },
        },
      },
    };

    return (
      <Box sx={{ height: 300 }}>
        {data.chartType === "pie" ? (
          <Pie data={chartData} options={options as any} />
        ) : (
          <Doughnut data={chartData} options={options as any} />
        )}
      </Box>
    );
  }

  function renderTable() {
    if (!data.columns || !data.rows) return null;

    return (
      <Box sx={{ overflowX: "auto" }}>
        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            "& th": {
              backgroundColor: isDark ? "grey.800" : "grey.50",
              color: isDark ? "#f1f5f9" : "#1e293b",
              fontWeight: 600,
              textAlign: "left",
              px: 2,
              py: 1.5,
              fontSize: "0.875rem",
              borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            },
            "& td": {
              px: 2,
              py: 1.5,
              fontSize: "0.875rem",
              color: isDark ? "#94a3b8" : "#64748b",
              borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            },
            "& tr:hover td": {
              backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            },
          }}
        >
          <thead>
            <tr>
              {data.columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box ref={chartRef} sx={{ p: showExportButton ? 2 : 0, borderRadius: 2, backgroundColor: showExportButton ? "background.paper" : "transparent" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {data.title}
          </Typography>
          {showExportButton && (
            <MuiTooltip title="Export as JPEG">
              <IconButton onClick={handleExport} size="small" sx={{ color: "text.secondary" }}>
                <DownloadIcon />
              </IconButton>
            </MuiTooltip>
          )}
        </Box>

        {renderChart()}

        {data.insight && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: isDark ? "rgba(6, 162, 74, 0.1)" : "rgba(6, 162, 74, 0.05)",
              border: `1px solid ${isDark ? "rgba(6, 162, 74, 0.3)" : "rgba(6, 162, 74, 0.2)"}`,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isDark ? "#4ade80" : "#06a24a",
                fontWeight: 500,
              }}
            >
              {data.insight}
            </Typography>
          </Paper>
        )}
      </Box>
    </motion.div>
  );
}
