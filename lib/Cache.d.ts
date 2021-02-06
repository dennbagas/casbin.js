export declare function saveToLocalStorage(key: string, value: string, expired: number): number;
/***
 * return: a string.
 * If ret == null, it means there is no such user permission.
 */
export declare function loadFromLocalStorage(key: string): string | null;
export declare function removeLocalStorage(key: string): void;
