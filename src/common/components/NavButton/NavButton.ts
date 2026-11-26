import { styled } from "@mui/material/styles"
import Button, { ButtonProps } from "@mui/material/Button"
import { ElementType, ReactElement } from "react"

type Props = {
  background?: string
}

type NavButtonComponent = <C extends ElementType = "button">(
  props: ButtonProps<C, { component?: C } & Props>
) => ReactElement | null

export const NavButton = styled(Button)<Props>(({ background, theme }) => {
  const isDark = theme.palette.mode === "dark"

  return {
    minWidth: "96px",
    fontWeight: 600,
    borderRadius: "10px",
    textTransform: "none",
    margin: "0 6px",
    padding: "6px 18px",
    color: isDark ? "#F8D8CF" : "#7C2D12",
    background: isDark
      ? background
        ? "rgba(224, 122, 95, 0.28)"
        : "rgba(224, 122, 95, 0.14)"
      : background
        ? "rgba(194, 89, 52, 0.24)"
        : "rgba(194, 89, 52, 0.14)",
    border: isDark
      ? background
        ? "1px solid rgba(242, 155, 131, 0.55)"
        : "1px solid rgba(224, 122, 95, 0.35)"
      : background
        ? "1px solid rgba(194, 89, 52, 0.55)"
        : "1px solid rgba(194, 89, 52, 0.32)",
    transition: "all 0.2s ease",
    "&:hover": {
      background: isDark ? "rgba(224, 122, 95, 0.36)" : "rgba(194, 89, 52, 0.28)",
      borderColor: isDark ? "#F29B83" : "#C25934",
      color: isDark ? "#FFFFFF" : "#431407",
      transform: "translateY(-1px)",
    },
  }
}) as NavButtonComponent
