export function verifyEmailFormat(link: string): string {
  return `
   <p>Click the link below to Verify your COLABS account</p>
   <a href="${link}">
        Verify Me
   </a>
`;
}

export function forgotPasswordFormat(link: string): string {
  return `
   <p>Click the link below to reset your COLABS account password</p>
   <a href="${link}">
        Reset Password
   </a>
`;
}
