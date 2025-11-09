<template>
  <div class="main-page">
    <section class="hero">
      <img
        src="../assets/logo.svg"
        alt="Rubisco"
        width="100"
        height="100"
        class="hero-logo"
      />
      <h1>Welcome to Rubisco Extension Repository</h1>
      <p>
        Rubisco Extension Repository is a collection of extensions for Rubisco.
      </p>
      <button class="primary-button" @click="navigateToExtensions">
        Get Started
      </button>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function navigateToExtensions() {
  router.push("/extensions");
}
</script>

<script>
export default {
  name: "MainPage",
  props: {
    msg: String,
  },
};
</script>

<style scoped>
.main-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  margin: 3rem 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--greet-message);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--secondary-greeting);
}

.hero-logo {
  margin-bottom: 1rem;
  display: block;
  margin: 0 auto;
  width: 100px;
  height: 100px;
}

.primary-button {
  background-color: var(--primary);
  color: var(--greet-title);
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: var(--primary-stress);
}
</style>
