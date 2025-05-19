import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    identity?: number;
    accessToken?: string;
  }
  interface Session {
    user: {
      identity?: number;
      accessToken?: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

async function getAuthorize(params: { userId: string; password?: string }) {
  const { userId, password } = params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/Login`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        password,
      }),
    }
  );
  if (response.ok) {
    const token = await response.json();

    return { token, userId };
  }
  return null;
}

async function refreshAccessToken(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/RefreshToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw "Ocurrio un error al refrescar el token";

    const refreshedTokens = await response.json();

    return refreshedTokens;
  } catch (error) {
    console.error("Error al refrescar el token", error);
    return { token, error: "RefreshTokenError" };
  }
}

export async function logout(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/Logout`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Ocurrio un error");
  }

  return true;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        userId: {},
        password: {},
      },

      authorize: async (credentials) => {
        const { userId, password } = credentials as {
          userId: string;
          password: string;
        };

        const authorization = await getAuthorize({
          userId,
          password,
        });

        if (!authorization?.token) {
          throw new Error("Credenciales inválidas");
        }

        return {
          identity: Number(authorization.userId),
          accessToken: authorization.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.identity = user.identity;
      }

      return token;
    },

    async session({ session, token }) {
      const { identity, accessToken } = token as {
        identity: number;
        accessToken: { Token: string };
      };
      session.user = {
        ...session.user,
        identity,
        accessToken: accessToken.Token,
      };
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 60, // 5 min
  },
});
