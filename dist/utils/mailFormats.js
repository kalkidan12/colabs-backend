"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordFormat = exports.verifyEmailFormat = void 0;
function verifyEmailFormat(link) {
    return `
   <p>Click the link below to Verify your COLABS account</p>
   <a href="${link}">
        Verify Me
   </a>
`;
}
exports.verifyEmailFormat = verifyEmailFormat;
function forgotPasswordFormat(link) {
    return `
   <p>Click the link below to reset your COLABS account password</p>
   <a href="${link}">
        Reset Password
   </a>
`;
}
exports.forgotPasswordFormat = forgotPasswordFormat;
//# sourceMappingURL=mailFormats.js.map