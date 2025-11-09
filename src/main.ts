import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import './assets/themes.css'
import { initTheme } from './lib/theme'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)  // TODO: Language selector and i18n.
app.mount("#app");

// Initialize theme after mount to ensure documentElement is ready, but as early as possible.
initTheme("Red");
