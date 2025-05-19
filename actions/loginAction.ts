"use server";

import { signIn, signOut } from "../auth";

export const loginAction = async (values) => {
  const response = await signIn("credentials", {
    userId: values.userId,
    password: values.password,
    redirect: false,
  });

  return true;
};

export const actionLogout = async () => {
  await signOut({ redirectTo: "/login" });
};
