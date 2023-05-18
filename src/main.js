import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import { library } from '@fortawesome/fontawesome-svg-core'

import { faAdd, faTrash, faPhone, faAddressBook } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAdd, faTrash, faPhone, faAddressBook)

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const app = createApp(App)

app.use(createPinia())
var ax = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: { 'Access-Control-Allow-Origin': '*' }
  });

app.use(VueAxios, ax)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'

const toastOptions = {
    // You can set your default options here
};

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(Toast, toastOptions);

app.mount('#app')
