"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlyUsers = exports.OnlyAdmins = exports.ERROR_CODES = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE["USER"] = "USER";
    ROLE["ADMIN"] = "ADMIN";
    ROLE["SUPER_ADMIN"] = "SUPER_ADMIN";
})(ROLE || (exports.ROLE = ROLE = {}));
var ERROR_CODES;
(function (ERROR_CODES) {
    ERROR_CODES["VALIDATION_ERR"] = "VALIDATION_ERR";
    ERROR_CODES["NOT_FOUND_ERR"] = "NOT_FOUND_ERR";
    ERROR_CODES["INTERNAL_SERVER_ERR"] = "INTERNAL_SERVER_ERR";
    ERROR_CODES["AUTH_ERR"] = "AUTH_ERR";
})(ERROR_CODES || (exports.ERROR_CODES = ERROR_CODES = {}));
exports.OnlyAdmins = [ROLE.ADMIN, ROLE.SUPER_ADMIN];
exports.OnlyUsers = [ROLE.USER];
