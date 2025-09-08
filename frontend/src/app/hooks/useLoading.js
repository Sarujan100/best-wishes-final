'use client';

import { useState, useCallback } from 'react';

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const withLoading = useCallback(async (asyncFunction) => {
    try {
      setLoading(true);
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, withLoading };
}; 