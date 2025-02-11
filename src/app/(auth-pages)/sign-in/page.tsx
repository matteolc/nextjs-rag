import { signInAction } from "@/actions/account-actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { FormFooter } from "@/ui/form";
import { FormControl } from "@/ui/form";
import { FormField } from "@/ui/form";
import { FormLabel } from "@/ui/form";
import { cn } from "@/lib/cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { FormFieldset } from "@/ui/form";
import { Input } from "@/ui/input";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="border-border min-h-[410px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Sign in to your account.{" "}
            <Link
              href="/forgot-password"
              className="hover:underline underline-offset-4"
            >
              Forgot your password?
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
                    autoComplete="password"
                    formNoValidate
                  />
                </FormControl>
              </FormField>
              <FormMessage message={searchParams} />
            </FormFieldset>
            <FormFooter>
              <SubmitButton
                pendingText="Signing In..."
                formAction={signInAction}
                className="w-full justify-center"
              >
                Login
              </SubmitButton>
            </FormFooter>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
