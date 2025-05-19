"use server";

import { signIn, signOut } from "../auth";
import { signInSchema } from "../lib/zod";
import { z } from "zod";

export const loginAction = async (values: z.infer<typeof signInSchema>) => {
  // try {
  const response = await signIn("credentials", {
    userId: values.userId,
    password: values.password,
    redirect: false,
    // callbackUrl: "/",
  });

  return true;
};

export const actionLogout = async () => {
  await signOut({ redirectTo: "/login" });
};
