import { getNotes } from './notesTableActions'

export default {
    namespaced: true,
    state: {
        isLoading: false,
        notes: []
    },
    mutations: {
        setNotes(state, notes) {
            state.notes = notes
        },
        setLoading(state, value) {
            state.isLoading = value
        }
    },
    actions: {
        getNotes({ commit, state }, data) {
            state.isLoading = true;
            getNotes(data).then(response => {
                state.isLoading = false;
                commit('setLoading', false);
                commit('setNotes', response.data)
            }).catch(() => commit('setLoading', false))
        }
    }
}



