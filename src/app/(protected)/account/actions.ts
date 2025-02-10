"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { z } from "zod";

export const action = async (formData: FormData) => {
  const values = Object.fromEntries(formData);
  const parsed = z
    .object({
      first_name: z.string().min(3, "First name must be at least 3 characters"),
      last_name: z.string().min(3, "Last name must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
    })
    .safeParse(values);

  if (!parsed.success) {
    return encodedRedirect(
      "error",
      "/account",
      parsed.error.format()._errors.join(", "),
    );
  }

  const { first_name, last_name, email } = parsed.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/account", "User not found");
  }

  await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
    })
    .eq("id", user.id);

  const shouldUpdateUserEmail = email !== user?.email;
  if (shouldUpdateUserEmail) {
    await supabase.auth.updateUser({ email });
  }

  return encodedRedirect("success", "/account", "Account updated successfully");
};
