// src/api/postFormData.js
export const fetchCategories = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/api/categories');
  return data;
};

export const fetchTags = async (axiosInstance) => {
  const { data } = await axiosInstance.get('/api/tags');
  return data;
};

export const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};