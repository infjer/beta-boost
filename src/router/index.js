import Vue from 'vue';
import Router from 'vue-router';
import Step1 from '@/components/Step1';
import Step2 from '@/components/Step2';
import Step3 from '@/components/Step3';
import Step4 from '@/components/Step4';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            redirect: '/robovisor_name',
        },
        {
            path: '/robovisor_name',
            name: 'Step1',
            component: Step1,
        },
        {
            path: '/robovisor/:id',
            name: 'Robovisor',
            component: Step2,
        },
        {
            path: '/portofolio/:id',
            name: 'Portofolio',
            component: Step3,
        },
        {
            path: '/result',
            name: 'Result',
            component: Step4,
        },
        {
            path: '*',
            redirect: '/robovisor_name',
        },
    ]
})
