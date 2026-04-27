"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOperation = void 0;
const logOperation = (operation, user, details) => {
    const entry = {
        timestamp: new Date().toISOString(),
        operation,
        userId: user?.id ?? 'anonymous',
        role: user?.role ?? 'none',
        details,
    };
    console.log(JSON.stringify(entry));
};
exports.logOperation = logOperation;
