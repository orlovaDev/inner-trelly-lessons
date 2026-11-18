import { styled } from "@mui/material/styles"
import Button, { ButtonProps } from '@mui/material/Button'
import { ElementType, ReactElement } from "react"

type Props = {
  background?: string
}

// Объявляем полиморфный тип для компонента
type NavButtonComponent = <C extends ElementType = 'button'>(
  props: ButtonProps<C, { component?: C } & Props>
) => ReactElement | null

export const NavButton = styled(Button)<Props>(({ background, theme }) => ({
  minWidth: "110px",
  fontWeight: "bold",
  boxShadow: `0 0 0 2px ${theme.palette.primary.dark}, 4px 4px 0 0 ${theme.palette.primary.dark}`,
  borderRadius: "2px",
  textTransform: "capitalize",
  margin: "0 10px",
  padding: "8px 24px",
  color: theme.palette.primary.contrastText,
  background: background || theme.palette.primary.light,
})) as NavButtonComponent



