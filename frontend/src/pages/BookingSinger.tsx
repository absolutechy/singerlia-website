import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router";
import { ArrowLeft, CalendarDays, MapPin, User, MessageSquare, CreditCard } from "lucide-react";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import DatePicker from "@/components/common/DatePicker";
import Textarea from "@/components/common/Textarea";
import RadioGroup from "@/components/common/RadioGroup";
import Checkbox from "@/components/common/Checkbox";
import Button from "@/components/common/Button";

// Zod validation schema
const bookingSchema = z.object({
  // Section 1: Event Date & Time
  eventDate: z.string().min(1, "Event date is required"),
  timeSlot: z.enum(["morning", "afternoon", "evening"], {
    message: "Please select a time slot",
  }),

  // Section 2: Event Details
  eventType: z.string().min(1, "Event type is required"),
  venueName: z.string().min(1, "Venue name is required"),
  venueAddress: z.string().min(1, "Venue address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  venueType: z.enum(["indoor", "outdoor"], {
    message: "Please select venue type",
  }),
  numberOfGuests: z.string().min(1, "Number of guests is required"),

  // Section 3: Your Information
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),

  // Section 4: Special Requirements & Message
  messageToSinger: z.string().optional(),
  specialSongRequests: z.string().optional(),
  equipment: z.enum(["provide", "singer-brings"], {
    message: "Please select equipment option",
  }),

  // Section 5: Review & Payment
  promoCode: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingSinger: React.FC = () => {
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);

  // Mock singer data (would come from API)
  const singerFee = 200;
  const platformFee = 20;
  const totalPrice = singerFee + platformFee;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const formValues = watch();

  const onSubmit = (data: BookingFormData) => {
    console.log("Form submitted:", data);
    setShowSummary(true);
    // Here you would integrate with Paytabs payment gateway
  };

  const eventTypeOptions = [
    { value: "wedding", label: "Wedding" },
    { value: "corporate", label: "Corporate Event" },
    { value: "birthday", label: "Birthday Party" },
    { value: "virtual", label: "Virtual Event" },
    { value: "other", label: "Other" },
  ];

  const countryOptions = [
    { value: "uk", label: "United Kingdom" },
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "other", label: "Other" },
  ];

  const guestOptions = [
    { value: "0-50", label: "0-50 guests" },
    { value: "51-100", label: "51-100 guests" },
    { value: "101-200", label: "101-200 guests" },
    { value: "201-500", label: "201-500 guests" },
    { value: "500+", label: "500+ guests" },
  ];

  const timeSlotOptions = [
    { value: "morning", label: "Morning (8:00 AM onwards)" },
    { value: "afternoon", label: "Afternoon (12:00 PM onwards)" },
    { value: "evening", label: "Evening (6:00 PM onwards)" },
  ];

  const venueTypeOptions = [
    { value: "indoor", label: "Indoor" },
    { value: "outdoor", label: "Outdoor" },
  ];

  const equipmentOptions = [
    { value: "provide", label: "I will provide a PA system (speakers, mic)" },
    { value: "singer-brings", label: "The singer needs to bring their own equipment" },
  ];

  if (showSummary) {
    return (
      <div className="custom-container py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setShowSummary(false)}
              className="inline-flex items-center gap-2 text-sm text-[#6F5D9E] hover:text-primary mb-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DEFF] text-primary bg-white">
                <ArrowLeft className="h-4 w-4" />
              </span>
              Back to Form
            </button>
            <h1 className="heading-2 text-[#2E1B4D]">Booking Summary</h1>
            <p className="text-[#6F5D9E] mt-2">Review your booking details before proceeding to payment</p>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E7DEFF] space-y-6">
            {/* Event Details */}
            <div>
              <h3 className="text-lg font-semibold text-[#2E1B4D] mb-3 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Event Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Date:</span>
                  <span className="text-[#2E1B4D] font-medium">{formValues.eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Time:</span>
                  <span className="text-[#2E1B4D] font-medium capitalize">{formValues.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Event Type:</span>
                  <span className="text-[#2E1B4D] font-medium capitalize">{formValues.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Guests:</span>
                  <span className="text-[#2E1B4D] font-medium">{formValues.numberOfGuests}</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#E7DEFF]" />

            {/* Venue Details */}
            <div>
              <h3 className="text-lg font-semibold text-[#2E1B4D] mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Venue Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Venue:</span>
                  <span className="text-[#2E1B4D] font-medium">{formValues.venueName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Address:</span>
                  <span className="text-[#2E1B4D] font-medium text-right max-w-xs">{formValues.venueAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">City:</span>
                  <span className="text-[#2E1B4D] font-medium">{formValues.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Type:</span>
                  <span className="text-[#2E1B4D] font-medium capitalize">{formValues.venueType}</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#E7DEFF]" />

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-semibold text-[#2E1B4D] mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Your Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Name:</span>
                  <span className="text-[#2E1B4D] font-medium">{formValues.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Email:</span>
                  <span className="text-[#2E1B4D] font-medium">{formValues.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Phone:</span>
                  <span className="text-[#2E1B4D] font-medium">{formValues.phoneNumber}</span>
                </div>
              </div>
            </div>

            {formValues.messageToSinger && (
              <>
                <div className="h-px bg-[#E7DEFF]" />
                <div>
                  <h3 className="text-lg font-semibold text-[#2E1B4D] mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Special Requests
                  </h3>
                  <p className="text-sm text-[#6F5D9E]">{formValues.messageToSinger}</p>
                </div>
              </>
            )}

            <div className="h-px bg-[#E7DEFF]" />

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-[#2E1B4D] mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Singer's Fee:</span>
                  <span className="text-[#2E1B4D] font-medium">${singerFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Platform Fee:</span>
                  <span className="text-[#2E1B4D] font-medium">${platformFee}</span>
                </div>
                {formValues.promoCode && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Code Applied:</span>
                    <span className="font-medium">{formValues.promoCode}</span>
                  </div>
                )}
                <div className="h-px bg-[#E7DEFF] my-2" />
                <div className="flex justify-between text-lg">
                  <span className="text-[#2E1B4D] font-bold">Total:</span>
                  <span className="text-[#2E1B4D] font-bold">${totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              variant="primary"
              className="w-full !h-14 text-base"
              onClick={() => {
                // Integrate with Paytabs payment gateway
                alert("Redirecting to secure payment gateway...");
              }}
            >
              Proceed to Secure Payment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-container pb-16">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-[#6F5D9E] hover:text-primary mb-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DEFF] text-primary bg-white">
              <ArrowLeft className="h-4 w-4" />
            </span>
            Back to Singer Details
          </button>
          <div className="text-center w-full">
          <h1 className="heading-2 text-[#2E1B4D]">Book Your Singer</h1>
          <p className="text-[#6F5D9E] mt-2">Fill in the details to complete your booking</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Event Date & Time */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E7DEFF]">
            <h2 className="heading-4 text-[#2E1B4D] mb-6 flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              Event Date & Time
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Controller
                name="eventDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Event Date"
                    placeholder="Select event date"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.eventDate?.message}
                  />
                )}
              />
              <div className="md:col-span-2">
                <Controller
                  name="timeSlot"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      label="Time Slot"
                      options={timeSlotOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.timeSlot?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Event Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E7DEFF]">
            <h2 className="heading-4 text-[#2E1B4D] mb-6 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Event Details
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Event Type"
                    options={eventTypeOptions}
                    placeholder="Select event type"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.eventType?.message}
                  />
                )}
              />
              <Controller
                name="numberOfGuests"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Number of Guests (Approximate)"
                    options={guestOptions}
                    placeholder="Select guest count"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.numberOfGuests?.message}
                  />
                )}
              />
              <div className="md:col-span-2">
                <Controller
                  name="venueName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Venue Name"
                      placeholder="Enter venue name"
                      {...field}
                      error={errors.venueName?.message}
                    />
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <Controller
                  name="venueAddress"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Venue Address"
                      placeholder="Street address"
                      {...field}
                      error={errors.venueAddress?.message}
                    />
                  )}
                />
              </div>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    label="City"
                    placeholder="Enter city"
                    {...field}
                    error={errors.city?.message}
                  />
                )}
              />
              <Controller
                name="postalCode"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Postal Code"
                    placeholder="Enter postal code"
                    {...field}
                    error={errors.postalCode?.message}
                  />
                )}
              />
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Country"
                    options={countryOptions}
                    placeholder="Select country"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.country?.message}
                  />
                )}
              />
              <div className="md:col-span-2">
                <Controller
                  name="venueType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      label="Venue Type"
                      options={venueTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.venueType?.message}
                      className="flex-row gap-6"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Your Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E7DEFF]">
            <h2 className="heading-4 text-[#2E1B4D] mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Your Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      {...field}
                      error={errors.fullName?.message}
                    />
                  )}
                />
              </div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    {...field}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...field}
                    error={errors.phoneNumber?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Section 4: Special Requirements & Message */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E7DEFF]">
            <h2 className="heading-4 text-[#2E1B4D] mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Special Requirements & Message
            </h2>
            <div className="space-y-6">
              <Controller
                name="messageToSinger"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="Message to the Singer"
                    placeholder="Share any special requests, event theme, dress code, or other details..."
                    rows={4}
                    {...field}
                    error={errors.messageToSinger?.message}
                  />
                )}
              />
              <Controller
                name="specialSongRequests"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="Special Song Requests"
                    placeholder='e.g., "First dance song," "Company anthem," etc.'
                    rows={3}
                    {...field}
                    error={errors.specialSongRequests?.message}
                  />
                )}
              />
              <Controller
                name="equipment"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    label="Equipment"
                    options={equipmentOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.equipment?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Section 5: Payment Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E7DEFF]">
            <h2 className="heading-4 text-[#2E1B4D] mb-6 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              Payment Details
            </h2>
            <div className="space-y-6">
              {/* Pricing Summary */}
              <div className="bg-[#F9F7FF] rounded-2xl p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6F5D9E]">Singer's Fee:</span>
                  <span className="text-[#2E1B4D] font-semibold">${singerFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6F5D9E]">Platform Fee:</span>
                  <span className="text-[#2E1B4D] font-semibold">${platformFee}</span>
                </div>
                <div className="h-px bg-[#E7DEFF]" />
                <div className="flex justify-between text-lg">
                  <span className="text-[#2E1B4D] font-bold">Total Price:</span>
                  <span className="text-primary font-bold">${totalPrice}</span>
                </div>
              </div>

              <Controller
                name="promoCode"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Promo Code (Optional)"
                    placeholder="Enter promo code"
                    {...field}
                    error={errors.promoCode?.message}
                  />
                )}
              />

              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="agreeToTerms"
                    label="I agree to the Terms & Conditions and Privacy Policy"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    error={errors.agreeToTerms?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="default"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Review Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingSinger;
