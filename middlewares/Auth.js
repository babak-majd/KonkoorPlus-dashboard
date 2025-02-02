import { useToken } from "~/store/tokenStore";

export default defineNuxtRouteMiddleware((to, from) => {
    // Exclude routes under /auth/*
    if (to.path.startsWith('/auth')) {
        return true;
    }
    const token = useToken()

    if (!token.tokenIsSet) {
        return navigateTo('/auth/login')
    }
    return true
});
