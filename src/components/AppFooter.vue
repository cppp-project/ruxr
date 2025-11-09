<template>
  <footer>
    <div class="container footer-content">
      <!-- <div class="footer-section">
        <h3>Resources</h3>
        <ul class="footer-links">
          <li><a href="#">Documentation</a></li>
          <li><a href="#">API Reference</a></li>
          <li><a href="#">Tutorials</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div> -->

      <div class="footer-section">
        <h3>Community</h3>
        <ul class="footer-links">
          <li><a href="https://github.com/cppp-project">GitHub</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Legal</h3>
        <ul class="footer-links">
          <li>
            <router-link to="/code-of-conduct">Code of Conduct</router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="container copyright">
      &copy; 2025 Rubisco Extension Repository. All rights reserved.
    </div>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "AppFooter",
})
class AppFooter extends Vue {
  props:
    | {
        msg: String;
      }
    | undefined;
}

export default AppFooter;
</script>

<style scoped>
footer {
  background: #333;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section h3 {
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 10px;
  list-style-type: disc;
}

.footer-links a,
.footer-links .router-link-active,
.footer-links .router-link-exact-active {
  color: #ddd;
  text-decoration: none;
}

.footer-links a:hover,
.footer-links .router-link-active:hover,
.footer-links .router-link-exact-active:hover {
  color: #fff;
  text-decoration: underline;
}

.copyright {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #444;
  color: #aaa;
}
</style>
