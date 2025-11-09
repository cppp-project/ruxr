<template>
  <div class="license-viewer">
    <h1 class="license-viewer-header">{{ name }}</h1>
    <ul class="license-summary">
      <li v-for="item in summary" :key="item">{{ item }}</li>
    </ul>
    <pre class="license-content">{{ content }}</pre>
  </div>
</template>

<script lang="ts">
import DOMPurify from "dompurify";
import { Options, Vue, prop } from "vue-class-component";

class Props {
  licenseName = prop<string>({ required: true });
  licenseSummary = prop<string[]>({ required: false, default: () => [] });
  licenseContent = prop<string>({ required: true });
}

@Options({
  name: "LicenseViewer",
})
class LicenseViewer extends Vue.with(Props) {
  name: string = "";
  summary: string[] = [];
  content: string = "";

  mounted() {
    this.name = this.licenseName;
    this.summary = this.licenseSummary;
    this.content = DOMPurify.sanitize(this.licenseContent);
  }
}

export default LicenseViewer;
</script>

<style scoped>
.license-viewer {
  display: flex;
  flex-direction: column;
}

.license-viewer-header {
  color: var(--dark);
  font-family: var(--font-family);
  margin-left: auto;
  margin-right: auto;
}

.license-summary {
  margin-top: 10px;
  padding-left: 20px;
  text-align: left;
  margin-left: 0px;
  color: var(--dark);
  font-family: var(--font-family);
}

.license-content {
  margin-top: 20px;
  text-align: left;
  display: inline-block;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
  font-family: var(--monospace-font-family);
}
</style>
