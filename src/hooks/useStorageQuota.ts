import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';

export interface StorageQuota {
  userId: string;
  usedBytes: number;
  quotaBytes: number;
  remainingBytes: number;
  percentageUsed: number;
  usedMB: string;
  quotaMB: string;
  remainingMB: string;
}

export const useStorageQuota = () => {
  const { session } = useApp();
  const [quota, setQuota] = useState<StorageQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuota = async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_storage_quotas')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        const usedBytes = data.used_bytes || 0;
        const quotaBytes = data.quota_bytes || 104857600; // 100MB default
        const remainingBytes = Math.max(0, quotaBytes - usedBytes);
        const percentageUsed = Math.round((usedBytes / quotaBytes) * 100);

        setQuota({
          userId: session.user.id,
          usedBytes,
          quotaBytes,
          remainingBytes,
          percentageUsed,
          usedMB: (usedBytes / (1024 * 1024)).toFixed(2),
          quotaMB: (quotaBytes / (1024 * 1024)).toFixed(0),
          remainingMB: (remainingBytes / (1024 * 1024)).toFixed(2),
        });
      } else {
        // No quota record yet - use defaults
        setQuota({
          userId: session.user.id,
          usedBytes: 0,
          quotaBytes: 104857600,
          remainingBytes: 104857600,
          percentageUsed: 0,
          usedMB: '0.00',
          quotaMB: '100',
          remainingMB: '100.00',
        });
      }
    } catch (err) {
      console.error('Error loading storage quota:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quota');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuota();
  }, [session?.user?.id]);

  const refreshQuota = () => {
    loadQuota();
  };

  const isNearLimit = quota ? quota.percentageUsed >= 80 : false;
  const isAtLimit = quota ? quota.percentageUsed >= 95 : false;

  return {
    quota,
    loading,
    error,
    refreshQuota,
    isNearLimit,
    isAtLimit,
  };
};
