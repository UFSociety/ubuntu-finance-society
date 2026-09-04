import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHero, Section } from "@/components/site-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ubuntu Finance Society" },
      {
        name: "description",
        content:
          "Tell us about your stokvel, burial society or lending pool and we will show you how Ubuntu Finance Society would keep its record.",
      },
      { property: "og:title", content: "Contact — Ubuntu Finance Society" },
      {
        property: "og:description",
        content: "Request a demo of Ubuntu Finance Society for your community financial group.",
      },
    ],
  }),
  component: ContactPage,
});

const groupOptions = [
  "Savings Stokvel",
  "Burial Society",
  "Emergency Fund",
  "Lending Pool",
  "Investment Club",
  "Rotational Savings Group",
  "Mutual Aid Group",
  "Other",
];

interface FormData {
  name: string;
  email: string;
  groupType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  groupType?: string;
}

function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    groupType: groupOptions[0],
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.groupType) {
      newErrors.groupType = "Please select a group type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSent(true);
      setFormData({ name: "", email: "", groupType: groupOptions[0], message: "" });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Show us how your group runs"
        intro="Send us the basics and we will come back with a walkthrough of the constitution, ledger and reports your group would have."
      />

      <Section>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft md:p-8">
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <span className="text-2xl">✓</span>
                </div>
                <h2 className="font-display text-xl font-semibold">Thank you!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your details are noted. We will be in touch about a walkthrough within 2 business days.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm font-semibold text-primary hover:underline"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form className="grid gap-5" onSubmit={handleSubmit}>
                {serverError && (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 text-sm text-red-700 dark:text-red-200">
                    {serverError}
                  </div>
                )}

                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`rounded-md border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring disabled:opacity-50 ${
                      errors.name
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-input bg-background"
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`rounded-md border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring disabled:opacity-50 ${
                      errors.email
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-input bg-background"
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="groupType" className="text-sm font-medium">
                    Type of group <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="groupType"
                    name="groupType"
                    value={formData.groupType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.groupType}
                    aria-describedby={errors.groupType ? "groupType-error" : undefined}
                    className={`rounded-md border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring disabled:opacity-50 ${
                      errors.groupType
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-input bg-background"
                    }`}
                  >
                    {groupOptions.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.groupType && (
                    <p id="groupType-error" className="text-xs text-red-600 dark:text-red-400">
                      {errors.groupType}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    How does your group currently keep records?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={5}
                    placeholder="E.g., 'We use a shared spreadsheet and meeting notes...'"
                    className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send enquiry"}
                </button>

                <p className="text-xs text-muted-foreground">
                  <strong>Privacy:</strong> We take data security seriously. Your information will only be used to contact you about a demo.
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Important:</strong> Please do not send banking details or payment instructions. Ubuntu Finance Society never receives, holds or moves member funds.
                </p>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-sand/60 p-6">
              <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What happens next
              </p>
              <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-semibold text-foreground">1.</span>
                  <span>We read how your group currently works.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-semibold text-foreground">2.</span>
                  <span>We map it to a constitution and ledger structure.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-semibold text-foreground">3.</span>
                  <span>We walk your committee through the record it would keep.</span>
                </li>
              </ol>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                A reminder
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Ubuntu Finance Society is software. Your group keeps its own bank account,
                makes its own decisions and moves its own money. We provide the record,
                the reporting and the governance tools.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
