import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import FormSchema from 'vue-json-schema';
import { Option } from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import './css/reset.less';

FormSchema.setComponent('form', 'el-form', ({ vm }) => {
    // vm is the FormSchema VM
    const labelWidth = '120px';
    const model = vm.data;
    const rules = {};
    vm.fields.forEach(field => {
        const type = field.schemaType === 'array' && field.type === 'radio'? 'string' : field.schemaType;
        const required = field.required;
        const message = field.title;
        const trigger = ['radio', 'checkbox', 'select'].includes(field.type) ? 'change' : 'blur';
        // http://element.eleme.io/#/en-US/component/form#validation
        rules[field.name] = { type, required, message, trigger };
    })
    // returning the form props
    return { labelWidth, rules, model };
})
// http://element.eleme.io/#/en-US/component/form#validation
FormSchema.setComponent('label', 'el-form-item', ({ field }) => ({
    prop: field.name
}));
FormSchema.setComponent('email', 'el-input');
FormSchema.setComponent('text', 'el-input');
FormSchema.setComponent('textarea', 'el-input');
FormSchema.setComponent('checkbox', 'el-checkbox');
FormSchema.setComponent('switch', 'el-switch');
FormSchema.setComponent('radio', 'el-radio');
FormSchema.setComponent('select', 'el-select');
// You can also use the component object
FormSchema.setComponent('option', Option);
// By default `<h1/>` is used to render the form title.
// To override this, use the `title` type:
FormSchema.setComponent('title', 'h2');
// By default `<p/>` is used to render the form title.
// To override this, use the `description` type:
FormSchema.setComponent('description', 'small');
// By default `<div/>` is used to render the message error.
// To override this, use the `error` type:
FormSchema.setComponent('error', 'el-alert', ({ vm }) => ({
    type: 'error',
    title: vm.error
}));

// require('./mock')

Vue.component('form-schema', FormSchema);

Vue.use(ElementUI);
Vue.use(FormSchema);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})
