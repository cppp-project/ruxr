<template>
  <div class="container" v-if="!notFound">
    <ErrorContainer :initFunction="init">
      <div class="main-content">
        <div class="sidebar">
          <div class="package-info">
            <h1 class="package-name" v-if="packageData">
              {{ packageData.name }}
            </h1>
            <LiteLoadingBar v-else />

            <span class="package-version" v-if="packageData">
              v{{ packageData.versions[0]?.version || FALLBACK_VERSION }}
            </span>
            <LiteLoadingBar v-else />

            <p class="package-description" v-if="packageData">
              {{ packageData.description }}
            </p>
            <LiteLoadingBar v-else />

            <div class="actions">
              <button class="btn btn-primary" @click="downloadLatestRelease">
                <i class="nf nf-oct-download"></i> Download
              </button>
            </div>

            <div class="install-command" v-if="packageData">
              <h3>Install Command:</h3>
              <div class="command-box">
                <code class="language-reic">{{
                  rubiscoExtInstallCommand
                }}</code>
                <button
                  class="copy-command-btn"
                  :class="{
                    copied: copyStatus === COPY_SUCCESS,
                    copied_failure: copyStatus === COPY_FAILURE,
                  }"
                  @click="copyInstallCommand"
                  title="Copy to clipboard"
                >
                  <i
                    class="nf nf-md-check"
                    v-if="copyStatus === COPY_SUCCESS"
                  ></i>
                  <i
                    class="nf nf-cod-error_small"
                    v-else-if="copyStatus === COPY_FAILURE"
                  ></i>
                  <i class="nf nf-md-content_copy" v-else></i>
                  <span class="copy-text">{{
                    copyStatus === COPY_SUCCESS
                      ? "Copied!"
                      : copyStatus === COPY_FAILURE
                      ? "Copy failed"
                      : ""
                  }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="metadata">
            <h3>Package Metadata</h3>
            <div class="metadata-item">
              <span class="metadata-label">License:</span>
              <span v-if="packageData">
                {{ packageData.license }}
              </span>
              <LiteLoadingBar v-else />
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Homepage:</span>
              <span v-if="packageData">
                <a
                  :href="packageData.homepage"
                  target="_blank"
                  class="metadata-link"
                >
                  {{ packageData.homepage }}
                </a>
              </span>
              <LiteLoadingBar v-else />
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Tags:</span>
              <div class="tags" v-if="packageData && packageData.tags.length">
                <span
                  v-for="(tag, index) in packageData.tags"
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
              <LiteLoadingBar v-else-if="packageData" />
              <span v-else> No tags found. </span>
            </div>
          </div>

          <div class="metadata">
            <h3>Maintainers</h3>
            <div v-if="packageData && packageData.maintainers.length">
              <a
                :href="maintainer.homepage"
                target="_blank"
                class="maintainer-card"
                v-for="maintainer in packageData.maintainers"
                :key="maintainer.name"
              >
                <div class="maintainer-avatar">
                  <img :src="maintainer.avatar" alt="Maintainer Avatar" />
                </div>
                <div class="maintainer-name">{{ maintainer.name }}</div>
              </a>
            </div>
            <LiteLoadingBar
              v-else-if="packageData && packageData.maintainers"
            />
            <span v-else> No maintainers found. </span>
          </div>
        </div>

        <div class="content-area">
          <div class="tabs" ref="tabsContainer">
            <div
              ref="readmeTab"
              class="tab"
              :class="{ active: activeTab === 'readme' }"
              @click="switchTab('readme')"
            >
              README
            </div>
            <div
              ref="versionsTab"
              class="tab"
              :class="{ active: activeTab === 'versions' }"
              @click="switchTab('versions')"
            >
              Versions
            </div>
            <div
              ref="licenseTab"
              class="tab"
              :class="{ active: activeTab === 'license' }"
              @click="switchTab('license')"
            >
              License
            </div>
            <div
              ref="dependenciesTab"
              class="tab"
              :class="{ active: activeTab === 'dependencies' }"
              @click="switchTab('dependencies')"
            >
              Dependencies
            </div>
            <div class="tab-indicator" :style="indicatorStyle"></div>
          </div>

          <div class="tab-content">
            <Transition name="fade" mode="out-in">
              <div
                v-if="activeTab === 'readme'"
                key="readme"
                class="readme-content"
              >
                <MarkdownViewer
                  :url="baseUrl + packageData.getReadmeUrl()"
                  v-if="packageData"
                />
                <LoadingBar v-else />
              </div>

              <div
                v-else-if="activeTab === 'versions'"
                key="versions"
                class="versions-content"
              >
                <h3>Version History</h3>
                <ul class="versions-list">
                  <div v-if="packageData">
                    <li
                      v-for="version in packageData.versions"
                      :key="version.version"
                      class="version-item"
                    >
                      <span>
                        <a
                          :href="version.url"
                          target="_blank"
                          class="version-number"
                          v-if="version.url"
                          >v{{ version.version }}</a
                        >
                        <div v-else>{{ version.version }}</div>
                      </span>
                      <span class="version-date">{{ version.date }}</span>
                    </li>
                    <div v-if="!packageData.versions.length" class="no-content">
                      <p>No version history available for this extension.</p>
                    </div>
                  </div>
                  <LoadingBar v-else />
                </ul>
              </div>

              <div
                v-else-if="activeTab === 'license'"
                key="license"
                class="license-content"
              >
                <ErrorContainer :initFunction="fetchLicense">
                  <LicenseViewer
                    v-if="packageData && licenseText"
                    :key="licenseText"
                    :licenseName="packageData.license"
                    :licenseSummary="[]"
                    :licenseContent="licenseText"
                  />
                  <!-- <h1>{{ packageData.license }}</h1>
                    <pre><code>{{ licenseText }}</code></pre>
                  </div> -->
                  <LoadingBar v-else />
                </ErrorContainer>
              </div>

              <div
                v-else-if="activeTab === 'dependencies'"
                key="dependencies"
                class="dependencies-content"
              >
                <h3>Dependencies</h3>
                <ul class="versions-list">
                  <div v-if="packageData && packageData.deps.length">
                    <li
                      class="version-item"
                      v-for="dep in packageData.deps"
                      :key="dep.name"
                    >
                      <span>
                        <img
                          :src="getDepSectionIcon(dep.section)"
                          alt="Icon"
                          class="dep-section-icon"
                        />
                        <a
                          :href="dep.url"
                          target="_blank"
                          class="metadata-link"
                          v-if="dep.url"
                        >
                          {{ dep.name }}
                        </a>
                        <div v-else>{{ dep.name }}</div>
                      </span>
                      <span>{{ dep.version }}</span>
                    </li>
                  </div>
                  <LoadingBar v-else-if="!packageData" />
                  <div v-else class="no-content">
                    <p>No dependencies required for this extension.</p>
                  </div>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </ErrorContainer>
  </div>
  <div v-else>
    <NotFound />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { FullExtensionInfo } from "@/lib/extension";
import { fetchExtensionInfo } from "@/lib/fetch";
import { getDepSectionIcon } from "@/lib/dep-section";
import { useRoute } from "vue-router";

import DOMPurify from "dompurify";

import LoadingBar from "@/components/LoadingBar.vue";
import LiteLoadingBar from "@/components/LiteLoadingBar.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import ErrorContainer from "@/components/ErrorContainer.vue";
import LicenseViewer from "@/components/LicenseViewer.vue";
import NotFound from "./NotFound.vue";

@Options({
  name: "ExtensionShow",
  components: {
    LoadingBar,
    LiteLoadingBar,
    MarkdownViewer,
    ErrorContainer,
    LicenseViewer,
    NotFound,
  },
})
class ExtensionShow extends Vue {
  readonly COPY_NOT_YET = -1;
  readonly COPY_SUCCESS = 0;
  readonly COPY_FAILURE = 1;

  activeTab: string = "readme";
  packageData: FullExtensionInfo | null = null;
  copyStatus: number = this.COPY_NOT_YET;
  indicatorStyle: Record<string, string> = {};

  readonly FALLBACK_VERSION: string = "N/A";

  rubiscoExtInstallCommand: string = "";
  readmeText?: string;
  licenseText: string = "";
  baseUrl: string = process.env.BASE_URL;
  notFound: boolean = false;

  getDepSectionIcon = (section: string | null): string =>
    getDepSectionIcon(this.baseUrl, section);

  async init() {
    const route = useRoute();
    const id = route.params.id as string;
    this.packageData = await fetchExtensionInfo(this.baseUrl, id);
    if (!this.packageData) {
      // Extension not found
      this.notFound = true;
      return;
    }
    document.title = `${this.packageData.name} - RUXR`;
    this.rubiscoExtInstallCommand = `rubisco ext install ${this.packageData.id}`;

    this.$nextTick(() => {
      this.updateIndicator(this.activeTab);
    });
  }

  mounted() {
    this.$nextTick(() => {
      this.updateIndicator(this.activeTab);
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.updateIndicator(tab);
  }

  updateIndicator(tab: string) {
    const tabRef = this.$refs[`${tab}Tab`] as HTMLElement;
    if (tabRef) {
      const { offsetLeft, offsetWidth } = tabRef;
      this.indicatorStyle = {
        transform: `translateX(${offsetLeft}px)`,
        width: `${offsetWidth}px`,
      };
    }
  }

  async fetchLicense() {
    if (!this.packageData) {
      throw new Error("Package data is not available");
    }
    const response = await fetch(
      this.baseUrl + this.packageData.getLicenseUrl()
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch license: ${response.statusText}`);
    }
    this.licenseText = DOMPurify.sanitize(await response.text());
  }

  async copyInstallCommand(): Promise<void> {
    if (!this.packageData) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this.rubiscoExtInstallCommand);
        this.copyStatus = this.COPY_SUCCESS;

        setTimeout(() => {
          this.copyStatus = this.COPY_NOT_YET;
        }, 2000);

        console.log("Install command copied to clipboard");
      } else {
        this.fallbackCopyToClipboard(this.rubiscoExtInstallCommand);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      this.fallbackCopyToClipboard(this.rubiscoExtInstallCommand);
    }
  }

  fallbackCopyToClipboard(text: string): void {
    // Create a temporary textarea element.
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
      // @ts-ignore - execCommand is deprecated but still supported.
      const successful = document.execCommand("copy");
      if (successful) {
        this.copyStatus = this.COPY_SUCCESS;
        setTimeout(() => {
          this.copyStatus = this.COPY_NOT_YET;
        }, 2000);
        console.log("Install command copied to clipboard (fallback method)");
      } else {
        console.error("Failed to copy using fallback method");
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      this.copyStatus = this.COPY_FAILURE;
    } finally {
      document.body.removeChild(textArea);
    }
  }

  selectCommandText(): void {
    const commandElement = document.querySelector(
      ".command-text"
    ) as HTMLElement;
    if (commandElement) {
      const range = document.createRange();
      range.selectNodeContents(commandElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  downloadLatestRelease(): void {
    if (!this.packageData) return;
    const url = this.packageData.latest_release;
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  beforeUnmount() {
    this.copyStatus = this.COPY_NOT_YET;
  }
}

export default ExtensionShow;
</script>

<style scoped>
@import url("https://www.nerdfonts.com/assets/css/webfont.css");

.main-content {
  display: flex;
  gap: 30px;
  padding: 30px 0;
}

.sidebar {
  flex: 0 0 300px;
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--shadow);
  padding: 20px;
  height: fit-content;
}

.package-info {
  margin-bottom: 30px;
}

.package-name {
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 10px;
}

.package-version {
  display: inline-block;
  background: var(--secondary);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.package-description {
  color: var(--hint);
  margin-bottom: 20px;
}

.metadata {
  margin-bottom: 25px;
}

.metadata h3 {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border);
}

.metadata-item {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.metadata-label {
  font-weight: bold;
  min-width: 100px;
  color: var(--hint);
}

.metadata-link {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.metadata-link:hover {
  color: var(--primary-stress);
  text-decoration: underline;
}

.maintainer-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: 6px;
  background: var(--secondary-light);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  text-decoration: none;
}

.maintainer-card:hover {
  background: var(--secondary-light-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px var(--shadow);
}

.maintainer-avatar {
  flex-shrink: 0;
}

.maintainer-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--border-hover);
  transition: border-color 0.2s ease;
}

.maintainer-avatar img:hover {
  border-color: var(--primary);
}

.maintainer-name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.maintainer-name:hover {
  color: var(--primary-stress);
  text-decoration: underline;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.tag {
  background: var(--secondary-light);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary);
  color: var(--light);
  flex: 1;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.install-command {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--border);
}

.command-box {
  display: flex;
  align-items: center;
  background-color: var(--secondary-light);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px;
  position: relative;
}

.language-reic {
  flex: 1;
  font-family: Consolas, ui-monospace, SFMono-Regular, SF Mono, Menlo,
    Liberation Mono, monospace;
  font-size: 13px;
}

.copy-command-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--hint);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  flex-shrink: 0;
}

.copy-command-btn:hover {
  background-color: var(--secondary-light-hover);
  color: var(--primary);
}

.copy-command-btn.copied {
  color: var(--success);
  background-color: var(--success-background);
}

.copy-command-btn.copied_failure {
  color: var(--error);
  background-color: var(--error-background);
}

.copy-command-btn i {
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.copy-text {
  font-size: 0.8rem;
  font-weight: 600;
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.copy-command-btn.copied .copy-text,
.copy-command-btn.copied_failure .copy-text {
  max-width: 100px;
  opacity: 1;
  transform: translateX(0);
  margin-left: 4px;
}

.content-area {
  flex: 1;
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--shadow);
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  padding: 0 20px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 15px 20px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.3s ease;
  z-index: 1;
}

.tab.active {
  color: var(--primary);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--primary);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.tab-content {
  padding: 30px;
  min-height: 400px;
  position: relative;
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

.readme-content {
  line-height: 1.8;
}

.readme-content h2 {
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.readme-content p {
  margin-bottom: 15px;
}

.readme-content pre {
  background: var(--secondary);
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 15px 0;
}

.no-content {
  text-align: center;
  padding: 50px 0;
  color: var(--hint);
}

.license-content {
  white-space: pre-wrap;
  line-height: 1.6;
}

.versions-list {
  list-style: none;
}

.version-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
}

.version-item:last-child {
  border-bottom: none;
}

.version-number {
  font-weight: bold;
  text-decoration: none;
  color: var(--primary);
  transition: color 0.2s ease;
}

.version-number:hover {
  color: var(--primary-stress);
}

.version-date {
  color: var(--hint);
  font-size: 0.9rem;
}

.dep-section-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 15px 0;
  }

  .sidebar {
    flex: 1;
  }

  .tabs {
    padding: 0 10px;
  }

  .tab {
    padding: 12px 15px;
    font-size: 0.9rem;
  }

  .tab-content {
    padding: 20px 15px;
  }

  .content-area {
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 10px 0;
  }

  .tabs {
    padding: 0 5px;
  }

  .tab {
    padding: 10px 12px;
    font-size: 0.85rem;
  }

  .tab-content {
    padding: 15px 10px;
  }
}
</style>
