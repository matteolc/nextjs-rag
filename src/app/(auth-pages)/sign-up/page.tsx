import { signUpAction } from "@/actions/account-actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/ui/input";
import Link from "next/link";
import { FormControl, FormLabel } from "@/ui/form";
import { FormField } from "@/ui/form";
import { FormFieldset } from "@/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { FormFooter } from "@/ui/form";
import { cn } from "@/lib/cn";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <div className={cn("flex flex-col gap-6")}>
        <Card className="border-border min-h-[410px]">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Create a new account.{" "}
              <Link
                href="/sign-in"
                className="hover:underline underline-offset-4"
              >
                Already have an account? Sign in instead.
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FormFieldset>
                <FormField name="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      name="email"
                      type="email"
                      autoComplete="email"
                      formNoValidate
                    />
                  </FormControl>
                </FormField>

                <FormField name="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                </FormField>
              </FormFieldset>
              <FormMessage message={searchParams} />

              <FormFooter>
                <SubmitButton
                  className="w-full justify-center"
                  formAction={signUpAction}
                  pendingText="Signing up..."
                >
                  Create Account
                </SubmitButton>
              </FormFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
