import type User from "~/interfaces/User"

export default defineNuxtPlugin((nuxtApp) => {
    const userData = useCookie('user_data', { maxAge: 60 * 60 * 24 * 7 }) // This cookie is available for almost One week

    function setUserData(data: any): void {
        if (typeof data !== "string") {
            data = JSON.stringify(data)
        }
        userData.value = data
    }

    function getUserData(): User {
        if (typeof userData.value === "string")
            return JSON.parse(userData.value)
        return userData.value
    }

    function logout() {
        userData.value = null
    }

    function isLogin() {
        return !!userData.value
    }

    function fullname() {
        if (isLogin()) {
            return `${getUserData().first_name} ${getUserData().last_name}`
        }
        return null
    }

    return {
        provide: {
            userData: {
                setUserData,
                getUserData,
                logout,
                isLogin,
                fullname,
            }
        }
    }
})
