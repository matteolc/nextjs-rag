import { useEffect, useRef } from "react";

export default function Contenteditable({
  value,
  onChange,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  [key: string]:
    | string
    | number
    | ((value: string) => void)
    | ((event: React.KeyboardEvent<HTMLDivElement>) => void);
}) {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      contentEditableRef.current &&
      contentEditableRef.current?.textContent !== value
    ) {
      contentEditableRef.current.textContent = value;
      contentEditableRef.current.style.height = "auto";
      contentEditableRef.current.style.height = `${contentEditableRef.current.scrollHeight}px`;
    }
  }, [contentEditableRef, value]);

  return (
    <div
      contentEditable
      ref={contentEditableRef}
      onInput={(event) => {
        onChange((event.target as HTMLInputElement).textContent ?? "");
      }}
      {...props}
    />
  );
}
