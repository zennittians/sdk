"use strict";
/**
 * @packageDocumentation
 * @module stkon-network
 * @hidden
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onResponse = exports.getRawForData = exports.getResultForData = void 0;
/**
 * @function getResultForData
 * @description get result for data by default
 * @param  {any} data - object get from provider
 * @return {any} data result or data
 */
function getResultForData(data) {
    if (data.result) {
        return data.getResult;
    }
    if (data.error) {
        return data.getError;
    }
    return data.getRaw;
}
exports.getResultForData = getResultForData;
function getRawForData(data) {
    return data.getRaw;
}
exports.getRawForData = getRawForData;
function onResponse(response) {
    if (response.responseType === 'result') {
        return response.getResult;
    }
    else if (response.responseType === 'error') {
        return response.getError;
    }
    else {
        return response.raw;
    }
}
exports.onResponse = onResponse;
//# sourceMappingURL=util.js.map