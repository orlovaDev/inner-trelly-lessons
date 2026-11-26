import type { ThemeMode } from "@/app/app-slice.ts"
import { createTheme } from "@mui/material/styles"

export const getTheme = (themeMode: ThemeMode) => {
  const isDark = themeMode === "dark"

  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: isDark ? "#E07A5F" : "#C25934", // Трендовая теплая терракота / медь
        light: isDark ? "#F29B83" : "#D97757",
        dark: isDark ? "#C45D42" : "#9A3F20",
      },
      secondary: {
        main: isDark ? "#81B29A" : "#2E7D5B", // Благородный шалфей для выполненных задач
      },
      error: {
        main: isDark ? "#EF4444" : "#B91C1C",
      },
      background: {
        default: isDark ? "#121110" : "#DDD6C8", // Бархатный теплый обсидиан (не холодный синий)
        paper: isDark ? "#1C1A18" : "#EAE4D7", // Глубокий теплый графит для колонок
      },
      text: {
        primary: isDark ? "#F4F1EA" : "#29231E", // Мягкий кремово-белый (не слепит)
        secondary: isDark ? "#9E9890" : "#5C5248", // Теплый каменный серый
      },
      divider: isDark ? "rgba(244, 241, 234, 0.08)" : "rgba(41, 35, 30, 0.14)",
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: isDark
              ? "1px solid rgba(244, 241, 234, 0.08)" // Тонкая шелковая обводка
              : "1px solid rgba(41, 35, 30, 0.12)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "rgba(18, 17, 16, 0.85)" : "rgba(221, 214, 200, 0.9)",
            backdropFilter: "blur(12px)",
            borderBottom: isDark
              ? "1px solid rgba(244, 241, 234, 0.08)"
              : "1px solid rgba(41, 35, 30, 0.12)",
            boxShadow: "none",
            color: isDark ? "#F4F1EA" : "#29231E",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: isDark ? "rgba(12, 11, 10, 0.5)" : "rgba(255, 255, 255, 0.35)",
            transition: "all 0.2s ease",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "rgba(244, 241, 234, 0.12)" : "rgba(41, 35, 30, 0.2)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "rgba(224, 122, 95, 0.55)" : "rgba(194, 89, 52, 0.55)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "#E07A5F" : "#C25934",
              borderWidth: "1.5px",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDark ? "#8A847C" : "#6B5E52",
            transition: "color 0.2s ease",
            "&:hover": {
              color: isDark ? "#E07A5F" : "#C25934",
              backgroundColor: "transparent",
            },
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            color: isDark ? "#66615B" : "#786C5E",
            transition: "color 0.2s ease",
            "&:hover": {
              backgroundColor: "transparent",
              color: isDark ? "#E07A5F" : "#C25934",
            },
            "&.Mui-checked": {
              color: isDark ? "#81B29A" : "#2E7D5B",
              "&:hover": {
                backgroundColor: "transparent",
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
    },
  })
}
