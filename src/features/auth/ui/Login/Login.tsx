import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/common/constants"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { useLoginMutation } from "@/features/auth/api/authApi"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  const themeMode = useAppSelector(selectThemeMode)

  const [login] = useLoginMutation()

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "anastasiya.orlova1305@gmail.com", password: "", rememberMe: false },
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    login(data).then((res) => {
      if (res.data) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        localStorage.setItem(AUTH_TOKEN, res.data.accessToken)
        localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken)
        reset()
      }
    })
  }

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login use the login and password of Basic authentication from
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://apihub.it-incubator.io"
                target="_blank"
                rel="noreferrer"
              >
                APIHub
              </a>
            </p>
            <p>(Trelly API → settings)</p>
          </FormLabel>
          <FormGroup>
            <TextField label="Login" margin="normal" error={!!errors.login} {...register("login")} />
            {errors.login && <span className={styles.errorMessage}>{errors.login.message}</span>}
            <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              margin="normal"
              error={!!errors.password}
              {...register("password")}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                />
              }
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
