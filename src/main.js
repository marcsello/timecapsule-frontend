import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import resize from "vue-element-resize-detector";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.prototype.$lastHeight = undefined;
Vue.prototype.$notifyHeightChange = function (height = undefined) {
    // source of idea: https://betterprogramming.pub/how-to-automatically-resize-an-iframe-7be6bfbb1214

    let h = height;
    if (h === undefined) {
        h = document.body.scrollHeight;
    }

    if (this.$lastHeight === h) {
        return;
    }

    this.$lastHeight = h;
    window.parent.postMessage({
        frameHeight: h
    }, '*');

    console.log(h);
};

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(resize);

Vue.config.productionTip = false;


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
