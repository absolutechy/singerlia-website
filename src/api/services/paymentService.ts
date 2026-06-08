import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios";

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
  retryable?: boolean;
  retryAfterMs?: number;
  lookupStrategy?: string;
  amount?: string;
  paymentId?: string;
  paymentBrand?: string;
  requiresCapture?: boolean;
  capturePending?: boolean;
  resultCode?: string;
  resultDescription?: string;
  capturePending?: boolean;
  payoutStatus?: string | null;
  payoutTransferId?: string | null;
  payout?: unknown;
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
  payoutStatus?: string | null;
  payoutTransferId?: string | null;
  payout?: unknown;
}

const logApiRequest = (label: string, method: string, url: string, data?: unknown, params?: unknown) => {
  console.log(`${label} request object (sending):`, {
    method,
    url,
    baseURL: import.meta.env.VITE_API_BASE_URL,
    params: params ?? null,
    data: data ?? null,
    timestamp: new Date().toISOString(),
  });
};

const logApiResponse = (label: string, response: any) => {
  console.log(`${label} response object (received):`, {
    status: response?.status,
    statusText: response?.statusText,
    headers: response?.headers,
    config: {
      method: response?.config?.method,
      url: response?.config?.url,
      baseURL: response?.config?.baseURL,
      params: response?.config?.params ?? null,
      data: response?.config?.data ?? null,
    },
    data: response?.data,
  });
};

const logApiError = (label: string, error: AxiosError) => {
  console.error(`${label} error object (received):`, {
    message: error.message,
    code: error.code,
    status: error.response?.status,
    statusText: error.response?.statusText,
    request: {
      method: error.config?.method,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      params: (error.config as any)?.params ?? null,
      data: error.config?.data ?? null,
    },
    responseData: error.response?.data ?? null,
  });
};

const paymentService = {
  prepareCheckout: async (bookingId: string): Promise<PrepareCheckoutResponse> => {
    const url = "/payment/checkouts";
    const payload = { bookingId };

    logApiRequest("[Payout] Checkout", "POST", url, payload);

    try {
      const response = await axiosInstance.post<PrepareCheckoutResponse>(url, payload);
      logApiResponse("[Payout] Checkout", response);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      logApiError("[Payout] Checkout", axiosError);
      throw error;
    }
  },

  getPaymentStatus: async (bookingId: string, resourcePath?: string): Promise<PaymentStatusResponse> => {
    const url = `/payment/status/${bookingId}`;
    const params = resourcePath ? { resourcePath } : undefined;
    logApiRequest("[Payout] Payment Status", "GET", url, undefined, params);

    try {
      const response = await axiosInstance.get<PaymentStatusResponse>(url, { params });
      logApiResponse("[Payout] Payment Status", response);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      logApiError("[Payout] Payment Status", axiosError);
      throw error;
    }
  },

  capturePayment: async (bookingId: string, amount?: string): Promise<CaptureResponse> => {
    const url = `/payment/capture/${bookingId}`;
    const payload = { amount };

    logApiRequest("[Payout] Capture", "POST", url, payload);

    try {
      const response = await axiosInstance.post<CaptureResponse>(url, payload);
      logApiResponse("[Payout] Capture", response);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      logApiError("[Payout] Capture", axiosError);
      throw error;
    }
  },
};

export default paymentService;
