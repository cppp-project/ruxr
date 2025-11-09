<template>
  <header>
    <div class="container header-content">
      <a class="logo" :href="baseUrl">
        <img
          src="../assets/logo.svg"
          alt="Rubisco"
          width="40"
          height="40"
          class="icon"
        />
        <span class="ruxr-title">Rubisco Extension Repository</span>
      </a>
      <div class="search-bar">
        <i class="nf nf-oct-search" @click="handleSearch"></i>
        <input
          type="text"
          placeholder="Search packages..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
      </div>
      <nav class="nav">
        <SelectBox title="Theme" :options="themeOptions" />
        <RouterLink to="/"><i class="nf nf-cod-home"></i> Home</RouterLink>
        <a href="https://github.com/cppp-project/ruxr"
          ><i class="nf nf-dev-github"></i> GitHub</a
        >
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {
  THEME_VALUES,
  getSavedTheme,
  setTheme,
  type ThemeName,
} from "@/lib/theme";

import SelectBox from "./SelectBox.vue";

interface Option {
  label: string;
  callback: () => void;
}

@Options({
  name: "AppHeader",
  components: {
    SelectBox,
  },
})
class AppHeader extends Vue {
  searchQuery: string = "";
  baseUrl: string = process.env.BASE_URL;
  currentTheme: ThemeName = "Blue";

  themeOptions: Option[] = THEME_VALUES.map((v) => ({
    label: v,
    callback: () => setTheme(v),
  }));

  handleSearch(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.$router.push({
        path: "/extensions",
        query: { query: query },
      });
    } else {
      this.$router.push("/extensions");
    }
  }

  mounted() {
    // Initialize header's theme state from saved or from html attribute.
    this.currentTheme = getSavedTheme();
  }

  onThemeChange(): void {
    setTheme(this.currentTheme as ThemeName);
  }
}

export default AppHeader;
</script>

<style scoped>
@import url("https://www.nerdfonts.com/assets/css/webfont.css");

header {
  background-color: var(--primary);
  color: var(--greet-title);
  padding: 15px 0;
  box-shadow: 0 2px 10px var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  max-width: 100%;
  transition: 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  transition: 0.3ms ease;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
  text-decoration: none;
  color: var(--greet-title);
}

.logo i {
  font-size: 2rem;
}

.search-bar {
  flex: 1;
  max-width: 600px;
  min-width: 200px;
  margin: 0 20px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  font-size: 1rem;
  padding-left: 40px;
  box-sizing: border-box;
}

.search-bar i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--hint);
  cursor: pointer;
  transition: color 0.2s ease;
}

.search-bar i:hover {
  color: var(--secondary-hover);
}

.nav {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 20px;
}

.nav a {
  color: var(--greet-title);
  text-decoration: none;
  white-space: nowrap;
  font-size: 1rem;
}

.nav :deep(.floating-select__button) {
  font-weight: 500;
  color: var(--greet-title);
}

.ruxr-title {
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: -1;
  position: relative;
}

@media (max-width: 968px) {
  .main-content {
    flex-direction: column;
  }

  .ruxr-title {
    transform: translateX(-50%);
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  .sidebar {
    flex: 1;
  }

  .header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    position: relative;
    flex-wrap: wrap;
  }

  .search-bar {
    margin: 0 10px;
    max-width: 100%;
    min-width: 0;
    width: auto;
    transition: all 0.3s ease;
  }

  .search-bar:focus-within {
    position: absolute;
    left: 10px;
    right: 10px;
    width: calc(100% - 20px);
    max-width: calc(100% - 20px);
    margin: 0;
    z-index: 10;
  }

  .search-bar:focus-within ~ .nav {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
