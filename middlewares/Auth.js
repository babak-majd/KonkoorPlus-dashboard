// middleware/auth.js
import StoreConfig from "../store/ConfigStore";

export default defineNuxtRouteMiddleware((to, from) => {
    // Exclude routes under /auth/*
    if (to.path.startsWith('/auth')) {
        return true;
    }

    const token = StoreConfig.token();

    // Check if the token is available and valid
    if (!token || token.length <= 20) {
        StoreConfig.logout();
        return navigateTo('/auth/login');
    }

    return true;
});
