import axiosInstance from '../axiosInstance';

// Types
export interface SingerSearchParams {
  genre?: string;
  city?: string;
  address?: string;
  name?: string;
  limit?: number;
  page?: number;
  highlight?: 'feature' | '';
}

export interface Review {
  reviewId: string;
  singerId: string;
  userName: string;
  rating: string;
  comment: string;
  createdAt: string;
}

export interface Pricing {
  base_price: number;
  extra_hour_price: number;
  location_surcharge: number;
}

export interface PhotoFile {
  fileName: string;
  fileType: string;
  s3Path: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

export interface SingerProfile {
  userId: string;
  bio: string;
  experience: string;
  genres: string[];
  social_links: SocialLinks;
  photos: PhotoFile[];
  youtube_links: string[];
}

export interface Singer {
  userId: string;
  name: string;
  phonenumber: string;
  email: string;
  genre: string | null;
  intro_vid_link: string | null;
  city: string;
  address: string | null;
  joinedAt: string;
  isVerified: boolean;
  pricing: Pricing;
  reviews: Review[];
  highlight: string;
  isSingerApproved: boolean;
  singerProfile?: SingerProfile;
}

export interface SingerSearchResponse {
  singers: Singer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const singerService = {
  /**
   * Search singers with filters
   * @param params - Search parameters
   */
  searchSingers: async (params: SingerSearchParams = {}): Promise<SingerSearchResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.genre) queryParams.append('genre', params.genre);
    if (params.city) queryParams.append('city', params.city);
    if (params.address) queryParams.append('address', params.address);
    if (params.name) queryParams.append('name', params.name);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.highlight) queryParams.append('highlight', params.highlight);
    
    const response = await axiosInstance.get<SingerSearchResponse>(
      `/singer?${queryParams.toString()}`
    );
    
    return response.data;
  },

  /**
   * Get featured singers for homepage
   * @param limit - Number of featured singers to fetch
   */
  getFeaturedSingers: async (limit: number = 10): Promise<SingerSearchResponse> => {
    return singerService.searchSingers({
      highlight: 'feature',
      limit,
      page: 1,
    });
  },

  /**
   * Get singer details by ID
   * @param userId - The user ID of the singer
   */
  getSingerById: async (userId: string): Promise<Singer | null> => {
    try {
      const response = await axiosInstance.get<{ singer: Singer; singerProfile: SingerProfile }>(
        `/singer/${userId}`
      );
      // Merge singerProfile into singer object
      return {
        ...response.data.singer,
        singerProfile: response.data.singerProfile,
      };
    } catch (error) {
      console.error('Failed to fetch singer by ID:', error);
      return null;
    }
  },

  /**
   * Add singer to wishlist
   * @param singerId - The ID of the singer to add to wishlist
   */
  addToWishlist: async (singerId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/singer/add-to-wishlist', {
      singerId,
    });
    return response.data;
  },

  /**
   * Get user's wishlist
   */
  getWishlist: async (): Promise<string[]> => {
    const response = await axiosInstance.get<{ message: string; wishlist: string[] }>('/singer/user/get-wishlist');
    return response.data.wishlist || [];
  },
};

export default singerService;
