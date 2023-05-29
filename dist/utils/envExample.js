"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function envExample() {
    let envExample = fs_1.default.readFileSync('.env', 'utf8');
    envExample = envExample.replace(/=.*/g, '=env_value');
    fs_1.default.writeFileSync('.env.example', envExample);
}
exports.default = envExample;
//# sourceMappingURL=envExample.js.map