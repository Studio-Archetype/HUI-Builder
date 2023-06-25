/**
 * Capitalizes the first letter of a string
 *
 * @param str The string to capitalize
 */
export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalizes all words in a string
 *
 * @param str The string to capitalize
 */
export function capitalizeAll(str: string) {
    return str.split(/[\s_-]/).map(capitalize).join(' ');
}