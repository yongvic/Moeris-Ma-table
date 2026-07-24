"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/infra/auth/auth";

export async function staffLoginAction(
  _prev: { error: boolean },
  formData: FormData,
): Promise<{ error: boolean }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/bo/menu",
    });
    return { error: false };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: true };
    }
    throw error;
  }
}
