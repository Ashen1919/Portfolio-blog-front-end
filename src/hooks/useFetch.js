import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

/**
 * useFetch — generic GET request hook
 *
 * @param {string} url          - API path, e.g. '/posts'
 * @param {object} [params]     - optional query params, e.g. { page: 0, size: 9 }
 * @param {boolean} [immediate] - whether to fire on mount (default: true)
 *
 * Returns { data, loading, error, refetch }
 */
const useFetch = (url, params = {}, immediate = true) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async (overrideParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await axiosInstance.get(url, {
        params: overrideParams || params,
      });
      setData(res);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        err.message                 ||
        'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    if (immediate) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, immediate]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
