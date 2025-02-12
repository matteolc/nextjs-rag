import clsx from "clsx";
import { upload } from "@vercel/blob/client";
import { CloudIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Progress } from "@/ui/progress";
import { Checkbox } from "@/ui/checkbox";

export const DragAndDropZone = ({
  namespace,
  onUploadComplete,
}: {
  namespace: string;
  onUploadComplete?: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<number>(0);
  const [keepInCloud, setKeepInCloud] = useState(true);

  const createBlob = useCallback(
    async (files: FileList) => {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        setProcessedFiles(0);
        const filesArray = Array.from(files);
        setUploadQueue(filesArray);

        const promises = filesArray.map(async (file) => {
          await upload(file.name, file, {
            access: "public",
            handleUploadUrl: `/upload?namespace=${namespace}`,
            clientPayload: JSON.stringify({ namespace, keepInCloud }),
            onUploadProgress: (progress) => {
              setUploadProgress(Math.round(progress.percentage));
            },
          });
          setProcessedFiles((prev) => prev + 1);
        });

        await Promise.all(promises);
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploading(false);
        setUploadQueue([]);
        onUploadComplete?.();
      }
    },
    [namespace, onUploadComplete, keepInCloud],
  );

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    await createBlob(files);
  };

  // Calculate both progress values
  const countProgress = (processedFiles / uploadQueue.length) * 100;
  const totalProgress =
    uploadQueue.length > 0 ? (countProgress + uploadProgress) / 2 : 0;

  return (
    <form>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="keepInCloud"
            checked={keepInCloud}
            onCheckedChange={(checked) => setKeepInCloud(checked === true)}
          />
          <label
            htmlFor="keepInCloud"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Keep files in cloud storage for later retrieval
          </label>
        </div>
        <div className="flex w-full items-center justify-center">
          <label
            htmlFor={"file-upload"}
            aria-disabled={isUploading}
            className={clsx(
              isUploading
                ? ""
                : "cursor-pointer hover:bg-accent hover:bg-opacity-10",
              "flex h-64 w-full flex-col items-center justify-center rounded-lg border-1 border-dashed border-primary/40 bg-accent bg-opacity-60",
            )}
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5 text-accent-foreground">
              {!isUploading ? (
                <>
                  <CloudIcon />
                  <p className="text-md mb-2">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs">Supports PDF files</p>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Progress value={totalProgress} className="h-2 w-full" />
                  <div className="text-center">
                    <p className="text-md mb-1">
                      Uploading {Math.round(totalProgress)}% ({processedFiles}{" "}
                      of {uploadQueue.length})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {processedFiles === uploadQueue.length
                        ? "Finalizing uploads..."
                        : "Processing files..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </label>
          <input
            id={"file-upload"}
            type="file"
            className="hidden"
            name={"file-upload"}
            multiple={true}
            onChange={handleChange}
            disabled={isUploading}
            accept="application/pdf"
          />
        </div>
      </div>
    </form>
  );
};
