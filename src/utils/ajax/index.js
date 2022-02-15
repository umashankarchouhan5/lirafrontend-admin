const axios = require("axios").default;

class Ajax {
    constructor(lib) {
        this.lib = lib;
        this.baseUrl = null;
        this.token = "Lira";
        this.onRequestStart = null;
        this.onRequestDone = null;
        this.onRequestFail = null;
        this.newToken = localStorage.userData !== undefined ? JSON.parse(localStorage.getItem('userData')).token : "Lira";
    }

    setToken(token) {
        this.token = token;
    }

    removeToken() {
        this.token = "Lira";
    }

    setBaseUrl(url) {
        this.baseUrl = url;
    }

    post(url, data, additionalHeaders, config) {
        return new Promise((resolve, reject) => {
            this.handleStart();

            if (!url) {
                reject();
                return;
            }

            this.lib
                .post(`${this.baseUrl}/${url}`, data, {
                    headers: {
                        Authorization:  `Bearer ${this.token}`,
                        // Authorization:  this.token,
                        ...additionalHeaders
                    },
                    ...config
                })
                .then(response => this.handleSuccess(response, resolve, reject))
                .catch(error => this.handleError(error, reject));
        });
    }

    get(url, additionalHeaders) {
        return new Promise((resolve, reject) => {
            this.handleStart();

            if (!url) {
                reject();
                return;
            }

            this.lib
                .get(`${this.baseUrl}/${url}`, {
                    headers: {
                        Authorization:  `Bearer ${this.token}`,
                        // Authorization:  this.token,
                        ...additionalHeaders
                    }
                })
                .then(response => this.handleSuccess(response, resolve, reject))
                .catch(error => this.handleError(error, reject));
        });
    }

    handleStart() {
        this.onRequestStart && this.onRequestStart();
    }

    handleSuccess(response, resolve, reject) {
        const { status } = response.data.response;
        if (!status) {
            this.handleError(response.data.response, reject)
        } else {
            this.onRequestDone && this.onRequestDone();
            resolve(response.data.response);
        }

    }

    handleError(error, reject) {
        this.onRequestFail && this.onRequestFail(error);
        reject(error);
    }

    setRequestStart(callback) {
        this.onRequestStart = callback;
    }

    setRequestDone(callback) {
        this.onRequestDone = callback;
    }

    setRequestFail(callback) {
        this.onRequestFail = callback;
    }
}

export default new Ajax(axios);
