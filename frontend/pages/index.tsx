"use client";

import React, { useState } from "react";
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
import ChartRenderer, { ChartData } from "../components/ChartRenderer";

const MOCK_CHART: ChartData = {
  chartType: "line",
  title: "Monthly Revenue Trend",
  xAxis: {
    label: "Month",
    data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  yAxis: {
    label: "Revenue",
  },
  series: [
    {
      name: "Revenue",
      data: [120000, 135000, 150000, 142000, 165000, 180000, 195000, 210000, 225000, 240000, 280000, 320000],
    },
  ],
  insight: "Revenue increased by 167% throughout the year, with peak performance in Q4.",
};

const STATS = [
  { label: "Total Revenue", value: "$1.967M", change: "+23%", icon: TrendingUpIcon, color: "#06a24a" },
  { label: "Active Products", value: "24", change: "+4", icon: PieChartIcon, color: "#3b82f6" },
  { label: "Avg. Order Value", value: "$1,245", change: "+12%", icon: BarChartIcon, color: "#8b5cf6" },
  { label: "Growth Rate", value: "18.5%", change: "+2.3%", icon: TimelineIcon, color: "#f59e0b" },
];

export default function Home() {
  const theme = useTheme();
  const [question, setQuestion] = useState("");
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {STATS.map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
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
                    {exampleQuestions.map((eq, index) => (
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

                {error && (
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
                )}

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
                  {["Export Report", "Schedule Report", "Share Dashboard", "Create Alert"].map(
                    (action, i) => (
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
                  {["Sales Database", "Inventory System", "CRM Analytics", "Financial Reports"].map(
                    (source, i) => (
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
