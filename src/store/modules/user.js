export default {
    state: {
        user: null,
        selectedCompany: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        removeUser(state) {
            state.user = null;
        },
        updateUser(state, data) {
            state.user = {
                ...state.user,
                ...data
            }
        },
        
        setCompany(state,data){
            state.selectedCompany = data;
        },
    }
}