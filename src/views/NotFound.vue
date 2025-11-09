<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <div class="error-illustration">
          <div class="error-code">404</div>
          <div class="error-icon">
            <i class="nf nf-fa-exclamation_triangle"></i>
          </div>
        </div>

        <div class="errror-msg">
          <h1>Page Not Found</h1>
          <p>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div class="error-actions">
          <button class="primary-button" @click="goHome">
            <i class="nf nf-cod-home"></i>
            Home
          </button>
          <button class="secondary-button" @click="goBack">
            <i class="nf nf-cod-arrow_left"></i>
            Back
          </button>
          <button class="secondary-button" @click="goExtensions">
            <i class="nf nf-cod-extensions"></i>
            Search Extensions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "NotFound",
})
class NotFound extends Vue {
  goHome(): void {
    this.$router.push("/");
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.$router.go(-1);
    } else {
      this.$router.push("/");
    }
  }

  goExtensions(): void {
    this.$router.push("/extensions");
  }
}

export default NotFound;
</script>

<style scoped>
@import url("https://www.nerdfonts.com/assets/css/webfont.css");

.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background: var(--light-background);
}

.container {
  max-width: 800px;
  width: 100%;
  padding: 0 2rem;
  margin: 0 auto;
}

.error-content {
  text-align: center;
  background: var(--light);
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px var(--shadow);
}

.error-illustration {
  position: relative;
  margin-bottom: 2rem;
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px var(--shadow);
  text-align: center;
}

.error-icon {
  margin-top: 1rem;
  text-align: center;
}

.error-icon i {
  font-size: 3rem;
}

.errror-msg {
  margin-bottom: 3rem;
  text-align: center;
  width: 100%;
  display: block;
}

.errror-msg h1 {
  font-size: 2.5rem;
  color: var(--greet-message);
  margin-bottom: 1rem;
  width: 100%;
}

.errror-msg p {
  font-size: 1.1rem;
  color: var(--hint);
  line-height: 1.6;
  margin-bottom: 0.5rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.primary-button {
  background: var(--primary);
  color: var(--light);
}

.primary-button:hover {
  background: var(--primary-stress);
  transform: translateY(-2px);
}

.secondary-button {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--border);
}

.secondary-button:hover {
  background: var(--primary);
  color: var(--light);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .error-content {
    padding: 2rem 1rem;
  }

  .error-code {
    font-size: 6rem;
  }

  .errror-msg h1 {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    max-width: 250px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 4rem;
  }

  .errror-msg h1 {
    font-size: 1.5rem;
  }

  .errror-msg p {
    font-size: 1rem;
  }
}

.error-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-code {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>
