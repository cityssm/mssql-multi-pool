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
exports.releaseAll = exports.connect = void 0;
const mssql_1 = require("mssql");
const POOLS = {};
const getPoolKey = (config) => {
    var _a;
    return (config.user || "") +
        "@" +
        config.server +
        "/" +
        (((_a = config.options) === null || _a === void 0 ? void 0 : _a.instanceName) || "");
};
let shutdownInitialized = false;
const connect = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const poolKey = getPoolKey(config);
    let pool = POOLS[poolKey];
    if (!pool || !pool.connected) {
        pool = yield (new mssql_1.ConnectionPool(config)).connect();
        POOLS[poolKey] = pool;
    }
    if (!shutdownInitialized) {
        if (process) {
            const shutdownEvents = ["beforeExit", "exit", "SIGINT", "SIGTERM"];
            for (const shutdownEvent of shutdownEvents) {
                process.on(shutdownEvent, exports.releaseAll);
            }
        }
        shutdownInitialized = true;
    }
    return pool;
});
exports.connect = connect;
const releaseAll = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const poolKey of Object.getOwnPropertyNames(POOLS)) {
        yield POOLS[poolKey].close().catch();
        delete POOLS[poolKey];
    }
});
exports.releaseAll = releaseAll;
