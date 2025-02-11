import { forgotPasswordAction } from "@/actions/account-actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/ui/input";
import Link from "next/link";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Card } from "@/ui/card";
import { cn } from "@/lib/cn";
import { FormControl, FormFooter } from "@/ui/form";
import { FormLabel } from "@/ui/form";
import { FormField } from "@/ui/form";
import { FormFieldset } from "@/ui/form";

export default async function ForgotPassword(props: {
	searchParams: Promise<Message>;
}) {
	const searchParams = await props.searchParams;
	return (
		<>
			<div className={cn("flex flex-col gap-6")}>
				<Card className="border-border min-h-[410px]">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>
							Already have an account?{" "}
							<Link
								href="/sign-in"
								className="hover:underline underline-offset-4"
							>
								Sign in
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
							</FormFieldset>
							<FormMessage message={searchParams} />
							<FormFooter>
								<SubmitButton
									pendingText="Sending reset email..."
									formAction={forgotPasswordAction}
									className="w-full justify-center"
								>
									Reset Password
								</SubmitButton>
							</FormFooter>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
