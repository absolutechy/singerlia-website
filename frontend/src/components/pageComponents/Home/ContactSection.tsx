import { Button, Input, Select } from "@/components/common";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";

const fields = [
  { id: "firstName", label: "First Name", type: "text", placeholder: "John" },
  { id: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "john@example.com",
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 012 3456 789",
  },
  {
    id: "company",
    label: "Company Name",
    type: "text",
    placeholder: "Company Inc.",
  },
  {
    id: "address",
    label: "Office Address (if applicable)",
    type: "text",
    placeholder: "City, Country",
  },
];

const ContactSection: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <div className="custom-container px-6 py-10 lg:py-24 lg:px-24">
        <div className="mb-12 text-center">
          <h2 className="font-bold text-4xl lg:text-6xl text-primary">
            Contact Us
          </h2>
          <p className="mt-2 text-sm font-medium text-[#7C6AA6]">
            Need help? Any question? Fill out the form and our team will reach
            out to you soon.
          </p>
        </div>
        <div className="rounded-[32px] border border-[#ECE3FF] bg-[#FCFBFF] p-8 shadow-lg">
          <form className="space-y-8">
            <div>
              <label
                htmlFor="topic"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                How can we help you*
              </label>
              <div className="relative z-10">
                <Select
                  options={[
                    { label: "Booking assistance", value: "booking" },
                    { label: "Platform support", value: "support" },
                    { label: "Partnership inquiry", value: "partnership" },
                    { label: "Other", value: "other" },
                  ]}
                  placeholder="Select an option"
                  className="w-full rounded-xl border border-gray-200 bg-[#FCFBFF] px-4 py-4 text-base text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fields.map((field) => (
                <div className="space-y-2" key={field.id}>
                  <Input
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full !rounded-none border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-600"
              >
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Write your message..."
                className={cn(
                  "w-full h-40 border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 rounded-md",
                  "focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-300"
                )}
              />
            </div>

            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                size="large"
                type="button"
                className="flex items-center gap-2 col-span-2"
              >
                <p className="font-medium">Send Message</p>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
