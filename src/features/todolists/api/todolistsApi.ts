import { baseApi } from "@/app/baseApi"
import type { ApiResource, BaseResponse } from "@/common/types"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import type { TodolistAttributes } from "./todolistsApi.types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "boards/my",
      transformResponse: (res: BaseResponse<ApiResource<TodolistAttributes>[]>): DomainTodolist[] =>
        res.data.map(({ id, attributes }) => ({ id, ...attributes, filter: "all" })),
      providesTags: ["Todolist"],
    }),
    addTodolist: build.mutation<BaseResponse<ApiResource<TodolistAttributes>>, string>({
      query: (title) => ({
        url: "boards",
        method: "POST",
        body: { data: { type: "boards", attributes: { title } } },
      }),
      invalidatesTags: ["Todolist"],
    }),
    removeTodolist: build.mutation<void, string>({
      query: (id) => ({ url: `boards/${id}`, method: "DELETE", }),
      onQueryStarted: async (id, {dispatch, queryFulfilled}) => {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
            const index = state.findIndex((todolist) => todolist.id === id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          }),
        )
        try {
          await queryFulfilled
        } catch (e) {
          patchResult.undo()
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    updateTodolistTitle: build.mutation<void, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `boards/${id}`,
        method: "PATCH",
        body: { data: { type: "boards", attributes: { title } } },
      }),
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useRemoveTodolistMutation,
  useUpdateTodolistTitleMutation,
} = todolistsApi


