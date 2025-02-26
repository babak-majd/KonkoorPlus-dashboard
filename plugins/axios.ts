import axios from "axios"

export default defineNuxtPlugin((nuxtApp) => {
    const token = useToken()
    let bearerToken = null

    if (token.tokenIsSet) {
        bearerToken = `Token ${token.getToken()}`
    }

    const instance = axios.create({
        baseURL: useRuntimeConfig().public.API_URL,
        headers: {
            Authorization: bearerToken,
            Accept: 'application/json',
            "Content-Type": "application/json"
        }
    })

    return {
        provide: {
            axios: instance
        }
    }
})
