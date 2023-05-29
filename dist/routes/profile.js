"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_1 = require("../controllers/profile");
const router = express_1.default.Router();
router.route('/:userId').get(profile_1.getProfile).put(profile_1.editProfile);
router.route('/skills/:skill').get(profile_1.getSVTs);
router.route('/skills/:skillId/submit').post(profile_1.submitSolution);
router.route('/skills/:regulatorId/addSVT').post(profile_1.addSVT);
router.route('/skills/:regulatorId/solutions').get(profile_1.getPendingSolutions);
router.route('/skills/:regulatorId/solutions/:solutionId/score').put(profile_1.scoreSolution);
exports.default = router;
//# sourceMappingURL=profile.js.map