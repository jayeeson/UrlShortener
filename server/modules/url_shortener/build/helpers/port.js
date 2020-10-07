"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPort = void 0;
var getPortIndex = function (str) {
    return process.argv.findIndex(function (element) { return element.toLocaleUpperCase().includes(str.toLocaleUpperCase()); });
};
exports.getPort = function (str, envVariable) {
    var portIndex = getPortIndex(str);
    var portArg = portIndex > -1 ? parseInt(process.argv[portIndex].substr(str.length), 10) : undefined;
    var portEnv = parseInt("" + envVariable, 10);
    if (portArg && !isNaN(portArg) && portArg > 0) {
        return portArg;
    }
    else if (!isNaN(portEnv) && portEnv > 0) {
        return portEnv;
    }
    return undefined;
};
//# sourceMappingURL=port.js.map