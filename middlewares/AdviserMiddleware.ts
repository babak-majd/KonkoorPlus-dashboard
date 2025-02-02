export default defineNuxtRouteMiddleware((to, from) => {
    const userData = useUserData()

    let role = userData.getUserData().role

    if (role !== "advisor") {
        return navigateTo('/')
    }

    return role === "advisor"
})
