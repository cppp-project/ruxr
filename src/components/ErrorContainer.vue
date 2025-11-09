<template>
  <div v-if="errorMessage" class="error-container">
    <i class="error-icon nf nf-seti-error"></i>
    <h3 class="error-title">Error</h3>
    <p class="error-message">{{ errorMessage }}</p>
    <button class="retry-button" @click="init">Retry</button>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from "vue-class-component";

class Props {
  initFunction = prop<() => Promise<void>>({ required: true });
}

@Options({
  name: "ErrorContainer",
})
class ErrorContainer extends Vue.with(Props) {
  errorMessage: string = "";

  async init(): Promise<void> {
    try {
      await this.initFunction();
      this.errorMessage = "";
    } catch (error) {
      console.error(error);
      this.errorMessage =
        error instanceof Error ? error.message : String(error);
    }
  }

  async mounted() {
    await this.init();
  }
}

export default ErrorContainer;
</script>

<style>
@import url("https://www.nerdfonts.com/assets/css/webfont.css");

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  color: var(--primary);
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.error-message {
  color: var(--hint);
  font-size: 16px;
  margin: 0 0 24px 0;
  max-width: 400px;
  line-height: 1.5;
}

.retry-button {
  background-color: var(--primary);
  color: var(--light);
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background-color: var(--primary-stress);
  transform: translateY(-1px);
}

.retry-button:active {
  transform: translateY(0);
}
</style>
