import { defineStore } from "pinia";
import type User from "~/interfaces/User";

export const useUserData = defineStore({
  id: "userData",
  state: () => ({
    userData: useCookie("user_data", { maxAge: 60 * 60 * 24 * 7 }),
  }),
  actions: {
    setUserData(data: any) {
      if (typeof data !== "string") {
        data = JSON.stringify(data);
      }
      this.userData = data;
    },
    getUserData(): User {
      let result = this.userData;
      if (result === "string") {
        result = JSON.parse(result);
      }
      return result;
    },
    logout() {
      this.userData = null;
    },
  },
  getters: {
    isLogin: (state) => {
      return !!state.userData;
    },
    fullname: (state) => {
      if (!!state.userData) {
        return `${state.userData.first_name} ${state.userData.last_name}`;
      }
      return null;
    },
    grade: (state) => {
      if (!!state.userData) {
        return state.userData.grade;
      }
      return null;
    },
    field: (state) => {
      if (!!state.userData) {
        return state.userData.field.name;
      }
      return null;
    },
  },
});
