import axiosInstance from '../axiosInstance';

// Types
export interface RegisterUserData {
  first_name: string;
  last_name: string;
  phonenumber: string;
  email?: string;
  gender?: string;
  intro_vid_link?: string;
  city?: string;
  address?: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  otp: string;
}

export interface VerifyUserData {
  userId: string;
  otp: string;
}

export interface VerifyResponse {
  message: string;
  userId: string;
}

export interface LoginUserData {
  phonenumber: string;
  password: string;
}

export interface UserMetadata {
  userId: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user_metadata: UserMetadata;
}

export interface UserProfileResponse {
  userId: string;
  name: string;
  role: string;
}

// Auth Service Functions
const authService = {
  /**
   * Register a new user
   * @param role - 'user' or 'singer'
   * @param userData - User registration data
   */
  register: async (role: 'user' | 'singer', userData: RegisterUserData): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<RegisterResponse>(
      `/auth/register?role=${encodeURIComponent(role)}`,
      userData
    );
    return response.data;
  },

  /**
   * Verify user with OTP
   * @param verifyData - userId and OTP code
   */
  verifyUser: async (verifyData: VerifyUserData): Promise<VerifyResponse> => {
    const response = await axiosInstance.post<VerifyResponse>(
      '/auth/verify-user',
      verifyData
    );
    return response.data;
  },

  /**
   * Login user
   * @param loginData - Phone number and password
   */
  login: async (loginData: LoginUserData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      loginData
    );
    
    // Store token and user data in localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user_metadata));
    }
    
    return response.data;
  },

  /**
   * Check authentication and get user profile
   * Requires authentication token in headers
   */
  checkAuth: async (): Promise<UserProfileResponse> => {
    const response = await axiosInstance.get<UserProfileResponse>('/auth/check-auth');
    return response.data;
  },

  /**
   * Logout user
   * Clears local storage and removes auth token
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): UserMetadata | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as UserMetadata;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },
};

export default authService;