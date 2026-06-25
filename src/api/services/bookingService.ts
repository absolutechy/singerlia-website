import axiosInstance from '../axiosInstance';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Create Booking Request
export interface CreateBookingData {
  singerId: string;
  eventDate: string;
  timeSlot: string;
  eventType: string;
  venueName: string;
  venueAddress: string;
  city: string;
  postalCode: string;
  venueType: string;
  numberOfGuests: number | string;
  fullName: string;
  email: string;
  phoneNumber: string;
  messageToSinger: string;
  specialSongRequests: string;
  equipment: string[] | string;
  promoCode?: string;
  agreeToTerms: boolean;
}

// Create Booking Response
export interface CreateBookingResponse {
  message: string;
  bookingId: string;
  status: string;
  totalAmount?: number;
}

// Booking Details Response
export interface BookingDetails {
  bookingId: string;
  singerId: string;
  singerName?: string;
  userId: string;
  eventDate: string;
  timeSlot: string;
  eventType: string;
  venueName: string;
  venueAddress: string;
  city: string;
  postalCode: string;
  venueType: string;
  numberOfGuests: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  messageToSinger: string;
  specialSongRequests: string;
  equipment: string[];
  promoCode?: string;
  status: 'pending' | 'pending_artist_confirmation' | 'confirmed' | 'rejected' | 'cancelled_by_artist' | 'payment_failed' | 'completed' | 'dispute' | 'cancelled';
  paymentStatus?: 'authorized' | 'captured' | 'voided' | 'void_failed' | 'refunded' | 'refund_pending' | 'capture_failed' | 'pending' | 'failed' | string;
  payoutStatus?: 'not_initiated' | 'processing' | 'scheduled' | 'completed' | 'failed' | 'on_hold' | string;
  artistResponseDueAt?: string;
  authorizedAt?: string;
  acceptedAt?: string;
  cancellationWindowEndsAt?: string;
  confirmationEmailSentAt?: string;
  confirmationDeadlineAt?: string;
  customerConfirmedAt?: string;
  singerConfirmedAt?: string;
  totalAmount: number;
  payoutAmount?: number;
  platformFeeAmount?: number;
  createdAt: string;
  updatedAt: string;
}

// Get User Bookings Response
export interface GetUserBookingsResponse {
  bookings: BookingDetails[];
  total: number;
}

// Get Singer Bookings Response
export interface GetSingerBookingsResponse {
  bookings: BookingDetails[];
  total: number;
}

// Approve/Decline Booking Request
export interface ApproveDeclineBookingData {
  isApproved: boolean;
  message?: string;
}

// Approve/Decline Booking Response
export interface ApproveDeclineBookingResponse {
  message: string;
  status: string;
}

// Complete Booking Response
export interface CompleteBookingResponse {
  message: string;
  status: string;
}

// Cancel Booking Response
export interface CancelBookingResponse {
  message: string;
  status: string;
}

// Get All Bookings Response (Admin)
export interface GetAllBookingsResponse {
  bookings: BookingDetails[];
  total: number;
}

// Get Booking By ID Response
export interface GetBookingByIdResponse {
  booking: BookingDetails;
}

// ============================================================================
// BOOKING SERVICE
// ============================================================================

/**
 * Booking Service - Handles all booking-related API calls
 *
 * All endpoints require authentication (Bearer token)
 * Token is automatically added via axios interceptor
 *
 * Endpoints covered:
 * - Create new booking
 * - Get user's bookings
 * - Get singer's bookings
 * - Cancel booking (user/singer)
 * - Complete booking (singer)
 * - Approve/Decline booking (singer)
 * - Get all bookings (admin)
 */
