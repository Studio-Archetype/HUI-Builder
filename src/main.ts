// framework
import { createApp } from 'vue';

// third-party
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// components
import App from './App.vue';

// lib
import router from './router';

// styles
import './index.scss';

config.autoReplaceSvg = 'nest';

const minecraftiaFont = new FontFace(
  'Minecraftia',
  'url(/Minecraftia-Regular.ttf)'
);

minecraftiaFont.load().then((font) => {
  document.fonts.add(font);
});

const app = createApp(App);

library.add(fas, fab);

app.component('font-awesome-icon', FontAwesomeIcon);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);

app.mount('#app');
