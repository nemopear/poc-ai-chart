"use client";

import React from "react";
import { Box, Typography, IconButton, useTheme, AppBar, Toolbar } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useThemeMode } from "../theme/ThemeProvider";

export default function Header() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          py: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: "primary.main",
            }}
          >
            <AnalyticsIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.2,
              }}
            >
              AI Manufacturing Dashboard
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }}
            >
              Data Visualization & Analytics
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={toggleTheme}
          sx={{
            color: "text.secondary",
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            },
          }}
        >
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
