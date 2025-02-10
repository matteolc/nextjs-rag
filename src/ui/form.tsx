"use client";

import * as React from "react";
import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";
import { Label } from "@/ui/label";

// ------------------ Form Context ------------------
type FormContextType = {
	id: string;
	isRequired?: boolean;
};

const FormContext = React.createContext<FormContextType | null>(null);

const useFormContext = () => {
	const context = React.useContext(FormContext);
	if (!context) {
		throw new Error("Form components must be wrapped in a <FormField>");
	}
	return context;
};

// ------------------ Form Field ------------------
interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
	id?: string;
	name?: string;
	isRequired?: boolean;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
	({ id, name, isRequired, className, children, ...props }, ref) => {
		const generatedId = React.useId();
		const contextValue = React.useMemo(
			() => ({ id: id || generatedId, isRequired }),
			[id, generatedId, isRequired],
		);

		return (
			<div ref={ref} className={cn("space-y-1", className)} {...props}>
				<FormContext.Provider value={contextValue}>
					{children}
				</FormContext.Provider>
			</div>
		);
	},
);
FormField.displayName = "FormField";

// ------------------ Form Label ------------------
const FormLabel = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, children, ...props }, ref) => {
	const { id, isRequired } = useFormContext();

	return (
		<Label
			ref={ref}
			htmlFor={id}
			data-slot="label"
			{...props}
			className={cn(
				className,
				"select-none text-base/6 text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white",
				isRequired && "after:ml-0.5 after:text-red-500 after:content-['*']",
			)}
		>
			{children}
		</Label>
	);
});
FormLabel.displayName = "FormLabel";

// ------------------ Form Control ------------------
const FormControl = React.forwardRef<
	React.ElementRef<typeof Slot>,
	React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
	const { id } = useFormContext();

	return <Slot ref={ref} id={id} {...props} />;
});
FormControl.displayName = "FormControl";

// ------------------ Form Fieldset ------------------
const FormFieldset = React.forwardRef<
	HTMLFieldSetElement,
	React.HTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => {
	return (
		<fieldset ref={ref} className={cn("space-y-4", className)} {...props} />
	);
});
FormFieldset.displayName = "FormFieldset";

// ------------------ Form Error ------------------
const FormError = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { id } = useFormContext();

	return (
		<p
			ref={ref}
			id={`${id}-error`}
			className={cn("text-sm text-red-600 dark:text-red-500", className)}
			{...props}
		/>
	);
});
FormError.displayName = "FormError";

// ------------------ Form Footer ------------------
const FormFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn("flex justify-end py-4", className)}
			{...props}
		/>
	);
});
FormFooter.displayName = "FormFooter";

export {
	FormField,
	FormLabel,
	FormControl,
	FormFieldset,
	FormError,
	FormFooter,
};
