"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLocalStorage = exports.loadFromLocalStorage = exports.saveToLocalStorage = void 0;
var isLocalStorageAvailable = (function () {
    try {
        var key = "fUjXn2r59"; // A random key
        var value = "test";
        localStorage.setItem(key, value);
        var gotValue = localStorage.getItem(key);
        localStorage.removeItem(key);
        return true;
    }
    catch (e) {
        return false;
    }
})();
function saveToLocalStorage(key, value, expired) {
    if (!isLocalStorageAvailable) {
        return -1;
    }
    var savedItem = {
        value: value,
        expired: Date.now() + 1000 * expired
    };
    try {
        localStorage.setItem("casbinjs_" + key, JSON.stringify(savedItem));
    }
    catch (e) {
        throw (e);
        // TODO: Process the quotaExceededError
    }
    return 0;
}
exports.saveToLocalStorage = saveToLocalStorage;
/***
 * return: a string.
 * If ret == null, it means there is no such user permission.
 */
function loadFromLocalStorage(key) {
    if (!isLocalStorageAvailable) {
        return null;
    }
    var itemStr = localStorage.getItem("casbinjs_" + key);
    // No cache
    if (itemStr === null) {
        return null;
    }
    var item = JSON.parse(itemStr);
    if (Date.now() > item["expired"]) {
        localStorage.removeItem("casbinjs_" + key);
        return null;
    }
    else {
        return item['value'];
    }
}
exports.loadFromLocalStorage = loadFromLocalStorage;
function removeLocalStorage(key) {
    localStorage.removeItem("casbinjs_" + key);
}
exports.removeLocalStorage = removeLocalStorage;
