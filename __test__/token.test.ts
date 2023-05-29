import { verifyEmailFormat } from '../src/utils/mailFormats';

describe('General Test', () => {
  it('should return verify email formate', () => {
    const url = verifyEmailFormat('http://localhost:3000/verify');
    expect(url).toBeDefined();
  });
});
