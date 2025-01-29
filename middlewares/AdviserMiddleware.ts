export default defineNuxtRouteMiddleware((to, from) => {
    const userData = useUserData()

    return userData.getUserData().role === "advisor"
})
