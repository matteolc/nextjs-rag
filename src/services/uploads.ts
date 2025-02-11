import type { SupabaseClient } from "@supabase/supabase-js";

export const deleteUploads = ({
  profileId,
  namespace,
  supabase,
}: {
  profileId: string;
  namespace: string;
  supabase: SupabaseClient;
}) => {
  return async (ids: string[]) => {
    if (!profileId) throw new Error("No profile ID provided");

    const { data, error } = await supabase
      .from("uploads")
      .delete()
      .eq("profile_id", profileId)
      .eq("namespace", namespace)
      .in("id", ids)
      .select("id");

    return { ids: data?.map((upload) => upload.id) ?? [], error };
  };
};

export const deleteAllUploads = ({
  profileId,
  namespace,
  supabase,
}: {
  profileId: string;
  namespace: string;
  supabase: SupabaseClient;
}) => {
  return async () => {
    if (!profileId) throw new Error("No profile ID provided");

    const { data, error } = await supabase
      .from("uploads")
      .delete()
      .eq("profile_id", profileId)
      .eq("namespace", namespace)
      .select("id");

    return { ids: data?.map((upload) => upload.id) ?? [], error };
  };
};

export const selectAllUploadNames = ({
  profileId,
  namespace,
  supabase,
}: {
  profileId: string;
  namespace: string;
  supabase: SupabaseClient;
}) => {
  return async () => {
    if (!profileId) throw new Error("No profile ID provided");

    const { data, error } = await supabase
      .from("uploads")
      .select("name")
      .eq("profile_id", profileId)
      .eq("namespace", namespace);

    return { names: data?.map((upload) => upload.name) ?? [], error };
  };
};

export const createUploads = ({
  profileId,
  namespace,
  supabase,
}: {
  profileId: string;
  namespace: string;
  supabase: SupabaseClient;
}) => {
  return async (files: File[], metadata: Record<string, string | null>[]) => {
    if (!profileId) throw new Error("No profile ID provided");

    const { data, error } = await supabase
      .from("uploads")
      .insert(
        files.map(({ size, name, type }, index) => ({
          size,
          name,
          type,
          namespace,
          profile_id: profileId,
          metadata: metadata[index],
        })),
      )
      .select("id");

    return { ids: data?.map((upload) => upload.id) ?? [], error };
  };
};
