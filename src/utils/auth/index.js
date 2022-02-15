import store from '../../store'

class Auth {
    constructor() {
        this.isLogged = false;
        this.user = null;
    }
    isUserLogged() {
        return this.isLogged;
    }
    logUser(data) {
        localStorage.setItem('userData', JSON.stringify(data));
        this.user = data;
        store.commit('setUser', data);
        this.isLogged = true;
    }
    checkUser() {
        const data = localStorage.getItem('userData');
        if (data) {
            this.logUser(JSON.parse(data))
        }
    }
    getUserToken() {
        if (this.isLogged) {
            // return JSON.parse(localStorage.getItem('userData')).token;
            return this.user.token;
        }
    }
    logoutUser() {
        localStorage.removeItem('userData');
        store.commit('removeUser');
        this.user = null;
        this.isLogged = false;
    }
}

export default new Auth();
