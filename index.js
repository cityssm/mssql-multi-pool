"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mssql_1 = require("mssql");
const POOLS = {};
function getPoolKey(config) {
    var _a;
    return (config.user || "") +
        "@" +
        config.server +
        "/" +
        (((_a = config.options) === null || _a === void 0 ? void 0 : _a.instanceName) || "");
}
function connect(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const poolKey = getPoolKey(config);
        if (!POOLS[poolKey]) {
            const pool = yield (new mssql_1.ConnectionPool(config)).connect();
            POOLS[poolKey] = pool;
        }
        return POOLS[poolKey];
    });
}
exports.connect = connect;
