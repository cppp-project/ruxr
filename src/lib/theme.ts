/**
 * @brief Themes list.
 */
export const THEME_VALUES = ["Blue", "Red", "Green", "Dark Blue", "Dark Purple"] as const;

/**
 * @brief Dark themes list.
 */
const DARK_THEMES = ["Dark Blue", "Dark Purple"];

/**
 * @brief The theme type.
 */
export type ThemeName = typeof THEME_VALUES[number];

const THEME_KEY = "ruxr.theme";
const DEFAULT_THEME = "Blue" as ThemeName;

let currentTheme: ThemeName = DEFAULT_THEME;
const themeChangeCallbacks: Array<(theme: ThemeName) => void> = [];

function canonicalTheme(theme: string): ThemeName {
    const words = theme.replace("-", " ").split(" ");
    const canonicalized = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    return canonicalized.join(" ") as ThemeName;
}

function fromCanonicalTheme(theme: ThemeName): string {
    return theme.toLocaleLowerCase().replace(" ", "-");
}

export function getSavedTheme(): ThemeName {
    const t_ = localStorage.getItem(THEME_KEY);
    if (t_ == null) {
        return DEFAULT_THEME;
    }
    const t = canonicalTheme(t_);

    currentTheme = THEME_VALUES.includes(t) ? t : DEFAULT_THEME;
    return currentTheme;
}

export function setTheme(theme: ThemeName): void {
    const t = fromCanonicalTheme(theme);

    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem(THEME_KEY, t);

    currentTheme = theme;

    for (const callback of themeChangeCallbacks) {
        callback(theme);
    }
}

export function getTheme(): ThemeName {
    return currentTheme;
}

export function isDarkTheme(theme: ThemeName): boolean {
    return DARK_THEMES.includes(theme.toString());
}

export function onThemeChange(callback: (theme: ThemeName) => void): void {
    themeChangeCallbacks.push(callback);
}

export function initTheme(defaultTheme: ThemeName = DEFAULT_THEME): void {
    const saved = getSavedTheme();
    const theme = fromCanonicalTheme(saved ?? defaultTheme);

    // Apply early to avoid FOUC.
    document.documentElement.setAttribute("data-theme", theme);
    if (!saved) {
        localStorage.setItem(THEME_KEY, theme);
    }
    for (const callback of themeChangeCallbacks) {
        callback(saved);
    }
}
