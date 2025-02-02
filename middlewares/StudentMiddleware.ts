export default defineNuxtRouteMiddleware((to, from) => {
    const userData = useUserData()

    let role = userData.getUserData().role

    if (role !== "student") {
        return navigateTo('/advisor')
    }
    return role === "student"
})
