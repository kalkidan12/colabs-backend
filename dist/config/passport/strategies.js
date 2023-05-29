"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubStategey = exports.googleStategey = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const __1 = require("..");
const passport_github2_1 = require("passport-github2");
const finder_1 = require("../../utils/finder");
const googleStategey = new passport_google_oauth20_1.Strategy({
    clientID: __1.googleClientId,
    clientSecret: __1.googleClientSecret,
    callbackURL: __1.googleCallbackUrl,
    scope: ['profile', 'email'],
    passReqToCallback: true,
}, async (req, _accessToken, _refreshToken, profile, done) => {
    const { type } = JSON.parse(req.query.state);
    const TargetUser = (0, finder_1.findTypeofUser)(type);
    const newUser = await TargetUser.createWithGoogle(profile);
    if (newUser) {
        return done(null, newUser);
    }
    else {
        return done(null, false);
    }
});
exports.googleStategey = googleStategey;
const githubStategey = new passport_github2_1.Strategy({
    clientID: __1.githubClientId,
    clientSecret: __1.githubClientSecret,
    callbackURL: __1.githubCallbackUrl,
    passReqToCallback: true,
}, async (req, _accessToken, _refreshToken, profile, done) => {
    const { type } = JSON.parse(req.query.state);
    const TargetUser = (0, finder_1.findTypeofUser)(type);
    const newUser = await TargetUser.createWithGithub(profile);
    if (newUser) {
        return done(null, newUser);
    }
    else {
        return done(null, false);
    }
});
exports.githubStategey = githubStategey;
//# sourceMappingURL=strategies.js.map