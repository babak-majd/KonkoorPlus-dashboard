import type User from "~~/interfaces/User";
import Request from "~~/Api/Request";

export default class ConfigStore {
  static init(data: any): boolean {
    const promises = [];
    promises.push(ConfigStore.set_token(data.token));

    // const parsedUser: User =
    //   typeof data.user === "string" ? JSON.parse(data.user) : data.user;
    // const userStore = useUserStore();
    // userStore.updateUserData(parsedUser);

    // Wait for all promises to resolve
    Promise.all(promises)
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error("Error initializing ConfigStore:", error);
        return false;
      });
    return true;
  }

  static reload(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {} catch (error) {
        console.error("Error reloading store:", error);
        reject(error); // Reject the promise if there's an error
      }
    });
  }

  public static set_token(token: any) {
    useCookie("token").value = token;
  }

  public static token(): String {
    return String(useCookie("token").value);
  }

  public static logout() {
    this.set_token(null);
  }
}
