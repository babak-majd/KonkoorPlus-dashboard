import { defineStore } from 'pinia'
import type User from '~/interfaces/User'

export const useUserData = defineStore({
  id: 'userData',
  state: () => ({
    userData: useCookie('user_data', { maxAge: 60 * 60 * 24 * 7 })
  }),
  actions: {
    setUserData(data: any) {
      if (typeof data !== "string") {
        data = JSON.stringify(data)
      }
      this.userData = data
    },
    getUserData(): User {
      if (typeof this.userData === "string") {
        return JSON.parse(this.userData)
      }
      return this.userData
    },
    logout() {
      this.userData = null
    }
  },
  getters: {
    isLogin: (state) => { return !!state.userData },
    fullname: (state) => {
      if (!!state.userData) {
        let obj = JSON.parse(state.userData)
        return `${obj.first_name} ${obj.last_name}`
      }
      return null
    }
  }
})
