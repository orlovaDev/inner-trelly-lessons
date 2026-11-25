// import { AUTH_TOKEN } from "@/common/constants"
// import { handleError } from "@/common/utils"
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
//
// export const baseApi = createApi({
//   reducerPath: "todolistsApi",
//   tagTypes: ["Todolist", "Task"],
//   baseQuery: async (args, api, extraOptions) => {
//     const result = await fetchBaseQuery({
//       baseUrl: import.meta.env.VITE_BASE_URL,
//       headers: {
//         'api-key': import.meta.env.VITE_API_KEY,
//       },
//       prepareHeaders: (headers) => {
//         const token = localStorage.getItem(AUTH_TOKEN)
//         if (token) {
//           headers.set("Authorization", `Bearer ${token}`)
//         }
//       },
//     })(args, api, extraOptions)
//     handleError(api, result)
//
//     return result
//   },
//   endpoints: () => ({}),
// })


import { setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN, REFRESH_TOKEN } from "@/common/constants"
import { handleError } from "@/common/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  headers: { "api-key": import.meta.env.VITE_API_KEY },
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(AUTH_TOKEN)
    if (token) headers.set("Authorization", `Bearer ${token}`)
  },
})

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error?.status === 401) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN)

      if (refreshToken) {
        const refreshRes = await baseQuery(
          {
            url: "auth/simple/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        )

        const data = refreshRes.data as
          | { accessToken: string; refreshToken: string }
          | undefined

        if (data) {
          localStorage.setItem(AUTH_TOKEN, data.accessToken)
          localStorage.setItem(REFRESH_TOKEN, data.refreshToken)
          result = await baseQuery(args, api, extraOptions)
        } else {
          localStorage.removeItem(AUTH_TOKEN)
          localStorage.removeItem(REFRESH_TOKEN)
          api.dispatch(setIsLoggedInAC({ isLoggedIn: false }))
        }
      }
    }

    handleError(api, result)
    return result
  },
  endpoints: () => ({}),
})






