import { selectThemeMode } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { DomainTodolist, FilterValues } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const themeMode = useAppSelector(selectThemeMode)
  const isDark = themeMode === "dark"

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === id)
        if (todolist) {
          todolist.filter = filter
        }
      }),
    )
  }

  // В темной теме — теплый золотисто-песочный, в светлой — приглушенный сливово-винный (четко отличается от терракоты Active)
  const allColor = isDark ? "#E9C46A" : "#7E3A5D"
  const allBorder = isDark ? "rgba(233, 196, 106, 0.5)" : "rgba(126, 58, 93, 0.45)"
  const allBg = isDark ? "rgba(233, 196, 106, 0.12)" : "rgba(126, 58, 93, 0.1)"
  const allHoverBg = isDark ? "rgba(233, 196, 106, 0.18)" : "rgba(126, 58, 93, 0.16)"

  return (
    <Box sx={containerSx}>
      <Button
        variant={filter === "all" ? "outlined" : "text"}
        onClick={() => changeFilter("all")}
        sx={{
          color: allColor,
          borderColor: filter === "all" ? allBorder : "transparent",
          backgroundColor: filter === "all" ? allBg : "transparent",
          "&:hover": {
            borderColor: allColor,
            backgroundColor: allHoverBg,
          },
        }}
      >
        All
      </Button>
      <Button
        variant={filter === "active" ? "outlined" : "text"}
        color={"primary"}
        onClick={() => changeFilter("active")}
        sx={{
          backgroundColor:
            filter === "active"
              ? isDark
                ? "rgba(224, 122, 95, 0.14)"
                : "rgba(194, 89, 52, 0.12)"
              : "transparent",
        }}
      >
        Active
      </Button>
      <Button
        variant={filter === "completed" ? "outlined" : "text"}
        color={"secondary"}
        onClick={() => changeFilter("completed")}
        sx={{
          backgroundColor:
            filter === "completed"
              ? isDark
                ? "rgba(129, 178, 154, 0.14)"
                : "rgba(46, 125, 91, 0.12)"
              : "transparent",
        }}
      >
        Completed
      </Button>
    </Box>
  )
}
