import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input, Select, Textarea } from "@/components/common";
import contactFormService from "@/api/services/contactFormService";
import { toast } from "sonner";
import { useLanguage, type TranslationKey } from "@/i18n/LanguageContext";

const TOPIC_VALUES = ["booking", "support", "signup", "partnership", "other"] as const;

const TOPIC_OPTIONS: { labelKey: TranslationKey; value: (typeof TOPIC_VALUES)[number] }[] = [
  { labelKey: "contact.topic.booking", value: "booking" },
  { labelKey: "contact.topic.support", value: "support" },
  { labelKey: "contact.topic.signup", value: "signup" },
  { labelKey: "contact.topic.partnership", value: "partnership" },
  { labelKey: "contact.topic.other", value: "other" },
];

// Company/Address are only required for partnership inquiries — the UI itself only shows
// these fields when that topic is selected (see the conditional render below).
const contactSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required").max(50, "First name must be 50 characters or less"),
    lastName: z.string().trim().min(2, "Last name is required").max(50, "Last name must be 50 characters or less"),
    email: z.string().trim().max(100, "Email must be 100 characters or less").email("Invalid email address"),
    phone: z
      .string()
      .trim()
      .min(7, "Valid phone number is required")
      .max(20, "Phone number must be 20 characters or less")
      .regex(/^[0-9+\-\s]+$/, "Invalid phone number"),
    company: z.string().trim().max(100, "Company name must be 100 characters or less").optional(),
    address: z.string().trim().max(100, "Address must be 100 characters or less").optional(),
    topic: z.enum(TOPIC_VALUES, { message: "Please select a topic" }),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be 2000 characters or less"),
  })
  .superRefine((data, ctx) => {
    if (data.topic === "partnership") {
      if (!data.company?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["company"],
          message: "Company name is required for partnership inquiries",
        });
      }
      if (!data.address?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["address"],
          message: "Office address is required for partnership inquiries",
        });
      }
    }
  });

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      topic: "" as ContactFormValues["topic"],
      message: "",
    },
  });

  const topic = watch("topic");
  const topicOptions = TOPIC_OPTIONS.map((option) => ({
    label: t(option.labelKey),
    value: option.value,
  }));

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await contactFormService.submitContactForm(data);
      toast.success(t("contact.sent"));
      reset();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || t("contact.failed");
      toast.error(message);
    }
  };

  return (
    <div className="custom-container px-6 ">
      <div className="mb-12 text-center">
        <h2 className="font-bold text-4xl lg:text-6xl text-primary">{t("contact.title")}</h2>
        <p className="mt-2 text-sm font-medium text-[#7C6AA6]">
          {t("contact.subtitle")}
        </p>
      </div>
      <div className="rounded-[32px] border border-[#ECE3FF] bg-[#FCFBFF] p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <Select
                label={t("contact.topicLabel")}
                options={topicOptions}
                placeholder={t("contact.selectOption")}
                value={field.value}
                onChange={field.onChange}
                error={errors.topic?.message}
                className="w-full rounded-xl border border-gray-200 bg-[#FCFBFF] px-4 py-4 text-base text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  label={t("contact.firstName")}
                  placeholder="John"
                  className="w-full !rounded-none border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                  {...field}
                  error={errors.firstName?.message}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  label={t("contact.lastName")}
                  placeholder="Doe"
                  className="w-full !rounded-none border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                  {...field}
                  error={errors.lastName?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  label={t("contact.email")}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full !rounded-none border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                  {...field}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  label={t("contact.phone")}
                  type="tel"
                  placeholder="+1 012 3456 789"
                  className="w-full !rounded-none border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                  {...field}
                  error={errors.phone?.message}
                />
              )}
            />
            {/* Company/Address only apply to partnership inquiries */}
            {topic === "partnership" && (
              <>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label={t("contact.company")}
                      placeholder="Company Inc."
                      className="w-full !rounded-none border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                      {...field}
                      error={errors.company?.message}
                    />
                  )}
                />
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label={t("contact.address")}
                      placeholder="City, Country"
                      className="w-full !rounded-none border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                      {...field}
                      error={errors.address?.message}
                    />
                  )}
                />
              </>
            )}
          </div>

          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Textarea
                label={t("contact.message")}
                placeholder={t("contact.messagePlaceholder")}
                rows={5}
                className="w-full h-40 border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 rounded-md focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-300"
                {...field}
                error={errors.message?.message}
              />
            )}
          />

          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              size="large"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 col-span-2"
            >
              <p className="font-medium">{isSubmitting ? t("contact.sending") : t("home.sendMessage")}</p>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
