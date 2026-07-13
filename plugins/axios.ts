import axios from "axios"

export default defineNuxtPlugin((nuxtApp) => {
    const instance = axios.create({
        baseURL: useRuntimeConfig().public.API_URL,
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        }
    })

    // Read the token cookie on every request so a login/logout in the same
    // session is picked up immediately (the old code froze it at app start).
    instance.interceptors.request.use((config) => {
        const token = useCookie('token').value
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Token ${token}`
        }
        return config
    })

    return {
        provide: {
            axios: instance
        }
    }
})
