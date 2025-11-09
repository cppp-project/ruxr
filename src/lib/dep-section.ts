const DEPENDENCE_SECTIONS = {
    "pypi": "/res/pypi.svg",
    "xmake": "/res/xmake.svg",
    "cpp": "/res/cpp.svg",
}

/**
 * Get the icon path of the dependence section.
 * @param baseUrl The base URL of the resources.
 * @param section The section of the dependence.
 * @returns The icon path of the dependence section.
 */
export function getDepSectionIcon(baseUrl: string, section: string | null): string {
    if (section && section in DEPENDENCE_SECTIONS) {
        return baseUrl + DEPENDENCE_SECTIONS[section as keyof typeof DEPENDENCE_SECTIONS];
    } else {
        return baseUrl + "/res/package.svg";
    }
}

