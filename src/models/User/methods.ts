import { IUserDocument, IUserModel } from 'src/types';
import generateToken from '../../utils/generateToken';
import bcrypt from 'bcryptjs';
import { Profile } from 'passport-google-oauth20';
import { Profile as GithubProfile } from 'passport-github2';

const modelMethods = {
  /**
   *
   * @param this
   * @param enteredPassword
   * @returns bool
   */
  async matchPassword(this: IUserDocument, enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  /**
   *
   * @param this
   * @returns
   */
  async cleanUser(this: IUserDocument) {
    const user = this.toObject();
    user.id = user._id;
    delete user._id;
    delete user.password;
    delete user.__v;
    delete user.createdAt;
    delete user.updatedAt;

    return user;
  },
};

const staticMethods = {
  /**
   *
   * @param this
   * @param password
   * @param email
   * @returns
   */
  async authUser(this: IUserModel, password: string, email: string) {
    const user = await this.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const cleanUser = await user.cleanUser();
      return { ...cleanUser, token: generateToken(user._id) };
    } else {
      throw new Error('Invalid email or password');
    }
  },

  async createWithGoogle(this: IUserModel, profile: Profile) {
    try {
      const exitUser = await this.findOne({ email: profile._json.email });
      let cleanUser;
      if (exitUser) {
        cleanUser = await exitUser.cleanUser();
      } else {
        const user = await this.create({
          firstName: profile.displayName,
          lastName: profile._json.family_name,
          email: profile._json.email,
          imageUrl: profile._json.picture,
          googleId: profile._json.sub,
          emailVerified: true,
        });
        cleanUser = await user.cleanUser();
      }

      return { ...cleanUser, token: generateToken(cleanUser.id) };
    } catch (err) {
      throw new Error(err);
    }
  },

  async createWithGithub(this: IUserModel, profile: GithubProfile & { emails: { value: string; type: string }[] }) {
    try {
      const email = profile?.emails[0]?.value;
      const exitUser = await this.findOne({ email });
      let cleanUser;
      if (exitUser) {
        cleanUser = await exitUser.cleanUser();
      } else {
        const user = await this.create({
          email,
          firstName: profile.displayName,
          lastName: profile?.name?.familyName,
          emailVerified: true,
        });
        cleanUser = await user.cleanUser();
      }

      return { ...cleanUser, token: generateToken(cleanUser.id) };
    } catch (err) {
      throw new Error(err);
    }
  },
};

export { modelMethods, staticMethods };
