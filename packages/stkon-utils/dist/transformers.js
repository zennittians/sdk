"use strict";
/**
 * @packageDocumentation
 * @module stkon-utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = exports.fromWei = exports.toWei = exports.hexToBN = exports.hexToNumber = exports.numberToHex = exports.strip0x = exports.add0xToString = exports.numToStr = exports.numberToString = exports.unitMap = exports.Units = void 0;
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var validators_1 = require("./validators");
var Units;
(function (Units) {
    Units["wei"] = "wei";
    Units["Kwei"] = "Kwei";
    Units["Mwei"] = "Mwei";
    Units["Gwei"] = "Gwei";
    Units["szabo"] = "szabo";
    Units["finney"] = "finney";
    Units["ether"] = "ether";
    Units["stk"] = "stk";
    Units["Kether"] = "Kether";
    Units["Mether"] = "Mether";
    Units["Gether"] = "Gether";
    Units["Tether"] = "Tether";
})(Units || (exports.Units = Units = {}));
/** @hidden */
exports.unitMap = new Map([
    [Units.wei, '1'],
    [Units.Kwei, '1000'], // 1e3 wei
    [Units.Mwei, '1000000'], // 1e6 wei
    [Units.Gwei, '1000000000'], // 1e9 wei
    [Units.szabo, '1000000000000'], // 1e12 wei
    [Units.finney, '1000000000000000'], // 1e15 wei
    [Units.ether, '1000000000000000000'], // 1e18 wei
    [Units.stk, '1000000000000000000'], // 1e18 wei
    [Units.Kether, '1000000000000000000000'], // 1e21 wei
    [Units.Mether, '1000000000000000000000000'], // 1e24 wei
    [Units.Gether, '1000000000000000000000000000'], // 1e27 wei
    [Units.Tether, '1000000000000000000000000000000'], // 1e30 wei
]);
/** @hidden */
var DEFAULT_OPTIONS = {
    pad: false,
};
/**
 * Convert Number to String
 */
var numberToString = function (obj, radix) {
    if (radix === void 0) { radix = 10; }
    if (bn_js_1.default.isBN(obj)) {
        return obj.toString(radix);
    }
    else if ((0, validators_1.isNumber)(obj)) {
        return new bn_js_1.default(obj).toString(radix);
    }
    else if ((0, validators_1.isString)(obj) && (0, validators_1.isNumber)(Number(obj))) {
        return new bn_js_1.default(obj).toString(radix);
    }
    else {
        throw new Error("cannot parse number:".concat(obj, " to string"));
    }
};
exports.numberToString = numberToString;
/**
 * Convert Number to String
 */
var numToStr = function (input) {
    if (typeof input === 'string') {
        if (!input.match(/^-?[0-9.]+$/)) {
            throw new Error("while converting number to string, invalid number value '".concat(input, "', should be a number matching (^-?[0-9.]+)."));
        }
        return input;
    }
    else if (typeof input === 'number') {
        return String(input);
    }
    else if (bn_js_1.default.isBN(input)) {
        return input.toString(10);
    }
    throw new Error("while converting number to string, invalid number value '".concat(input, "' type ").concat(typeof input, "."));
};
exports.numToStr = numToStr;
var add0xToString = function (obj) {
    if ((0, validators_1.isString)(obj) && !obj.startsWith('-')) {
        return '0x' + obj.replace('0x', '');
    }
    else if ((0, validators_1.isString)(obj) && obj.startsWith('-')) {
        return '-0x' + obj.replace('-', '');
    }
    else {
        throw new Error("".concat(obj, " is not String"));
    }
};
exports.add0xToString = add0xToString;
var strip0x = function (obj) {
    return obj.toLowerCase().replace('0x', '');
};
exports.strip0x = strip0x;
/**
 * Convert number to hex
 */
