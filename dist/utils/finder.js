"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTypeofUser = void 0;
const models_1 = require("../models");
function findTypeofUser(type) {
    if (type === 'Freelancer')
        return models_1.Freelancer;
    if (type === 'Employer')
        return models_1.Employer;
    return models_1.User;
}
exports.findTypeofUser = findTypeofUser;
//# sourceMappingURL=finder.js.map