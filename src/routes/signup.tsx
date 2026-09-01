import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DaylyLogo } from "@/components/dayly/brand";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTimezones } from "@/lib/dayly/mock-data";
import { useAuth } from "@/lib/dayly/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Dayly account" },
      {
        name: "description",
        content:
          "Set up your Dayly household in a minute — capture anything, approve what the AI proposes, and keep every detail searchable.",
      },
      { property: "og:title", content: "Create your Dayly account" },
      {
        property: "og:description",
        content: "Register for Dayly and start organizing your household with AI you approve.",
      },
    ],
  }),
  component: SignUp,
});

type Errors = Partial<Record<string, string>>;

function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [timezone, setTimezone] = useState(mockTimezones[0] ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (fullName.trim().length < 2) next.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (phone && phone.replace(/\D/g, "").length < 7) next.phone = "Enter a valid phone number.";
    if (householdName.trim().length < 2) next.householdName = "Name your household.";
    if (!timezone) next.timezone = "Select your timezone.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords don't match.";
    if (!accepted) next.accepted = "Please accept the terms to continue.";
    return next;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        householdName: householdName.trim(),
        timezone,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        acceptedTerms: accepted,
      });
      toast.success("Welcome to Dayly", { description: "Your household is ready." });
      void navigate({ to: "/today" });
    } catch {
      setErrors({ form: "We couldn't create your account. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dayly-sunburst min-h-svh px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <DaylyLogo />
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A few details and your household is set up.
          </p>
        </div>

        <form
          className="mt-8 space-y-5 rounded-2xl border bg-card p-5 shadow-card"
          onSubmit={onSubmit}
          noValidate
        >
          <Field id="fullName" label="Full name" error={errors.fullName}>
            <Input
              id="fullName"
              autoComplete="name"
              placeholder="Joshua Adeyemi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={Boolean(errors.fullName)}
            />
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
          </Field>

          <Field id="phone" label="Phone (optional)" error={errors.phone}>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={Boolean(errors.phone)}
            />
          </Field>

          <Field id="householdName" label="Household name" error={errors.householdName}>
            <Input
              id="householdName"
              placeholder="The Adeyemi Household"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              aria-invalid={Boolean(errors.householdName)}
            />
            <p className="text-xs text-muted-foreground">
              Used to label shared tasks, events and memory.
            </p>
          </Field>

          <Field id="timezone" label="Timezone" error={errors.timezone}>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone" aria-invalid={Boolean(errors.timezone)}>
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>
              <SelectContent>
                {mockTimezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="password" label="Password" error={errors.password}>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            <p className="text-xs text-muted-foreground">At least 8 characters.</p>
          </Field>

          <Field id="confirm" label="Confirm password" error={errors.confirm}>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={Boolean(errors.confirm)}
            />
          </Field>

          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={accepted}
                onCheckedChange={(v) => setAccepted(v === true)}
                aria-invalid={Boolean(errors.accepted)}
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                I agree to the Terms of Service and Privacy Policy. Dayly proposes actions — I
                always approve them.
              </Label>
            </div>
            {errors.accepted ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {errors.accepted}
              </p>
            ) : null}
          </div>

          {errors.form ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {errors.form}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
