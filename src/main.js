import Vue from 'vue'
import App from './App.vue'
import { initializeApp } from 'firebase/app'

import './assets/main.css'

const firebaseConfig = {
  apiKey: "AIzaSyBjvIdpw39OQhoKOKu_8t2jGY8rO_F8oxs",
  authDomain: "mindef-788d6.firebaseapp.com",
  projectId: "mindef-788d6",
  storageBucket: "mindef-788d6.appspot.com",
  messagingSenderId: "357320541821",
  appId: "1:357320541821:web:28180999ec6cda9a91d314"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

new Vue({
  render: (h) => h(App)
}).$mount('#app')
