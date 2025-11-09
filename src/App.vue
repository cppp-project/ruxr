<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";

@Options({
  components: {
    AppHeader,
    AppFooter,
  },
})
export class App extends Vue {}

export default App;
</script>

<style>
@import url("https://www.nerdfonts.com/assets/css/webfont.css");

:root {
  --font-family: "Noto Sans SC", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  --monospace-font-family: "MesloLGL Nerd Font", "MesloLGL NF", "Fira Code",
    Consolas, "Courier New", monospace;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: 0.3s ease;
}

:root {
  --window-background: #f9f9f9;
  --primary: #cb3837;
  --primary-stress: #b32d2a;
  --primary-background: #f2e1e1;
  --secondary: #ddd;
  --secondary-hover: #555;
  --hint: #666;
  --dark: #333;
  --light: #fff;
  --light-background: #f0f0f0;
  --secondary-light: #f8f9fa;
  --secondary-light-hover: #e9ecef;
  --border: #eaeaea;
  --border-hover: #d0d0d0;
  --shadow: rgba(0, 0, 0, 0.1);
  --shadow-hover: rgba(0, 0, 0, 0.12);
  --success: #28a745;
  --success-background: #d4edda;
  --error: #dc3545;
  --error-background: #f8d7da;
  --greet-message: #2c3e50;
  --secondary-greeting: #5a6a7a;
}

body {
  background-color: var(--window-background);
  color: var(--dark);
  line-height: 1.6;
}

button {
  font-family: inherit;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
