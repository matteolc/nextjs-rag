import clsx from "clsx";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
} & React.ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

export function HeadingWrapper({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "mb-6 flex w-full flex-wrap items-end justify-between gap-4 py-2",
      )}
    />
  );
}

export function Heading({ className, level = 1, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        "text-3xl/8 font-semibold text-primary sm:text-2xl/8",
      )}
    />
  );
}

export function Subheading({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        "text-base/7 font-semibold text-primary sm:text-sm/6",
      )}
    />
  );
}

export function Paragraph({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      {...props}
      className={clsx(className, "text-sm/5 text-muted-foreground")}
    />
  );
}
