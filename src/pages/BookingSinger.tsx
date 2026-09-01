import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  User,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import DatePicker from "@/components/common/DatePicker";
import Textarea from "@/components/common/Textarea";
import RadioGroup from "@/components/common/RadioGroup";
import Checkbox from "@/components/common/Checkbox";
import Button from "@/components/common/Button";
import authService from "@/api/services/authService";
import bookingService from "@/api/services/bookingService";
import paymentService from "@/api/services/paymentService";
import unavailabilityService, { type UnavailabilityRecord } from "@/api/services/unavailabilityService";
import singerService, { type Singer } from "@/api/services/singerService";
import eventCategoryService, { type EventCategory } from "@/api/services/eventCategoryService";
import HyperPayWidget from "@/components/pageComponents/BookingSinger/HyperPayWidget";
import { toast } from "sonner";

// Zod validation schema
const bookingSchema = z.object({
  // Section 1: Event Date & Time
  eventDate: z.string().min(1, "Event date is required"),
  timeSlot: z.enum(["morning", "afternoon", "evening"], {
    message: "Please select a time slot",
  }),

  // Section 2: Event Details
  // Holds the selected event category's categoryId (e.g. "weddings") — see eventCategoryService.
  eventType: z.string().trim().min(1, "Event type is required"),
  venueName: z.string().trim().min(1, "Venue name is required").max(100, "Venue name must be 100 characters or less"),
  venueAddress: z.string().trim().min(1, "Venue address is required").max(100, "Venue address must be 100 characters or less"),
  city: z.string().trim().min(1, "City is required").max(50, "City must be 50 characters or less"),
  postalCode: z.string().trim().min(1, "Postal code is required").max(16, "Postal code must be 16 characters or less"),
  venueType: z.enum(["indoor", "outdoor"], {
    message: "Please select venue type",
  }),
  numberOfGuests: z.string().min(1, "Number of guests is required"),

  // Section 3: Your Information
  fullName: z.string().trim().min(2, "Full name is required").max(100, "Full name must be 100 characters or less"),
  email: z.string().trim().max(100, "Email must be 100 characters or less").email("Invalid email address"),
  phoneNumber: z.string().trim().min(10, "Valid phone number is required").max(30, "Phone number must be 30 characters or less"),

  // Section 4: Special Requirements & Message
  messageToSinger: z.string(),
  specialSongRequests: z.string(),
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

interface LocationState {
  preFilledEventDate?: string;
  preFilledTimeSlot?: string;
  preFilledEventCategory?: string;
  singerId?: string;
}

const BookingSinger: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<string>("");
  const [unavailability, setUnavailability] = useState<UnavailabilityRecord[]>([]);
  const [integrity, setIntegrity] = useState<string | null>(null); // SRI hash for PCI DSS 4.x
  const [, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [singer, setSinger] = useState<Singer | null>(null);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [bookingTotalAmount, setBookingTotalAmount] = useState<number | null>(null);
  const [priceConfirmed, setPriceConfirmed] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string>("");

  const currentUser = authService.getCurrentUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventDate: state?.preFilledEventDate || "",
      timeSlot:
        ((state?.preFilledTimeSlot as "morning" | "afternoon" | "evening") ||
        "") as BookingFormData["timeSlot"],
      eventType: state?.preFilledEventCategory || "",
      venueName: "",
      venueAddress: "",
      city: "",
      postalCode: "",
      venueType: "" as BookingFormData["venueType"],
      numberOfGuests: "",
      fullName: currentUser?.name || "",
      email: "",
      phoneNumber: "",
      messageToSinger: "",
      specialSongRequests: "",
      equipment: "" as BookingFormData["equipment"],
      promoCode: "",
      agreeToTerms: false,
    },
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/auth/login");
    }
  }, [navigate]);

  // Fetch singer data and unavailability
  useEffect(() => {
    const fetchSingerData = async () => {
      if (state?.singerId) {
        try {
          // Fetch singer profile with pricing
          const singerData = await singerService.getSingerById(state.singerId);
          if (singerData) {
            setSinger(singerData);
          }
          
          // Fetch unavailability
          const data = await unavailabilityService.getSingerUnavailability(state.singerId);
          setUnavailability(data.unavailability);
        } catch (err) {
          console.error("Failed to fetch singer data:", err);
          // Don't block booking if fetch fails
        }
      }
    };
    fetchSingerData();
  }, [state?.singerId]);

  // Fetch the admin-managed event category list (used to render the Event Type dropdown with
  // real labels instead of the old hardcoded options).
  useEffect(() => {
    eventCategoryService
      .getAllEventCategories()
      .then((res) => setEventCategories(res.categories || []))
      .catch((err) => console.error("Failed to fetch event categories:", err));
  }, []);

  // Fetch user profile to get email and phone number
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await authService.checkAuth();
        console.log('BookingSinger - Profile from checkAuth:', profile);

        // Update localStorage with complete user profile
        const existingUser = authService.getCurrentUser();
        console.log('BookingSinger - Existing user from localStorage:', existingUser);

        const updatedUser = {
          ...existingUser,
          name: profile.name || existingUser?.name,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
        };
        console.log('BookingSinger - Updated user to store:', updatedUser);

        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log('BookingSinger - User stored in localStorage:', localStorage.getItem("user"));

        // Update form fields with all user information
        console.log('BookingSinger - Setting form values. Name:', profile.name, 'Email:', profile.email, 'Phone:', profile.phoneNumber);

        // Always set fullName (use profile or existing user name)
        const fullNameToSet = profile.name || currentUser?.name || '';
        if (fullNameToSet) {
          setValue("fullName", fullNameToSet);
          console.log('BookingSinger - Name setValue called with:', fullNameToSet);
        }

        // Set email if available
        if (profile.email) {
          setValue("email", profile.email);
          console.log('BookingSinger - Email setValue called with:', profile.email);
        } else {
          console.log('BookingSinger - No email found in profile');
        }

        // Set phone if available
        if (profile.phoneNumber) {
          setValue("phoneNumber", profile.phoneNumber);
          console.log('BookingSinger - Phone setValue called with:', profile.phoneNumber);
        } else {
          console.log('BookingSinger - No phoneNumber found in profile');
        }

        console.log('BookingSinger - Final form values after setting:', {
          fullName: profile.name,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (authService.isAuthenticated()) {
      fetchUserProfile();
    }
  }, [setValue]);

  // Helper function to convert time slot to API format
  const convertTimeSlotToAPI = (timeSlot: string): string => {
    const timeSlotMap: Record<string, string> = {
      morning: "8:00 AM - 12:00 PM",
      afternoon: "12:00 PM - 6:00 PM",
      evening: "6:00 PM - 12:00 AM",
    };
    return timeSlotMap[timeSlot] || timeSlot;
  };

  // Check if date is fully unavailable
  const isDateFullyUnavailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    const unavailableSlotsForDate = unavailability.filter(record => record.date === dateStr);
    return unavailableSlotsForDate.length === 3;
  };

  // Get unavailable slots for the selected date
  const getUnavailableSlotsForDate = (dateStr: string): string[] => {
    return unavailability
      .filter(record => record.date === dateStr)
      .map(record => record.timeSlot);
  };

  // Helper function to convert equipment selection to API format
  const convertEquipmentToAPI = (equipment: string): string[] => {
    if (equipment === "provide") {
      return ["Sound System", "Microphone", "Lighting"];
    } else {
      return ["Singer brings own equipment"];
    }
  };

  const formValues = watch();

  console.log(formValues);

  // Clear time slot if it becomes unavailable when date changes
  useEffect(() => {
    if (formValues.eventDate && formValues.timeSlot) {
      const unavailableSlots = getUnavailableSlotsForDate(formValues.eventDate);
      if (unavailableSlots.includes(formValues.timeSlot)) {
        setValue('timeSlot', "" as BookingFormData["timeSlot"]);
      }
    }
  }, [formValues.eventDate, unavailability, formValues.timeSlot, setValue]);

  const slotDurationMap: Record<string, number> = {
    morning: 4,   // 8:00 AM - 12:00 PM
    afternoon: 6, // 12:00 PM - 6:00 PM
    evening: 6,   // 6:00 PM - 12:00 AM
  };
  const duration = slotDurationMap[formValues.timeSlot] || 1;
  // Price is category-specific, not a flat base price — reactive to the selected Event Type
  // (formValues.eventType holds the category's categoryId; see eventCategoryOptions below).
  const selectedCategory = eventCategories.find((c) => c.categoryId === formValues.eventType);
  const baseFee = (formValues.eventType && singer?.categoryPricing?.[formValues.eventType]?.price) || 0;
  const totalPrice = baseFee;

  // Fetch HyperPay checkout when summary is shown
  useEffect(() => {
    console.log("[Payment] useEffect triggered. showSummary:", showSummary, "bookingId:", bookingId);
    
    if (!showSummary || !bookingId) {
      console.log("[Payment] Exiting early - conditions not met");
      return;
    }

    let cancelled = false;

    const fetchCheckout = async () => {
      setPaymentLoading(true);
      setPaymentError(null);
      setCheckoutId("");
      setIntegrity(null);

      try {
        console.log("[Payment] Requesting checkout for bookingId:", bookingId);
        const response = await paymentService.prepareCheckout(bookingId);
        console.log("[Payment] Checkout response:", response);

        if (cancelled) return;

        if (response?.checkoutId && response?.integrity) {
          setCheckoutId(response.checkoutId);
          setIntegrity(response.integrity);
          if (response.amount) {
            setBookingTotalAmount(typeof response.amount === 'string' ? parseFloat(response.amount) : response.amount);
          }
          console.log("[Payment] SRI integrity hash received (PCI DSS 4.x compliant)");
        } else {
          setPaymentError("Invalid checkout response from server.");
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error("[Payment] Checkout error:", err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to initialize payment. Please try again.";
        setPaymentError(message);
        toast.error(message);
      } finally {
        if (!cancelled) {
          setPaymentLoading(false);
        }
      }
    };

    fetchCheckout();

    return () => {
      cancelled = true;
    };
  }, [showSummary, bookingId]);

  const retryCheckout = async () => {
    if (!bookingId) return;
    setPaymentLoading(true);
    setPaymentError(null);
    setCheckoutId("");
    setIntegrity(null);

    try {
      console.log("[Payment] Retrying checkout for bookingId:", bookingId);
      const response = await paymentService.prepareCheckout(bookingId);
      console.log("[Payment] Retry response:", response);

      if (response?.checkoutId && response?.integrity) {
        setCheckoutId(response.checkoutId);
        setIntegrity(response.integrity);
        if (response.amount) {
          setBookingTotalAmount(typeof response.amount === 'string' ? parseFloat(response.amount) : response.amount);
        }
        console.log("[Payment] SRI integrity hash received (PCI DSS 4.x compliant)");
      } else {
        setPaymentError("Invalid checkout response from server.");
      }
    } catch (err: any) {
      console.error("[Payment] Retry error:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to initialize payment. Please try again.";
      setPaymentError(message);
      toast.error(message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const onSubmit = async (data: BookingFormData): Promise<void> => {
    console.log("Form submitted with data:", data);
    setLoading(true);
    setError("");

    try {
      // Get current user for singer ID (or use pre-filled singer ID from navigation state)
      const currentUser = authService.getCurrentUser();

      if (!currentUser) {
        setError("User authentication failed. Please login again.");
        toast.error("User authentication failed. Please login again.");
        setLoading(false);
        return;
      }

      // If singerId is not pre-filled from navigation state, we need it
      // For testing purposes, use a default singer ID if not provided
      const singerId = state?.singerId || "49344b6f-1afc-49fb-a858-34b482ca1400";

      console.log("Using singerId:", singerId);

      // Create booking data object matching API requirements
      const bookingData = {
        singerId,
        eventDate: data.eventDate,
        timeSlot: convertTimeSlotToAPI(data.timeSlot),
        // data.eventType holds the selected category's categoryId (see eventCategoryOptions) —
        // the backend resolves and locks the singer's price for it at submission time.
        eventCategory: data.eventType,
        venueName: data.venueName,
        venueAddress: data.venueAddress,
        city: data.city,
        postalCode: data.postalCode,
        venueType: data.venueType.charAt(0).toUpperCase() + data.venueType.slice(0),
        numberOfGuests: data.numberOfGuests,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        messageToSinger: data.messageToSinger || "",
        specialSongRequests: data.specialSongRequests || "",
        equipment: convertEquipmentToAPI(data.equipment),
        promoCode: data.promoCode || "",
        agreeToTerms: data.agreeToTerms,
      };

      console.log("Submitting booking:", bookingData);
      toast.info("Creating booking...");

      // Call booking API
      const response = await bookingService.createBooking(bookingData);

      console.log("Booking created successfully:", response);
      console.log("Booking ID from response:", response.bookingId);
      console.log("Full response keys:", Object.keys(response));
      toast.success("Booking created successfully!");

      // Store booking ID and confirmed total for payment processing
      setBookingId(response.bookingId);
      if (response.totalAmount !== undefined) {
        setBookingTotalAmount(response.totalAmount);
      }
      localStorage.setItem("currentBookingId", response.bookingId);

      // Show summary after successful booking creation
      setShowSummary(true);
    } catch (err: any) {
      console.error("Booking error:", err);
      console.error("Error response:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create booking. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Only offer event categories this singer has actually priced — otherwise the price couldn't
  // be resolved at booking-request submission (see createBookingHandler on the backend).
  const eventTypeOptions = eventCategories
    .filter((category) => singer?.categoryPricing?.[category.categoryId]?.price)
    .map((category) => ({ value: category.categoryId, label: category.label }));

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

  // Filter time slots based on selected date and unavailability
  const availableTimeSlotOptions = React.useMemo(() => {
    if (!formValues.eventDate) return timeSlotOptions;
    
    const unavailableSlots = getUnavailableSlotsForDate(formValues.eventDate);
    return timeSlotOptions.filter(
      option => !unavailableSlots.includes(option.value as 'morning' | 'afternoon' | 'evening')
    );
  }, [formValues.eventDate, unavailability]);

  const venueTypeOptions = [
    { value: "indoor", label: "Indoor" },
    { value: "outdoor", label: "Outdoor" },
  ];

  const equipmentOptions = [
    { value: "provide", label: "I will provide a PA system (speakers, mic)" },
    {
      value: "singer-brings",
      label: "The singer needs to bring their own equipment",
    },
  ];

  if (showSummary) {
    return (
      <div className="custom-container py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col lg:flex-row">
            <button
              onClick={() => setShowSummary(false)}
              className="inline-flex items-center gap-2 text-sm text-[#6F5D9E] hover:text-primary mb-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DEFF] text-primary bg-white">
                <ArrowLeft className="h-4 w-4" />
              </span>
              Back to Form
            </button>
            <div className="w-full text-center">
              <h1 className="heading-2 text-[#2E1B4D]">Booking Summary</h1>
              <p className="text-[#6F5D9E] mt-2">
                Review your booking details before proceeding to payment
              </p>
            </div>
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
                  <span className="text-[#2E1B4D] font-medium">
                    {formValues.eventDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Time:</span>
                  <span className="text-[#2E1B4D] font-medium capitalize">
                    {formValues.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Event Type:</span>
                  <span className="text-[#2E1B4D] font-medium capitalize">
                    {formValues.eventType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Guests:</span>
                  <span className="text-[#2E1B4D] font-medium">
                    {formValues.numberOfGuests}
                  </span>
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
                  <span className="text-[#2E1B4D] font-medium">
                    {formValues.venueName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Address:</span>
                  <span className="text-[#2E1B4D] font-medium text-right max-w-xs">
                    {formValues.venueAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">City:</span>
                  <span className="text-[#2E1B4D] font-medium">
                    {formValues.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Type:</span>
                  <span className="text-[#2E1B4D] font-medium capitalize">
                    {formValues.venueType}
                  </span>
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
                  <span className="text-[#2E1B4D] font-medium">
                    {formValues.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Email:</span>
                  <span className="text-[#2E1B4D] font-medium">
                    {formValues.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5D9E]">Phone:</span>
                  <span className="text-[#2E1B4D] font-medium">
                    {formValues.phoneNumber}
                  </span>
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
                  <p className="text-sm text-[#6F5D9E]">
                    {formValues.messageToSinger}
                  </p>
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
              {baseFee > 0 ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6F5D9E]">Selected Time Slot:</span>
                    <span className="text-[#2E1B4D] font-medium">{duration} hour{duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6F5D9E]">{selectedCategory?.label || "Price"}:</span>
                    <span className="text-[#2E1B4D] font-medium">SAR {baseFee.toLocaleString()}</span>
                  </div>
                  {/* Extra hour charges disabled
                  {extraHours > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6F5D9E]">Extra Hours ({extraHours} × SAR {singer.pricing.extra_hour_price.toLocaleString()}):</span>
                      <span className="text-[#2E1B4D] font-medium">SAR {extraFee.toLocaleString()}</span>
                    </div>
                  )}
                  */}
                  {/* Location surcharge disabled
                  {surcharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6F5D9E]">Location Surcharge:</span>
                      <span className="text-[#2E1B4D] font-medium">SAR {surcharge.toLocaleString()}</span>
                    </div>
                  )}
                  */}
                  {formValues.promoCode && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Code Applied:</span>
                      <span className="font-medium">{formValues.promoCode}</span>
                    </div>
                  )}
                  <div className="h-px bg-[#E7DEFF] my-2" />
                  <div className="flex justify-between text-lg">
                    <span className="text-[#2E1B4D] font-bold">Total:</span>
                    <span className="text-[#2E1B4D] font-bold">
                      SAR {(bookingTotalAmount ?? totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[#6F5D9E]">Loading pricing...</div>
              )}
            </div>

            {/* HyperPay Payment Widget */}
            <div className="mt-2">
              {paymentError && (
                <div className="text-center py-6 space-y-3">
                  <p className="text-red-600 text-sm">{paymentError}</p>
                  <Button
                    variant="primary"
                    className="!h-12"
                    onClick={retryCheckout}
                  >
                    Retry Payment
                  </Button>
                </div>
              )}

              {!paymentError && !checkoutId && (
                <div className="flex items-center justify-center py-8 gap-3">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[#6F5D9E] text-sm">Preparing secure payment...</span>
                </div>
              )}

              {checkoutId && integrity && !paymentError && !priceConfirmed && (
                <div className="bg-[#F9F7FF] rounded-2xl p-5 text-center space-y-4">
                  <p className="text-[#2E1B4D] font-semibold text-base">
                    You will be charged{" "}
                    <span className="text-primary">
                      SAR {(bookingTotalAmount ?? totalPrice).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-[#6F5D9E] text-sm">Please confirm this amount before proceeding to payment.</p>
                  <Button
                    variant="primary"
                    className="!h-12 w-full"
                    onClick={() => setPriceConfirmed(true)}
                  >
                    Confirm &amp; Proceed to Payment
                  </Button>
                </div>
              )}

              {checkoutId && integrity && !paymentError && priceConfirmed && (
                <HyperPayWidget 
                  checkoutId={checkoutId} 
                  bookingId={bookingId} 
                  integrity={integrity}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-container pb-16">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-[#6F5D9E] hover:text-primary mb-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DEFF] text-primary bg-white">
              <ArrowLeft className="h-4 w-4" />
            </span>
          </button>
          <div className="text-center w-full">
            <h1 className="text-3xl lg:text-5xl font-bold text-[#2E1B4D]">
              Book Your Artist
            </h1>
            <p className="text-[#6F5D9E] mt-2">
              Fill in the details to complete your booking
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Event Date & Time */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E7DEFF]">
            <h2 className="text-2xl lg:text-4xl font-bold text-[#2E1B4D] mb-6 flex items-center gap-2">
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
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      // Disable past dates
                      if (date < today) return true;
                      // Disable dates where all slots are unavailable
                      return isDateFullyUnavailable(date);
                    }}
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
                      options={availableTimeSlotOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.timeSlot?.message}
                    />
                  )}
                />
                {formValues.eventDate && availableTimeSlotOptions.length < 3 && (
                  <p className="text-xs text-orange-600 mt-2">
                    {availableTimeSlotOptions.length === 0
                      ? "No time slots available for this date. Please select another date."
                      : `${availableTimeSlotOptions.length} time slot(s) available for this date.`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Event Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E7DEFF]">
            <h2 className="text-2xl lg:text-4xl font-bold text-[#2E1B4D] mb-6 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Event Details
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                  <Select
                    className="!bg-[#F9F7FF] !px-4 py-6 shadow-none"
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
              <Controller
                name="numberOfGuests"
                control={control}
                render={({ field }) => (
                  <Select
                    className="!bg-[#F9F7FF] !px-4 py-6 shadow-none !border-none"
                    label="Number of Guests (Approximate)"
                    options={guestOptions}
                    placeholder="Select guest count"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.numberOfGuests?.message}
                  />
                )}
              />
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    className="!bg-[#F9F7FF] !px-4 py-6"
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
                    className="!bg-[#F9F7FF] !px-4 py-6"
                    label="Postal Code"
                    placeholder="Enter postal code"
                    {...field}
                    error={errors.postalCode?.message}
                  />
                )}
              />
              <Controller
                name="venueName"
                control={control}
                render={({ field }) => (
                  <Input
                    className="!bg-[#F9F7FF] !px-4 py-6"
                    label="Venue Name"
                    placeholder="Enter venue name"
                    {...field}
                    error={errors.venueName?.message}
                  />
                )}
              />
              <div className="md:col-span-2">
                <Controller
                  name="venueAddress"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className="!bg-[#F9F7FF] !px-4 py-6"
                      label="Venue Address"
                      placeholder="Street address"
                      {...field}
                      error={errors.venueAddress?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Your Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E7DEFF]">
            <h2 className="text-2xl lg:text-4xl font-bold text-[#2E1B4D] mb-6 flex items-center gap-2">
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
                      className="!bg-[#F9F7FF] !px-4 py-6"
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
                    className="!bg-[#F9F7FF] !px-4 py-6"
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
                    className="!bg-[#F9F7FF] !px-4 py-6"
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
            <h2 className="text-2xl lg:text-4xl font-bold text-[#2E1B4D] mb-6 flex items-start sm:items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Special Requirements & Message
            </h2>
            <div className="space-y-6">
              <Controller
                name="messageToSinger"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="Message to the Singer (Optional)"
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
                    label="Special Song Requests (Optional)"
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
            <h2 className="text-2xl lg:text-4xl font-bold text-[#2E1B4D] mb-6 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              Payment Details
            </h2>
            <div className="space-y-6">
              {/* Pricing Summary */}
              {baseFee > 0 ? (
                <div className="bg-[#F9F7FF] rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6F5D9E]">Selected Time Slot:</span>
                    <span className="text-[#2E1B4D] font-semibold">{duration} hour{duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6F5D9E]">{selectedCategory?.label || "Price"}:</span>
                    <span className="text-[#2E1B4D] font-semibold">SAR {baseFee.toLocaleString()}</span>
                  </div>
                  {/* Extra hour charges disabled
                  {extraHours > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6F5D9E]">Extra Hours ({extraHours} × SAR {singer.pricing.extra_hour_price.toLocaleString()}):</span>
                      <span className="text-[#2E1B4D] font-semibold">SAR {extraFee.toLocaleString()}</span>
                    </div>
                  )}
                  */}
                  {/* Location surcharge disabled
                  {surcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6F5D9E]">Location Surcharge:</span>
                      <span className="text-[#2E1B4D] font-semibold">SAR {surcharge.toLocaleString()}</span>
                    </div>
                  )}
                  */}
                  <div className="h-px bg-[#E7DEFF]" />
                  <div className="flex justify-between text-lg">
                    <span className="text-[#2E1B4D] font-bold">Total Price:</span>
                    <span className="text-primary font-bold">
                      SAR {(bookingTotalAmount ?? totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F9F7FF] rounded-2xl p-6 text-sm text-[#6F5D9E] text-center">
                  Loading pricing...
                </div>
              )}

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
          <div className="flex justify-end gap-4">
            {/* <Button
              type="button"
              variant="default"
              className="flex-1 hidden bg-black"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button> */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              onClick={(e) => {
                // Check for validation errors and show toast
                const formErrors = errors;
                const errorFields = Object.keys(formErrors);
                if (errorFields.length > 0) {
                  e.preventDefault();
                  const firstError = formErrors[errorFields[0] as keyof typeof formErrors];
                  toast.error(firstError?.message || "Please fill all required fields");
                }
              }}
            >
              {loading ? "Creating Booking..." : "Review Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingSinger;
