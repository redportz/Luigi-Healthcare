const config = {
    useRealAPI: true, 
    useServerBackend: false,

    get fetchAddress() {
        return this.useServerBackend
            ? "http://localhost:5115"
            : "https://healthcaredbbackendapi.azure-api.net";
    },

    get API_ENDPOINTS() {
        return {
            login: `${this.fetchAddress}/api/auth/login`,
            register: `${this.fetchAddress}/api/auth/register`,
            getUser: `${this.fetchAddress}/api/user/profile`,
            updateUser: `${this.fetchAddress}/api/user/update`,
        };
    },
};

export default config;
