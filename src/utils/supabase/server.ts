import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/utils/env.server";
import type { Database } from "@/app/db.types";

export const createClient = async () => {
	const cookieStore = await cookies();

	return createServerClient<Database>(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch (error) {
						// The `set` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
};
