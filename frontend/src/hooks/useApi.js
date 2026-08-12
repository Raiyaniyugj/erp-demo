import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';

export default function useApi(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await API.get(url);
            setData(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (options.skip) return;
        fetchData();
    }, [fetchData, options.skip]);

    return { data, loading, error, refetch: fetchData };
}
