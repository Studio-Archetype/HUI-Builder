/**
 * Convert an array of classnames to a string
 *
 * @param array Array of classnames
 */
export function joinedClassNames(array: (string | undefined)[]): string {
    return array.filter(Boolean).join(' ')
}

/**
 * Convert "conditional" classnames to a string
 *
 * @param obj Object with keys as classnames and values as booleans
 */
export function conditionalClassNames(obj: Record<string, boolean>): string {
    return Object.keys(obj)
        .filter(key => obj[key])
        .join(' ')
}