import { Button } from "@/components/common";
import React from "react";

const ContactSection: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <div className="custom-container px-6 py-24 lg:px-24">
        <div className="mb-12 text-center">
          <h2 className="heading-1 text-primary">Contact Us</h2>
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
              <div className="relative">
                <select
                  id="topic"
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-4 text-base text-gray-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  defaultValue=""
                >
                  <option disabled value="">
                    Select an option
                  </option>
                  <option value="booking">Booking assistance</option>
                  <option value="support">Platform support</option>
                  <option value="partnership">Partnership inquiry</option>
                  <option value="other">Other</option>
                </select>
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
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-600"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-600"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-600"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 012 3456 789"
                  className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="company"
                  className="text-sm font-medium text-gray-600"
                >
                  Company Name
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Company Inc."
                  className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-600"
                >
                  Office Address (if applicable)
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="City, Country"
                  className="w-full border-b border-gray-300 bg-transparent pb-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-600"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Write your message..."
                className="w-full resize-none border-b border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
