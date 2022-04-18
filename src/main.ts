import { createApp } from "vue";
import { createPinia } from "pinia";
import "./index.scss";

import { library, config } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

config.autoReplaceSvg = "nest";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

library.add(fas, fab);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount("#app");
