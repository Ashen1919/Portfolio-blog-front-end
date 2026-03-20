// src/api/postFormData.js
export const fetchCategories = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/api/categories');
  return data;
};

export const fetchTags = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/api/tags');
  return data;
};