const config = {
    useRealAPI: true, 
    useServerBackend: false,

    get fetchAddress() {
        return this.useServerBackend
            ? "https://healthcaredbbackendapi.azure-api.net" 
            : "http://localhost:5114";
    },

    get API_ENDPOINTS() {
        return this.useRealAPI ? {  
            login: `${this.fetchAddress}/api/auth/login`,
            register: `${this.fetchAddress}/api/auth/register`,
            getUser: `${this.fetchAddress}/api/user/profile`,
            updateUser: `${this.fetchAddress}/api/user/update`,
            messagesBase: `${this.fetchAddress}/api/messages`,
            send: `${this.fetchAddress}/api/messages/send`, 
            message_buttons: `${this.fetchAddress}/UserInfo/GetAll`, 
            prescriptions: `${this.fetchAddress}/api/prescriptions`, 

            updateUserInfo: `${this.fetchAddress}/UserInfo/GetById`,


        } : {  
            login: "/json/accounts.json",
            register: "/json/accounts.json",
            getUser: "/json/accounts.json",
            updateUser: "/json/accounts.json",
            messagesBase: "/json/messages.json", 
            send: "/json/messages.json",
            message_buttons: "/json/accounts.json",
            prescriptions: "/json/accounts.json",
            updateUserInfo: "/json/updateUserInfo.json",


        };
    }
};

export default config;
