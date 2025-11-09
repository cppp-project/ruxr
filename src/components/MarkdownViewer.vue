<template>
  <ErrorContainer :initFunction="renderMarkdown">
    <div v-if="renderedMarkdown">
      <div
        class="markdown-body"
        v-html="renderedMarkdown"
        style="background-color: transparent"
      ></div>
    </div>
    <LoadingBar v-else />
  </ErrorContainer>
</template>

<script lang="ts">
import { Options, Vue, prop } from "vue-class-component";

import MarkdownIt from "markdown-it";
import MarkdownItKatex from "@vscode/markdown-it-katex";
import MarkdownItGitHubAlerts from "markdown-it-github-alerts";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItGitHubHeadings from "@/lib/markdown-it-github-headings";
import { tasklist as markdownItTasklist } from "@mdit/plugin-tasklist";
import { uml as markdownItUml } from "@mdit/plugin-uml";
import { full as markdownItEmoji } from "markdown-it-emoji";

import DOMPurify from "dompurify";
import hljs from "highlight.js";

import LoadingBar from "@/components/LoadingBar.vue";
import ErrorContainer from "@/components/ErrorContainer.vue";

import { getTheme, isDarkTheme, onThemeChange } from "@/lib/theme";
import { getRoutePath } from "@/lib/route-path";

// import MarkdownItGitHubHeadings from 'markdown-it-github-headings';
// TODO: Wait for https://github.com/Flet/markdown-it-github-headings/pull/18

class Props {
  url = prop<string>({ required: true });
}

@Options({
  name: "MarkdownViewer",
  components: {
    LoadingBar,
    ErrorContainer,
  },
})
class MarkdownViewer extends Vue.with(Props) {
  renderedMarkdown: string = "";

  githubMarkdownCSS: HTMLLinkElement | null = null;
  codeHighlightCSS: HTMLLinkElement | null = null;

  async mounted(): Promise<void> {
    this.themeChangeCallback();
    onThemeChange(this.themeChangeCallback.bind(this));
  }

  themeChangeCallback() {
    // Get or create GitHub Markdown CSS link element.
    const githubMarkdownCSS = document.getElementById("github-markdown-css");
    if (githubMarkdownCSS && githubMarkdownCSS.tagName === "LINK") {
      this.githubMarkdownCSS = githubMarkdownCSS as HTMLLinkElement;
    } else {
      this.githubMarkdownCSS = document.createElement("link");
      this.githubMarkdownCSS.id = "github-markdown-css";
      document.head.appendChild(this.githubMarkdownCSS);
    }

    this.githubMarkdownCSS.rel = "stylesheet";
    this.githubMarkdownCSS.type = "text/css";

    // Get or create Code Highlight CSS link element.
    const codeHighlightCSS = document.getElementById("code-highlight-css");
    if (codeHighlightCSS && codeHighlightCSS.tagName === "LINK") {
      this.codeHighlightCSS = codeHighlightCSS as HTMLLinkElement;
    } else {
      this.codeHighlightCSS = document.createElement("link");
      this.codeHighlightCSS.id = "code-highlight-css";
      document.head.appendChild(this.codeHighlightCSS);
    }

    this.codeHighlightCSS.rel = "stylesheet";
    this.codeHighlightCSS.type = "text/css";

    if (isDarkTheme(getTheme())) {
      this.githubMarkdownCSS.href =
        "https://cdn.jsdelivr.net/npm/github-markdown-css@latest/github-markdown-dark.css";
      this.codeHighlightCSS.href =
        "https://cdn.jsdelivr.net/npm/highlight.js@latest/styles/github-dark.css";
    } else {
      this.githubMarkdownCSS.href =
        "https://cdn.jsdelivr.net/npm/github-markdown-css@latest/github-markdown.css";
      this.codeHighlightCSS.href =
        "https://cdn.jsdelivr.net/npm/highlight.js@latest/styles/github.css";
    }
  }

  async renderMarkdown(): Promise<void> {
    this.renderedMarkdown = "";

    const response = await fetch(this.url);
    const markdown_text = await response.text();

    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str: string, lang: string): string {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              '<pre class="hljs" style="font-family: var(--monospace-font-family);"><code>' +
              hljs.highlight(str, { language: lang, ignoreIllegals: true })
                .value +
              "</code></pre>"
            );
          } catch (__) {
            return (
              '<pre class="hljs" style="font-family: var(--monospace-font-family);"><code>' +
              md.utils.escapeHtml(str) +
              "</code></pre>"
            );
          }
        }

        return (
          '<pre class="hljs" style="font-family: var(--monospace-font-family);"><code>' +
          md.utils.escapeHtml(str) +
          "</code></pre>"
        );
      },
    });

    md.use(MarkdownItKatex)
      .use(MarkdownItGitHubAlerts)
      .use(markdownItEmoji)
      .use(MarkdownItFootnote)
      .use(MarkdownItGitHubHeadings)
      .use(markdownItTasklist)
      .use(markdownItUml);

    const routePath = getRoutePath(window.location.toString());

    this.renderedMarkdown = DOMPurify.sanitize(
      md.render(markdown_text, {
        throwOnError: false,
        errorColor: "red",
        footnoteHrefPrefix: routePath + "#",
        headingLinksPrefix: routePath + "#",
      })
    );
  }
}

export default MarkdownViewer;
</script>

<style>
.markdown-content {
  line-height: 1.6;
}

.markdown-body pre code {
  font-family: inherit;
}

.katex-html {
  display: none;
}
</style>
