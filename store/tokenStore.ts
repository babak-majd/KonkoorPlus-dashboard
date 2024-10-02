import { defineStore } from 'pinia'

export const useToken = defineStore({
  id: 'token_store',
  state: () => ({
    token: useCookie('token', { maxAge: 60 * 60 * 24 * 7, secure: true })
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    getToken() {
      return this.token
    },
    logout() {
      this.token = null
    }
  },
  getters: {
    tokenIsSet: (state) => { return !!state.token }
  }
})
