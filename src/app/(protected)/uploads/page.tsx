import { UploadsPage } from "@/components/pages/uploads-page";
import { loader } from "@/loaders/uploads-loader";

export default async function Screen(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = new URLSearchParams(
    (await props.searchParams) as Record<string, string>,
  );

  const { data, total, page, perPage, profile } = await loader(searchParams);
  return (
    <UploadsPage
      data={data}
      total={total}
      page={page}
      perPage={perPage}
      profileId={profile?.id}
    />
  );
}
