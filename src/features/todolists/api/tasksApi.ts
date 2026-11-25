import { baseApi } from "@/app/baseApi"
import type { ApiResource, BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, TaskAttributes, TasksData, UpdateTaskModel } from "./tasksApi.types"
import { PAGE_SIZE } from "@/common/constants"

export const toDomainTask = ({ id, attributes }: ApiResource<TaskAttributes>, todolistId: string): DomainTask => ({
  id,
  ...attributes,
  todolistId,
})

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<TasksData, { todolistId: string; params: { page: number} }>({
      query: ({ todolistId, params }) => ({
        url: `boards/${todolistId}/tasks`,
        params: { pageNumber: params.page, pageSize: PAGE_SIZE },
      }),
      transformResponse: (result: GetTasksResponse, _meta, { todolistId }): TasksData => ({
        items: result.data.map((task) => toDomainTask(task, todolistId)),
        totalCount: result.meta.totalCount,
      }),
      providesTags: (_result, _error, {todolistId}) => {
        return [{type: "Task", id: todolistId}]
      },
      // providesTags: (result, _error, todolistId) =>
      //   result
      //     ? [
      //       ...result.items.map((task) => ({ type: "Task", id: task.id}) as const),
      //       { type: "Task", id: todolistId },
      //     ]
      //     : ["Task"],
    }),
    addTask: build.mutation<BaseResponse<ApiResource<TaskAttributes>>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `boards/${todolistId}/tasks`,
        method: "POST",
        body: { data: { type: "tasks", attributes: { title } } },
      }),
      invalidatesTags: (_result, _error, {todolistId}) => {
        return [{type: "Task", id: todolistId}]
      },
    }),
    removeTask: build.mutation<void, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `boards/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { todolistId }) => {
        return [{type: "Task", id: todolistId}]
      },
    }),
    updateTask: build.mutation<
      BaseResponse<ApiResource<TaskAttributes>>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `boards/${todolistId}/tasks/${taskId}`,
        method: "PATCH",
        body: { data: { type: "tasks", attributes: model } },
      }),
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

        let patchResults: any[] = []
        cachedArgsForQuery.forEach(({ params }) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData("getTasks", { todolistId, params: { page: params.page } },
                (state) => {
                  const index = state.items.findIndex((task) => task.id === taskId)
                  if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...model }
                  }
                },
              ),
            ),
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patchResult) => {
            patchResult.undo()
          })
        }
      },
      invalidatesTags: (_result, _error, {todolistId}) => {
        return [{type: "Task", id: todolistId}]
      },
    }),
  }),
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi

