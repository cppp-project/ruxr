/*
 * Copyright (c) 2017, Dan Flettre flettre@gmail.com
 * This file is from https://github.com/Flet/markdown-it-github-headings
 * Licensed under the ISC License.
 * We modify the original file to add the headingLinksPrefix option.
 */

import MarkdownIt from "markdown-it";
import GithubSlugger from "github-slugger";
import innertext from "innertext";
import { Renderer, Options } from "markdown-it";
import Token from "markdown-it/lib/token.mjs";

interface PluginOptions {
    enableHeadingLinkIcons?: boolean;
    prefixHeadingIds?: boolean;
    prefix?: string;
    className?: string;
    linkIcon?: string;
    resetSlugger?: boolean;
    headingLinksPrefix?: string;
}

const defaultOptions: PluginOptions = {
    enableHeadingLinkIcons: true,
    prefixHeadingIds: true,
    prefix: "user-content-",
    className: 'anchor',
    linkIcon:
        '<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewbox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>',
    resetSlugger: true,
    headingLinksPrefix: "#",
};

function plugin(md: MarkdownIt): void {
    md.renderer.rules.heading_open = function (
        tokens: Token[], idx: number, options: Options, env: any, self: Renderer
    ): string {
        const opts = { ...defaultOptions, ...options, ...env };

        if (!opts.prefixHeadingIds) opts.prefix = "";
        const slugger = new GithubSlugger();
        const children = tokens[idx + 1]?.children;

        if (children && children.length) {
            const unemojiWithToken = unemoji.bind(null, Token);
            const rendered = md.renderer.renderInline(
                children.map(unemojiWithToken),
                opts,
                env
            );
            const postfix = slugger.slug(
                innertext(rendered)
                    .replace(/[<>]/g, "")
                    .toLowerCase()
            );

            const linkOpen = new Token("link_open", "a", 1);
            const text = new Token("html_inline", "", 0);
            if (opts.enableHeadingLinkIcons) {
                text.content = opts.linkIcon || "";
            }
            const linkClose = new Token("link_close", "a", -1);

            linkOpen.attrSet("id", opts.prefix + postfix);
            linkOpen.attrSet("class", opts.className || "");
            linkOpen.attrSet("href", opts.headingLinksPrefix + opts.prefix + postfix);
            linkOpen.attrSet("aria-hidden", "true");

            children.unshift(linkClose);
            children.unshift(text);
            children.unshift(linkOpen);
        }

        return md.renderer.renderToken(tokens, idx, options as MarkdownIt.Options);
    };
}

function unemoji(TokenConstructor: any, token: any): any {
    if (token.type === "emoji") {
        return { ...new TokenConstructor(), ...token, content: token.markup };
    }
    return token;
}

export default plugin;
