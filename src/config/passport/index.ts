import { googleStategey, githubStategey } from './strategies';

const passportConfig = (passport: any) => {
  passport.use(googleStategey);
  passport.use(githubStategey);
};

export default passportConfig;
