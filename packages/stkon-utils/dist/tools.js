"use strict";
/**
 * @packageDocumentation
 * @module stkon-utils
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineReadOnly = void 0;
function defineReadOnly(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}
exports.defineReadOnly = defineReadOnly;
//# sourceMappingURL=tools.js.map