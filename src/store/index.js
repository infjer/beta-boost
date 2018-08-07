import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import state from './state';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        navigator: {
            strict: true,
            namespaced: true,
            state: {
                stack: [],
                options: {},
            },
            mutations: {
                push(state, page) {
                    state.stack.push(page);
                },
                pop(state) {
                    if (state.stack.length > 1) {
                        state.stack.pop();
                    }
                },
                replace(state, page) {
                    state.stack.pop();
                    state.stack.push(page);
                },
                reset(state, page) {
                    state.stack = [page || state.stack[0]];
                },
                options(state, newOptions = {}) {
                    state.options = newOptions;
                },
            },
        },
    }
})
