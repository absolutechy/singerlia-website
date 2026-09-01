import axiosInstance from '../axiosInstance';

// The admin-managed master list of genres singers select from.
export interface Genre {
  genreId: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListGenresResponse {
  message: string;
  genres: Genre[];
}

const genreService = {
  /**
   * List active genres.
   * GET /api/genres
   */
  getAllGenres: async (): Promise<ListGenresResponse> => {
    const response = await axiosInstance.get<ListGenresResponse>('/genres');
    return response.data;
  },
};

export default genreService;