var numberToHex = function (obj) {
    try {
        return (0, exports.add0xToString)((0, exports.numberToString)(obj, 16));
    }
    catch (error) {
        throw error;
    }
};
exports.numberToHex = numberToHex;
/**
 * Convert hex to Decimal number
 */
var hexToNumber = function (hex) {
    if ((0, validators_1.isHex)(hex) && hex[0] !== '-') {
        return new bn_js_1.default((0, exports.strip0x)(hex), 'hex').toString();
    }
    else if ((0, validators_1.isHex)(hex) && hex[0] === '-') {
        var result = new bn_js_1.default(hex.substring(3), 16);
        return result.mul(new bn_js_1.default(-1)).toString();
    }
    else {
        throw new Error("".concat(hex, " is not hex number"));
    }
};
exports.hexToNumber = hexToNumber;
/**
 * Convert hex to Big Number
 */
var hexToBN = function (hex) {
    if ((0, validators_1.isHex)(hex) && hex[0] !== '-') {
        return new bn_js_1.default((0, exports.strip0x)(hex), 'hex');
    }
    else if ((0, validators_1.isHex)(hex) && hex[0] === '-') {
        var result = new bn_js_1.default(hex.substring(3), 16);
        return result.mul(new bn_js_1.default(-1));
    }
    else {
        throw new Error("".concat(hex, " is not hex number"));
    }
};
exports.hexToBN = hexToBN;
/**
 * Converts any STK value into wei
 */
var toWei = function (input, unit) {
    try {
        var inputStr = (0, exports.numToStr)(input);
        var baseStr = exports.unitMap.get(unit);
        if (!baseStr) {
            throw new Error("No unit of type ".concat(unit, " exists."));
        }
        var baseNumDecimals = baseStr.length - 1;
        var base = new bn_js_1.default(baseStr, 10);
        // Is it negative?
        var isNegative = inputStr.substring(0, 1) === '-';
        if (isNegative) {
            inputStr = inputStr.substring(1);
        }
        if (inputStr === '.') {
            throw new Error("Cannot convert ".concat(inputStr, " to wei."));
        }
        // Split it into a whole and fractional part
        var comps = inputStr.split('.'); // eslint-disable-line
        if (comps.length > 2) {
            throw new Error("Cannot convert ".concat(inputStr, " to wei."));
        }
        var _a = tslib_1.__read(comps, 2), whole = _a[0], fraction = _a[1];
        if (!whole) {
            whole = '0';
        }
        if (!fraction) {
            fraction = '0';
        }
        if (fraction.length > baseNumDecimals) {
            throw new Error("Cannot convert ".concat(inputStr, " to wei."));
        }
        while (fraction.length < baseNumDecimals) {
            fraction += '0';
        }
        var wholeBN = new bn_js_1.default(whole);
        var fractionBN = new bn_js_1.default(fraction);
        var wei = wholeBN.mul(base).add(fractionBN);
        if (isNegative) {
            wei = wei.neg();
        }
        return new bn_js_1.default(wei.toString(10), 10);
    }
    catch (error) {
        throw error;
    }
};
exports.toWei = toWei;
/**
 * Converts any wei value into a STK value.
 */
