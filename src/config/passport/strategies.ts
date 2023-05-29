import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  googleClientId,
  googleCallbackUrl,
  googleClientSecret,
  githubCallbackUrl,
  githubClientId,
  githubClientSecret,
} from '..';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as GithubStrategy, Profile as GithubProfile } from 'passport-github2';
import { Request } from '../../types';
import { findTypeofUser } from '../../utils/finder';

const googleStategey = new GoogleStrategy(
  {
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleCallbackUrl,
    scope: ['profile', 'email'],
    passReqToCallback: true,
  },
  async (req: Request, _accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
    const { type } = JSON.parse(req.query.state as string);
    const TargetUser = findTypeofUser(type);
    const newUser = await TargetUser.createWithGoogle(profile);
    if (newUser) {
      return done(null, newUser);
    } else {
      return done(null, false);
    }
  },
);

const githubStategey = new GithubStrategy(
  {
    clientID: githubClientId,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackUrl,
    passReqToCallback: true,
  },
  async (
    req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: GithubProfile & { emails: { value: string; type: string }[] },
    done: VerifyCallback,
  ) => {
    const { type } = JSON.parse(req.query.state as string);
    const TargetUser = findTypeofUser(type);
    const newUser = await TargetUser.createWithGithub(profile);
    if (newUser) {
      return done(null, newUser);
    } else {
      return done(null, false);
    }
  },
);

export { googleStategey, githubStategey };
