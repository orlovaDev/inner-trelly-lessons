import { selectAppStatus, selectIsLoggedIn, setIsLoggedInAC } from "@/app/app-slice.ts"
import { baseApi } from "@/app/baseApi"
import { NavButton } from "@/common/components/NavButton/NavButton"
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/common/constants"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import { useLogoutMutation } from "@/features/auth/api/authApi"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Toolbar from "@mui/material/Toolbar"
import { Link } from "react-router"
import { Path } from "@/common/routing"
import { ThemeToggleButton } from "@/common/components/ThemeToggleButton/ThemeToggleButton.tsx"

export const Header = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const status = useAppSelector(selectAppStatus)

  const [logout] = useLogoutMutation()

  const dispatch = useAppDispatch()

  const logoutHandler = () => {
    logout()
      .then((res) => {
        if (!res.error) {
          dispatch(setIsLoggedInAC({ isLoggedIn: false }))
          localStorage.removeItem(AUTH_TOKEN)
          localStorage.removeItem(REFRESH_TOKEN)
        }
      })
      .then(() => {
        dispatch(baseApi.util.invalidateTags(["Todolist", "Task"]))
      })
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            <NavButton component={Link} to={Path.Main}>
              Main
            </NavButton>
            {isLoggedIn && <NavButton onClick={logoutHandler}>Log out</NavButton>}
            <NavButton component={Link} to={Path.Faq} >
              Faq
            </NavButton>
            <ThemeToggleButton />
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}



