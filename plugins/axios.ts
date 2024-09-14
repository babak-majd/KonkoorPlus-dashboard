import axios from "axios"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        const token = useNuxtApp().$token
        let bearerToken = null

        if (token.tokenIsSet()) {
            bearerToken = `Bearer ${token.getToken()}`
        }

        const instance = axios.create({
            baseURL: useRuntimeConfig().public.API_URL,
            headers: {
                Authorization: bearerToken,
                Accept: 'application/json',
                "Content-Type": "application/json"
            }
        })

        nuxtApp.provide('axios', instance)
    })
})
