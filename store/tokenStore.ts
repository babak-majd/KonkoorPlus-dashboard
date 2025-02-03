import { defineStore } from 'pinia'

export const useToken = defineStore({
  id: 'token_store',
  state: () => ({}),
  actions: {
    setToken(token: string): void {
      let cookie = useCookie('token', { secure: true, maxAge: 60 * 60 * 24 * 7 })
      cookie.value = token
    },
    getToken(): string | null | undefined {
      let cookie = useCookie('token')

      return cookie.value
    },
    logout() {
      let cookie = useCookie('token')

      cookie.value = null
    }
  },
  getters: {
    tokenIsSet: (state) => {
      let cookie = useCookie('token')

      return !!cookie.value
    }
  }
})
