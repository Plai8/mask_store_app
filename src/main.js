import './assets/main.css'
import 'leaflet/dist/leaflet.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faAngleUp  } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faMagnifyingGlass);
library.add(faLocationDot);
library.add(faChevronDown);
library.add(faAngleUp);


const pinia = createPinia();
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(pinia);
app.mount('#app');


