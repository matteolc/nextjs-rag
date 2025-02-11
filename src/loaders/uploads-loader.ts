import type { Tables } from "@/app/db.types";
import { workspaces } from "@/const/workspaces";
import { getTableParams } from "@/lib/table";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const loader = async (searchParams: URLSearchParams) => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return {
			error: "No user found",
			data: [],
			total: 0,
			page: 1,
			perPage: 10,
			profile: null,
		};
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("id, first_name, last_name")
		.eq("id", user.id)
		.single();
	if (!profile) {
		return {
			error: "No profile found",
			data: [],
			total: 0,
			page: 1,
			perPage: 10,
			profile: null,
		};
	}

	const { page, perPage, sort, order, filters } =
		await getTableParams(searchParams);
	const cookieStore = await cookies();
	const workspace = cookieStore.get("workspace")?.value || workspaces[0].id;

	if (!workspace) {
		return {
			error: "No workspace selected",
			data: [],
			total: 0,
			page,
			perPage,
			profile,
		};
	}

	const query = supabase
		.from("uploads")
		.select("*", { count: "exact" })
		.eq("profile_id", profile.id)
		.eq("namespace", workspace)
		.order("created_at", { ascending: false })
		.range((page - 1) * perPage, page * perPage - 1);

	if (sort && order) {
		query.order(sort as keyof Tables<"uploads">, {
			ascending: order === "asc",
		});
	}
	if (filters.length > 0) {
		for (const { id, value } of filters) {
			const column = id as keyof Tables<"uploads">;
			if (column === "name") {
				query.ilike(column, `%${value}%`);
			} else {
				query.ilike(column, `%${value}%`);
			}
		}
	}

	const { data: uploads, error, count } = await query;

	if (error) {
		return { error: error.message, data: [], total: 0, page, perPage, profile };
	}

	return {
		data: (uploads as Tables<"uploads">[]) ?? [],
		total: count ?? 0,
		page,
		perPage,
		profile: {
			...profile,
			email: user.email,
		},
	};
};
