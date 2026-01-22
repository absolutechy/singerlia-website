import axiosInstance from "../axiosInstance";

export const getViewFile = async (s3Path: string, fileType: string) => {
  try {
    const response = await axiosInstance.get(
      `/image/view-file?s3Path=${encodeURIComponent(
        s3Path
      )}&fileType=${encodeURIComponent(fileType)}`,
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], { type: fileType });
    const url = URL.createObjectURL(blob);
    return { data: url, isError: false };
  } catch (error: any) {
    return { error: error.response.data.error, isError: true };
  }
};