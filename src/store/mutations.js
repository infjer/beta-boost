import types from './mutation-types'

const mutations = {
    [types.SET_TASK_LIST](state, task_list) {
        state.task_list = task_list;
    },
};

export default mutations;
