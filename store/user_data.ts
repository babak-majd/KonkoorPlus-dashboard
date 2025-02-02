import { defineStore } from "pinia";
import type User from "~/interfaces/User";

export const useUserData = defineStore({
  id: "userData",
  state: () => ({
    userData: null,
  }),
  actions: {
    setUserData(data: any) {
      let user_data = useCookie("user_data", { maxAge: 60 * 60 * 24 * 7 });
      if (typeof data !== "string") {
        data = JSON.stringify(data);
      }
      this.userData = data;
      user_data.value = data;
    },
    getUserData(): User {
      let user_data = useCookie("user_data");
      if (user_data.value === "string") {
        user_data.value = JSON.parse(user_data.value);
      }
      return user_data.value;
    },
    logout() {
      this.userData = null;
      let user_data = useCookie("user_data");
      user_data.value = null;
    },
  },
  getters: {
    isLogin: (state) => {
      let user_data = useCookie("user_data");
      return !!user_data.value;
    },
    fullname: (state) => {
      let user_data = useCookie("user_data");
      if (!!user_data.value) {
        return `${user_data.value.first_name} ${user_data.value.last_name}`;
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
