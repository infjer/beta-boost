import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import state from './state';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
})
