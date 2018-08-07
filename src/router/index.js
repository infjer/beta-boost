import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import Create from '@/components/Create';
import Strategy from '@/components/Strategy';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index,
        },
        {
            path: '/create',
            name: 'Create',
            component: Create,
        },
        {
            path: '/strategy',
            name: 'Strategy',
            component: Strategy,
        },
    ]
})
