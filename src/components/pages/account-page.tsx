"use client";

import { FormFooter } from "@/ui/form";
import { Heading, Paragraph, Subheading } from "@/ui/heading";
import { HeadingWrapper } from "@/ui/heading";
import { Input } from "@/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { useContext } from "react";
import { UserContext } from "@/hooks/user-context";
import { updateProfileAction } from "@/actions/account-actions";

export function AccountPage() {
  const profile = useContext(UserContext);

  if (!profile) {
    return null;
  }

  return (
    <>
      <HeadingWrapper>
        <Heading>Account</Heading>
      </HeadingWrapper>
      <form className="mx-auto flex flex-1 flex-col w-full gap-y-6">
        <div>
          <Subheading>Your Name</Subheading>
          <Paragraph>
            This is how you will be identified in the application.
          </Paragraph>
          <section className="mt-2 grid gap-x-8 gap-y-6 sm:grid-cols-4">
            <div>
              <Input
                aria-label="First name"
                name="first_name"
                id="first_name"
                placeholder="First name"
                autoComplete="given-name"
                defaultValue={profile.first_name ?? ""}
              />
            </div>
            <div>
              <Input
                aria-label="Last name"
                name="last_name"
                id="last_name"
                placeholder="Last name"
                autoComplete="family-name"
                defaultValue={profile.last_name ?? ""}
              />
            </div>
          </section>
        </div>

        <div>
          <Subheading>Email</Subheading>
          <Paragraph>
            This is how you will log in and receive important notifications.
          </Paragraph>

          <section className="mt-2 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <Input
                type="email"
                aria-label="Email"
                name="email"
                id="email"
                defaultValue={profile.email}
              />
            </div>
          </section>
        </div>

        <FormFooter className="justify-start">
          <SubmitButton formAction={updateProfileAction}>Save</SubmitButton>
        </FormFooter>
      </form>
    </>
  );
}