var fromWei = function (wei, unit, options) {
    if (options === void 0) { options = DEFAULT_OPTIONS; }
    try {
        var weiBN = !bn_js_1.default.isBN(wei) ? new bn_js_1.default(wei) : wei;
        if (unit === 'wei') {
            return weiBN.toString(10);
        }
        var baseStr = exports.unitMap.get(unit);
        if (!baseStr) {
            throw new Error("No unit of type ".concat(unit, " exists."));
        }
        var base = new bn_js_1.default(baseStr, 10);
        var baseNumDecimals = baseStr.length - 1;
        var fraction = weiBN
            .abs()
            .mod(base)
            .toString(10);
        // prepend 0s to the fraction half
        while (fraction.length < baseNumDecimals) {
            fraction = "0".concat(fraction);
        }
        if (!options.pad) {
            /* eslint-disable prefer-destructuring */
            var matchFraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/);
            fraction = matchFraction ? matchFraction[1] : '0';
        }
        var whole = weiBN.div(base).toString(10);
        return fraction === '0' ? "".concat(whole) : "".concat(whole, ".").concat(fraction);
    }
    catch (error) {
        throw error;
    }
};
exports.fromWei = fromWei;
var Unit = /** @class */ (function () {
    function Unit(str) {
        if (!bn_js_1.default.isBN(str) && typeof str !== 'number' && (0, validators_1.isHex)(str)) {
            this.unit = (0, exports.hexToNumber)(str);
        }
        else if (!bn_js_1.default.isBN(str) && typeof str === 'number') {
            this.unit = str.toString();
        }
        else if (str === '0x') {
            this.unit = (0, exports.hexToNumber)('0x0');
        }
        else {
            this.unit = str;
        }
        this.wei = new bn_js_1.default(this.unit);
    }
    Unit.from = function (str) {
        return new Unit(str);
    };
    Unit.Wei = function (str) {
        return new Unit(str).asWei();
    };
    Unit.Kwei = function (str) {
        return new Unit(str).asKwei();
    };
    Unit.Mwei = function (str) {
        return new Unit(str).asMwei();
    };
    Unit.Gwei = function (str) {
        return new Unit(str).asGwei();
    };
    Unit.Szabo = function (str) {
        return new Unit(str).asSzabo();
    };
    Unit.Finney = function (str) {
        return new Unit(str).asFinney();
    };
    Unit.Ether = function (str) {
        return new Unit(str).asEther();
    };
    Unit.One = function (str) {
        return new Unit(str).asOne();
    };
    Unit.Kether = function (str) {
        return new Unit(str).asKether();
    };
    Unit.Mether = function (str) {
        return new Unit(str).asMether();
    };
    Unit.Gether = function (str) {
        return new Unit(str).asGether();
    };
    Unit.Tether = function (str) {
        return new Unit(str).asTether();
    };
    Unit.prototype.asWei = function () {
        this.wei = new bn_js_1.default(this.unit);
        return this;
    };
    Unit.prototype.asKwei = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.Kwei);
        return this;
    };
    Unit.prototype.asMwei = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.Mwei);
        return this;
    };
    Unit.prototype.asGwei = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.Gwei);
        return this;
    };
    Unit.prototype.asSzabo = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.szabo);
        return this;
    };
    Unit.prototype.asFinney = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.finney);
        return this;
    };
    Unit.prototype.asEther = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.ether);
        return this;
    };
    Unit.prototype.asOne = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.stk);
        return this;
    };
    Unit.prototype.asKether = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.Kether);
        return this;
    };
    Unit.prototype.asMether = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.Mether);
        return this;
    };
    Unit.prototype.asGether = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.Gether);
        return this;
    };
    Unit.prototype.asTether = function () {
        this.wei = (0, exports.toWei)(this.unit, Units.Tether);
        return this;
    };
    Unit.prototype.toWei = function () {
        if (this.wei) {
            return this.wei;
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toKwei = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.Kwei);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toGwei = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.Gwei);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toMwei = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.Mwei);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toSzabo = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.szabo);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toFinney = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.finney);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toEther = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.ether);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toOne = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.stk);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toKether = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.Kether);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toMether = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.Mether);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toGether = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.Gether);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toTether = function () {
        if (this.wei) {
            return (0, exports.fromWei)(this.wei, Units.Tether);
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toWeiString = function () {
        if (this.wei) {
            return this.wei.toString();
        }
        else {
            throw new Error('error transforming');
        }
    };
    Unit.prototype.toHex = function () {
        if (this.wei) {
            return (0, exports.numberToHex)(this.wei);
        }
        else {
            throw new Error('error transforming');
        }
    };
    return Unit;
}());
exports.Unit = Unit;
//# sourceMappingURL=transformers.js.map