const bookingService = {
  /**
   * Create a new booking
   * POST /api/booking
   *
   * @param bookingData - Booking details from user
   * @returns Created booking with ID and status
   */
  createBooking: async (bookingData: CreateBookingData): Promise<CreateBookingResponse> => {
    const response = await axiosInstance.post<CreateBookingResponse>(
      '/booking',
      bookingData
    );
    return response.data;
  },

  /**
   * Get all bookings for the current user
   * GET /api/booking
   *
   * @returns List of user's bookings
   */
  getUserBookings: async (): Promise<GetUserBookingsResponse> => {
    const response = await axiosInstance.get<GetUserBookingsResponse>(
      '/booking'
    );
    return response.data;
  },

  /**
   * Cancel booking by user
   * PUT /api/booking/cancel-user/:bookingId
   *
   * @param bookingId - ID of booking to cancel
   * @returns Cancellation response
   */
  cancelBookingByUser: async (bookingId: string): Promise<CancelBookingResponse> => {
    const response = await axiosInstance.put<CancelBookingResponse>(
      `/booking/cancel-user/${bookingId}`
    );
    return response.data;
  },

  /**
   * Get all bookings for the current singer
   * GET /api/booking/singer
   *
   * @returns List of singer's bookings
   */
  getSingerBookings: async (): Promise<GetSingerBookingsResponse> => {
    const response = await axiosInstance.get<GetSingerBookingsResponse>(
      '/booking/singer'
    );
    return response.data;
  },

  /**
   * Cancel booking by singer
   * PUT /api/booking/cancel-singer/:bookingId
   *
   * @param bookingId - ID of booking to cancel
   * @returns Cancellation response
   */
  cancelBookingBySinger: async (bookingId: string): Promise<CancelBookingResponse> => {
    const response = await axiosInstance.put<CancelBookingResponse>(
      `/booking/cancel-singer/${bookingId}`
    );
    return response.data;
  },

  /**
   * Complete booking by user
   * PUT /api/booking/complete-user/:bookingId
   *
   * @param bookingId - ID of booking to complete
   * @returns Completion response
   */
  completeBookingByUser: async (bookingId: string): Promise<CompleteBookingResponse> => {
    const response = await axiosInstance.put<CompleteBookingResponse>(
      `/booking/complete-user/${bookingId}`
    );
    return response.data;
  },

  /**
   * Complete booking by singer
   * PUT /api/booking/complete/:bookingId
   *
   * @param bookingId - ID of booking to complete
   * @returns Completion response
   */
  completeBooking: async (bookingId: string): Promise<CompleteBookingResponse> => {
    const response = await axiosInstance.put<CompleteBookingResponse>(
      `/booking/complete/${bookingId}`
    );
    return response.data;
  },

  /**
   * Approve or decline booking by singer
   * POST /api/booking/approve-decline/:bookingId
   *
   * @param bookingId - ID of booking
   * @param approvalData - Approval/decline decision and message
   * @returns Response with updated status
   */
  approveOrDeclineBooking: async (
    bookingId: string,
    approvalData: ApproveDeclineBookingData
  ): Promise<ApproveDeclineBookingResponse> => {
    const response = await axiosInstance.post<ApproveDeclineBookingResponse>(
      `/booking/approve-decline/${bookingId}`,
      approvalData
    );
    return response.data;
  },

  /**
   * Get all bookings (Admin only)
   * GET /api/booking/all
   *
   * @returns All bookings in the system
   */
  getAllBookings: async (): Promise<GetAllBookingsResponse> => {
    const response = await axiosInstance.get<GetAllBookingsResponse>(
      '/booking/all'
    );
    return response.data;
  },

  /**
   * Get a single booking by ID (owner only)
   * POST /api/booking/get-booking
   *
   * @param bookingId - ID of the booking to retrieve
   * @returns Booking details
   */
  getBookingById: async (bookingId: string): Promise<GetBookingByIdResponse> => {
    const response = await axiosInstance.post<GetBookingByIdResponse>(
      '/booking/get-booking',
      { bookingId }
    );
    return response.data;
  },
};

export default bookingService;
