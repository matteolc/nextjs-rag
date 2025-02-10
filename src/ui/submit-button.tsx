import { Button } from "./button";
import { Icons } from "./icons";

export function SubmitButton({
  children,
  isSubmitting,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { isSubmitting: boolean }) {
  return (
    <Button type="submit" {...props}>
      {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
