const DEFAULT_SIZE = 0;

export function humanReadableFileSize(
  sizeInBytes: number,
  precision = 2,
): string {
  const fileSize = sizeInBytes ?? DEFAULT_SIZE;

  if (fileSize === 0) {
    return `${DEFAULT_SIZE} B`;
  }

  const units = ["B", "KB", "MB"];
  let unitIndex = 0;
  let size = fileSize;

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

export function humanReadableMIMEType(mimeType: string): string {
  return mimeType.split("/")[1].toUpperCase();
}
