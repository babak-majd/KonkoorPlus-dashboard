export default defineNuxtPlugin((nuxtApp) => {
    const token = useCookie('token', { maxAge: 60 * 60 * 24 * 7 , secure: true})

    function getToken() {
        return token.value
    }

    function setToken(data: string) {
        token.value = data
    }

    function logout() {
        token.value = null
    }

    function tokenIsSet() {
        return token.value !== null
    }

    return {
        provide: {
            token: {
                getToken,
                setToken,
                logout,
                tokenIsSet,
            }
        }
    }
})
