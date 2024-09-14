import type User from "~/interfaces/User"

export default defineNuxtPlugin((nuxtApp) => {
    const userData = useCookie('user-data', { maxAge: 60 * 60 * 24 * 7 }) // This cookie is available for almost One week

    function setUserData(data: any): void {
        userData.value = data
    }

    function getUserData(): User {
        return userData.value
    }

    function logout() {
        userData.value = null
    }

    function isLogin() {
        return userData.value !== null
    }

    return {
        provide: {
            userData: {
                setUserData,
                getUserData,
                logout,
                isLogin,
            }
        }
    }
})
