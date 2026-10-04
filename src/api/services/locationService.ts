import axiosInstance from '../axiosInstance';

export interface Locations {
  regions: { id: string; name: string }[];
  cities: { id: string; name: string; regionId: string }[];
}

export const getLocations = async (): Promise<Locations> => {
  const response = await axiosInstance.get<Locations>('/locations');
  return response.data;
};
