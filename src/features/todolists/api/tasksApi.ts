import { baseApi } from "@/app/baseApi"
import { instance } from "@/common/instance"
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
      invalidatesTags: (_result, _error, {todolistId}) => {
        return [{type: "Task", id: todolistId}]
      },
    }),
  }),
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi

export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance
      .get<GetTasksResponse>(`/boards/${todolistId}/tasks`, { params: { pageSize: 20 } })
      .then((res) => res.data.data.map((task) => toDomainTask(task, todolistId)))
  },
  createTask(payload: { todolistId: string; title: string }) {
    const { todolistId, title } = payload
    return instance
      .post<BaseResponse<ApiResource<TaskAttributes>>>(`/boards/${todolistId}/tasks`, {
        data: { type: "tasks", attributes: { title } },
      })
      .then((res) => toDomainTask(res.data.data, todolistId))
  },
  updateTask(payload: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
    const { todolistId, taskId, model } = payload
    return instance
      .patch<BaseResponse<ApiResource<TaskAttributes>>>(`/boards/${todolistId}/tasks/${taskId}`, {
        data: { type: "tasks", attributes: model },
      })
      .then((res) => toDomainTask(res.data.data, todolistId))
  },
  deleteTask(payload: { todolistId: string; taskId: string }) {
    const { todolistId, taskId } = payload
    return instance.delete(`/boards/${todolistId}/tasks/${taskId}`)
  },
}
