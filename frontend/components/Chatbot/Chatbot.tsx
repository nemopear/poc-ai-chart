"use client";

import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import MinimizeIcon from "@mui/icons-material/Minimize";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { mutate } from "swr";

const ChartRenderer = dynamic(() => import("../ChartRenderer"), {
  ssr: false,
});

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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chartData?: ChartData;
  timestamp: Date;
}

type ChatMode = "compact" | "expanded" | "fullscreen";

const EXAMPLE_QUESTIONS = [
  "Show batch release status by line",
  "Display equipment utilization rate",
  "Show production plan vs actual",
  "Display order fulfillment rate",
] as const;

const chatFetcher = async (question: string) => {
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

export default function Chatbot() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [chatMode, setChatMode] = useState<ChatMode>("compact");
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your MES Analytics Assistant for Electronic Batch Release. Ask me about production batches, equipment utilization, plan vs actual, or order fulfillment.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const cacheKey = `chat-${input}`;
      const data = await mutate(cacheKey, chatFetcher(input), false);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.insight || "Here's your chart:",
        chartData: data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const cycleMode = () => {
    if (chatMode === "compact") setChatMode(isMobile ? "fullscreen" : "expanded");
    else if (chatMode === "expanded") setChatMode("fullscreen");
    else setChatMode("compact");
  };

  const getPanelHeight = () => {
    if (chatMode === "fullscreen") return "100vh";
    return isMobile ? "80vh" : "560px";
  };

  const getPanelWidth = () => {
    if (chatMode === "fullscreen") return "100vw";
    return isMobile ? "100%" : "420px";
  };

  return (
    <>
      {/* Floating Button - Compact Mode */}
      <AnimatePresence>
        {chatMode === "compact" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            <Tooltip title="Open AI Assistant" placement="left">
              <IconButton
                onClick={() => setChatMode("expanded")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: "primary.main",
                  color: "white",
                  boxShadow: "0 4px 20px rgba(6, 162, 74, 0.4)",
                  animation: isHovered ? "none" : "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { boxShadow: "0 0 0 0 rgba(6, 162, 74, 0.4)" },
                    "70%": { boxShadow: "0 0 0 12px rgba(6, 162, 74, 0)" },
                    "100%": { boxShadow: "0 0 0 0 rgba(6, 162, 74, 0)" },
                  },
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <ChatIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded/Fullscreen Panel */}
      <AnimatePresence>
        {chatMode !== "compact" && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: chatMode === "fullscreen" ? "fixed" : "fixed",
              top: chatMode === "fullscreen" ? 0 : "auto",
              bottom: chatMode === "fullscreen" ? 0 : 24,
              right: chatMode === "fullscreen" ? 0 : 24,
              zIndex: 1001,
            }}
          >
            <Paper
              elevation={8}
              sx={{
                width: getPanelWidth(),
                height: getPanelHeight(),
                borderRadius: chatMode === "fullscreen" ? 0 : 3,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                backgroundColor: "background.paper",
                border: chatMode === "fullscreen" ? "none" : undefined,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  backgroundColor: "primary.main",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ChatIcon />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                    AI Assistant
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={cycleMode}
                    sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
                  >
                    {chatMode === "fullscreen" ? (
                      <FullscreenExitIcon fontSize="small" />
                    ) : (
                      <FullscreenIcon fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setChatMode("compact")}
                    sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
                  >
                    {chatMode === "fullscreen" ? (
                      <MinimizeIcon fontSize="small" />
                    ) : (
                      <CloseIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  backgroundColor: isDark ? "background.default" : "grey.50",
                }}
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "80%",
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor:
                          msg.role === "user"
                            ? "primary.main"
                            : isDark
                            ? "grey.800"
                            : "white",
                        color: msg.role === "user" ? "white" : "text.primary",
                        boxShadow: msg.role === "assistant" ? 1 : "none",
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </Typography>
                      {msg.chartData && (
                        <Box sx={{ mt: 2 }}>
                          <ChartRenderer 
                            data={msg.chartData} 
                            key={`${msg.id}-${chatMode}`}
                            showExportButton={true}
                          />
                        </Box>
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: msg.chartData ? 1 : 0.5,
                          opacity: 0.6,
                          textAlign: msg.role === "user" ? "right" : "left",                        }}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <Box
                      sx={{
                        px: 3,
                        py: 2,
                        borderRadius: 2,
                        backgroundColor: isDark ? "grey.800" : "white",
                        boxShadow: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                y: [0, -6, 0],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "#06a24a",
                              }}
                            />
                          ))}
                        </Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: "text.secondary",
                            fontWeight: 500,
                            minWidth: 60
                          }}
                        >
                          Processing...
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <Box sx={{ px: 2, pb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                    Try asking:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {EXAMPLE_QUESTIONS.map((q, i) => (
                      <Button
                        key={i}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setInput(q);
                          handleSend();
                        }}
                        sx={{
                          fontSize: "0.75rem",
                          py: 0.25,
                          px: 1,
                          borderColor: "divider",
                          color: "text.secondary",
                          "&:hover": {
                            borderColor: "primary.main",
                            color: "primary.main",
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        {q}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Ask about your data..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "background.default",
                      },
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": { backgroundColor: "primary.dark" },
                      "&:disabled": { backgroundColor: "action.disabledBackground" },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
