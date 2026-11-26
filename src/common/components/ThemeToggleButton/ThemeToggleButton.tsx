import { changeThemeModeAC, selectThemeMode } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded"
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"

export const ThemeToggleButton = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  const isDark = themeMode === "dark"

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: isDark ? "light" : "dark" }))
  }

  return (
    <Tooltip title={isDark ? "Включить светлую тему" : "Включить темную тему"}>
      <IconButton
        onClick={changeMode}
        disableRipple
        sx={{
          width: "38px",
          height: "38px",
          borderRadius: "10px",
          marginLeft: "6px",
          color: isDark ? "#F29B83" : "#C25934", // Теплое медное солнце в темной теме / терракотовая луна в светлой
          background: isDark ? "rgba(224, 122, 95, 0.14)" : "rgba(194, 89, 52, 0.14)",
          border: isDark
            ? "1px solid rgba(224, 122, 95, 0.35)"
            : "1px solid rgba(194, 89, 52, 0.32)",
          transition: "all 0.25s ease",
          "&:hover": {
            background: isDark ? "rgba(224, 122, 95, 0.32)" : "rgba(194, 89, 52, 0.24)",
            borderColor: isDark ? "#F29B83" : "#C25934",
            color: isDark ? "#FFFFFF" : "#431407",
            transform: "translateY(-1px) rotate(12deg)",
          },
        }}
      >
        {isDark ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  )
}
