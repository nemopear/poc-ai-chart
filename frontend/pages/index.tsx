"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import useSWR, { mutate } from "swr";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PieChartIcon from "@mui/icons-material/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import Header from "../components/Header";
import Chatbot from "../components/Chatbot/Chatbot";

interface ChartData {
  chartType: string;
  title: string;
  xAxis?: { label: string; data: string[] | number[] };
  yAxis?: { label: string };
  series?: Array<{ name: string; data: number[] }>;
  data?: Array<{ name: string; value: number }>;
  columns?: string[];
  rows?: string[][];
  insight: string;
  error?: string;
}

const ChartRenderer = dynamic(() => import("../components/ChartRenderer"), {
  ssr: false,
  loading: () => (
    <Paper
      sx={{
        p: 3,
        backgroundColor: "background.paper",
        borderRadius: 3,
        minHeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography color="text.secondary">Loading chart...</Typography>
    </Paper>
  ),
});

const MOCK_CHART: ChartData = {
  chartType: "bar",
  title: "Batch Release Status by Line",
  xAxis: {
    label: "Production Line",
    data: ["Line A", "Line B", "Line C"],
  },
  yAxis: {
    label: "Batches",
  },
  series: [
    {
      name: "Released",
      data: [3, 2, 2],
    },
    {
      name: "In Progress",
      data: [0, 2, 0],
    },
    {
      name: "Pending",
      data: [0, 1, 0],
    },
    {
      name: "Rejected",
      data: [0, 0, 1],
    },
  ],
  insight: "Line A has the highest release rate at 100%. Line C had 1 rejected batch requiring investigation.",
};

const STATS = [
  { label: "Total Batches", value: "8", change: "+2", icon: TrendingUpIcon, color: "#06a24a" },
  { label: "Released", value: "6", change: "+1", icon: PieChartIcon, color: "#3b82f6" },
  { label: "Equipment Utilization", value: "68%", change: "+5%", icon: BarChartIcon, color: "#8b5cf6" },
  { label: "Order Fulfillment", value: "75%", change: "+10%", icon: TimelineIcon, color: "#f59e0b" },
] as const;

const QUICK_ACTIONS = ["Export Report", "Schedule Report", "Share Dashboard", "Create Alert"] as const;
const DATA_SOURCES = ["Sales Database", "Inventory System", "CRM Analytics", "Financial Reports"] as const;
const EXAMPLE_QUESTIONS = [
  "Show batch release status by line",
  "Display equipment utilization rate",
  "Show production plan vs actual",
  "Display order fulfillment rate",
] as const;

type StatItem = typeof STATS[number];

const StatCard = React.memo(({ stat, index }: { stat: StatItem; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${stat.color}10 0%, transparent 100%)`,
        borderLeft: `4px solid ${stat.color}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {stat.label}
          </Typography>
          <stat.icon sx={{ color: stat.color, fontSize: 20 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
          {stat.value}
        </Typography>
        <Chip
          size="small"
          label={stat.change}
          sx={{
            mt: 1,
            backgroundColor: `${stat.color}20`,
            color: stat.color,
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      </CardContent>
    </Card>
  </motion.div>
));

StatCard.displayName = "StatCard";

const fetcher = async (question: string) => {
  const response = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
};

export default function Home() {
  const theme = useTheme();
  const [question, setQuestion] = useState("");
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const cacheKey = `chat-${question}`;
      const data = await mutate(
        cacheKey,
        fetcher(question),
        false
      );
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [question]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {STATS.map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
              <StatCard stat={stat} index={index} />
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                  minHeight: 500,
                }}
              >
                {/* Query Input */}
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask about your data (e.g., 'Show monthly revenue trend')"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "grey.50",
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || !question.trim()}
                      sx={{ px: 4, whiteSpace: "nowrap" }}
                    >
                      {loading ? "Processing..." : "Generate"}
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {EXAMPLE_QUESTIONS.map((eq, index) => (
                      <Chip
                        key={index}
                        label={eq}
                        onClick={() => setQuestion(eq)}
                        variant="outlined"
                        sx={{
                          cursor: "pointer",
                          borderColor: "divider",
                          "&:hover": {
                            borderColor: "primary.main",
                            color: "primary.main",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {error ? (
                  <Paper
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: "error.light",
                      border: `1px solid ${theme.palette.error.main}`,
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="error">{error}</Typography>
                  </Paper>
                ) : null}

                {/* Chart Display */}
                <ChartRenderer data={chartData || MOCK_CHART} />
              </Paper>
            </motion.div>
          </Grid>

          {/* Side Panel */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Paper sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {QUICK_ACTIONS.map((action, i) => (
                      <Button
                        key={i}
                        variant="outlined"
                        fullWidth
                        sx={{
                          justifyContent: "flex-start",
                          borderColor: "divider",
                          color: "text.secondary",
                          "&:hover": {
                            borderColor: "primary.main",
                            color: "primary.main",
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        {action}
                      </Button>
                    )
                  )}
                </Box>
              </Paper>

              <Paper sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Data Sources
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {DATA_SOURCES.map((source, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "grey.50",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {source}
                        </Typography>
                        <Chip
                          size="small"
                          label="Active"
                          sx={{
                            backgroundColor: "success.light",
                            color: "success.dark",
                            fontSize: "0.65rem",
                            height: 20,
                          }}
                        />
                      </Box>
                    )
                  )}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <Chatbot />
    </Box>
  );
}
