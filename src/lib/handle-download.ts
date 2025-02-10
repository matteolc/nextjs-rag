export const handleDownload = async ({
  url,
  name,
  onError,
}: { url: string; name: string; onError: (error: Error) => void }) => {
  try {
    // Verify the URL exists before creating the link
    const response = await fetch(url);
    if (!response.ok) throw new Error("File not found");

    // Proceed with download
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
    onError(error as Error);
  }
};
