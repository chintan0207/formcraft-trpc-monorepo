"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { cn } from "~/lib/utils";
import { useSignup } from "../hooks/api/auth";

import { Button } from "~/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),

    email: z.string().email("Please enter a valid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
    const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { createUserWithEmailAndPasswordAsync, error, isError, isSuccess, status } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await createUserWithEmailAndPasswordAsync({
        fullName: data.name,
        email: data.email,
        password: data.password,
      });

      if (response) {
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Full Name */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>

          <Input id="name" type="text" placeholder="John Doe" {...register("name")} />

          {errors.name && (
            <FieldDescription className="text-red-500">{errors.name.message}</FieldDescription>
          )}
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />

          {errors.email && (
            <FieldDescription className="text-red-500">{errors.email.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {errors.password && (
            <FieldDescription className="text-red-500">{errors.password.message}</FieldDescription>
          )}
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>

          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {errors.confirmPassword ? (
            <FieldDescription className="text-red-500">
              {errors.confirmPassword.message}
            </FieldDescription>
          ) : (
            <FieldDescription>Please confirm your password.</FieldDescription>
          )}
        </Field>

        {/* API Error */}
        {isError && (
          <FieldDescription className="text-center text-red-500">
            {error?.message || "Something went wrong"}
          </FieldDescription>
        )}

        {/* Success */}
        {isSuccess && (
          <FieldDescription className="text-center text-green-600">
            Account created successfully
          </FieldDescription>
        )}

        {/* Submit */}
        <Field>
          <Button type="submit" disabled={isSubmitting || status === "pending"} className="w-full">
            {status === "pending" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>

        {/* <FieldSeparator>Or continue with</FieldSeparator> */}

        {/* Github */}
        <Field>
          {/* <Button variant="outline" type="button" className="w-full">
            <Github className="size-4" />
            Sign up with GitHub
          </Button> */}

          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <a href="#" className="font-medium underline underline-offset-4">
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
