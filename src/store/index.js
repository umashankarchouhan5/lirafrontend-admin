import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import menu from "./modules/menu";
import common from "./modules/common";
import socket from "./modules/socket";
import notesTable from "Components/notesTable/store";
import ticket from "Pages/user/ticket/store/index";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        user,
        menu,
        common,
        notesTable,
        ticket,
        socket
    }
});
