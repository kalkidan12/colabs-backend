"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategies_1 = require("./strategies");
const passportConfig = (passport) => {
    passport.use(strategies_1.googleStategey);
    passport.use(strategies_1.githubStategey);
};
exports.default = passportConfig;
//# sourceMappingURL=index.js.map