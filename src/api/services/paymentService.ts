import axiosInstance from "../axiosInstance";

export interface PrepareCheckoutResponse {
  message: string;
  checkoutId: string;
  amount: string;
  currency: string;
  integrity?: string;
  expiresIn?: number;
}

export interface PaymentStatusResponse {
  message: string;
  paymentStatus: string;
  bookingId: string;
  amount?: string;
  paymentId?: string;
  paymentBrand?: string;
  requiresCapture?: boolean;
  resultCode?: string;
  resultDescription?: string;
}

export interface CaptureResponse {
  message: string;
  paymentStatus: string;
  bookingId: string;
  capturedAmount?: string;
  captureId?: string;
  paymentId?: string;
  resultCode?: string;
  resultDescription?: string;
}

const paymentService = {
  prepareCheckout: async (bookingId: string): Promise<PrepareCheckoutResponse> => {
    const response = await axiosInstance.post<PrepareCheckoutResponse>("/payment/checkouts", {
      bookingId,
    });
    return response.data;
  },

  getPaymentStatus: async (bookingId: string, resourcePath?: string): Promise<PaymentStatusResponse> => {
    const response = await axiosInstance.get<PaymentStatusResponse>(`/payment/status/${bookingId}`, {
      params: resourcePath ? { resourcePath } : undefined,
    });
    return response.data;
  },

  capturePayment: async (bookingId: string, amount?: string): Promise<CaptureResponse> => {
    const response = await axiosInstance.post<CaptureResponse>(`/payment/capture/${bookingId}`, {
      amount,
    });
    return response.data;
  },
};

export default paymentService;
