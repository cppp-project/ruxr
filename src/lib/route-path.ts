function countChar(str: string, char: string) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === char) {
            count++;
        }
    }
    return count;
}

export function getRoutePath(fullPath: string) {
    // We use hash router. So if the path only contains one #, it is the hash part.
    // We need to remove it.
    if (countChar(fullPath, "#") === 1) {
        return fullPath;
    }
    const index = fullPath.lastIndexOf("#");
    if (index === -1) {
        return fullPath;
    }
    return fullPath.substring(0, index);
}
