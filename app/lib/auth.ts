// import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import { compare } from 'bcrypt-ts';
// import { getUser } from 'app/db';
// import { authConfig } from 'app/auth.config';

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       async authorize({ email, password }: any) {
//         let user = await getUser(email);
//         if (user.length === 0) return null;
//         let passwordsMatch = await compare(password, user[0].password!);
//         if (passwordsMatch) return user[0] as any;
//       },
//     }),
//   ],
// });

export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  };
  
  export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };
  
  export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };