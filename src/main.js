import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './css/reset.less';
import VueFormGenerator from "vue-form-generator";
import VueOnsen from 'vue-onsenui';
import MintUI from 'mint-ui';
import CustomToolbar from './components/CustomToolbar';

// require('./mock')


import 'mint-ui/lib/style.css'
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

Vue.component('custom-toolbar', CustomToolbar);

Vue.use(MintUI);
Vue.use(VueOnsen);
Vue.use(VueFormGenerator);
Vue.use(ElementUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})
