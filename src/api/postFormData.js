// src/api/postFormData.js
export const fetchCategories = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};

export const fetchTags = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/tags');
  return data;
};