"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { isValidEmail } from "@/lib/validation";

function problemWith(value: string) {
  if (!value.trim()) return "Enter your email address.";
  if (!isValidEmail(value))
    return "That doesn't look like an email address. Try name@example.com.";
  return null;
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Validate as you type only after the first check, so we don't nag mid-word.
  const [checked, setChecked] = useState(false);
  const [subscribed, setSubscribed] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = problemWith(email);
    setChecked(true);
    setError(problem);
    if (!problem) setSubscribed(email.trim());
  };

  return (
    <section
      aria-labelledby="newsletter-title"
      className="page-x pb-20 lg:pb-28"
    >
      <div className="grid gap-8 rounded-panel bg-brand px-6 py-10 text-white sm:px-10 md:grid-cols-[1.1fr_1fr] md:items-center md:py-14 lg:px-14">
        <div>
          <h2 id="newsletter-title" className="type-h2">
            New flavours and recipes, first.
          </h2>
          <p className="mt-3 max-w-[40ch] text-white/85">
            One email a month with a recipe and early access to new flavours.
            Unsubscribe any time.
          </p>
        </div>

        {subscribed ? (
          <p
            role="status"
            className="flex items-start gap-3 rounded-field bg-white/12 p-5 text-lg"
          >
            <CircleCheck
              aria-hidden
              className="mt-1 size-5 shrink-0 text-lite"
            />
            <span>
              You&apos;re subscribed. The next recipe goes to{" "}
              <strong>{subscribed}</strong>.
            </span>
          </p>
        ) : (
          <form noValidate onSubmit={submit}>
            <label htmlFor="newsletter-email" className="text-sm font-semibold">
              Email address
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (checked) setError(problemWith(event.target.value));
                }}
                onBlur={() => {
                  if (!email) return;
                  setChecked(true);
                  setError(problemWith(email));
                }}
                aria-invalid={Boolean(error)}
                aria-describedby="newsletter-error"
                className="h-12 min-w-0 flex-1 rounded-full bg-white px-5 text-ink placeholder:text-ink-soft aria-invalid:ring-2 aria-invalid:ring-lite"
              />
              <Button type="submit" variant="lite">
                Subscribe
              </Button>
            </div>
            <p
              id="newsletter-error"
              aria-live="polite"
              className="mt-2 flex min-h-6 items-center gap-2 text-sm font-semibold"
            >
              {error && (
                <>
                  <CircleAlert
                    aria-hidden
                    className="size-4 shrink-0 text-lite"
                  />
                  {error}
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
