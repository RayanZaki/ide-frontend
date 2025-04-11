import { useState, useEffect } from 'react';
import { IDSData, fetchIDSData, subscribeToDataUpdates } from '../services/dataService';

export const useIDSData = () => {
  const [data, setData] = useState<IDSData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchIDSData();
        setData(result);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError('Error loading IDS data');
        console.error('Error loading IDS data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToDataUpdates((newData) => {
      setData(newData);
      setLastUpdated(new Date());
    });

    return () => unsubscribe();
  }, []);

  // Filter data by time range
  const filterByTimeRange = (startTime: Date, endTime: Date) => {
    return data.filter(item => {
      const timestamp = new Date(item.timestamp);
      return timestamp >= startTime && timestamp <= endTime;
    });
  };

  // Filter data by attack type
  const filterByAttackType = (attackType: string) => {
    return data.filter(item => item.label === attackType);
  };

  // Get attack statistics
  const getStatistics = () => {
    const total = data.length;
    if (total === 0) return { total: 0, attackCount: 0, benignCount: 0, attackPercentage: 0, attackTypes: [] };

    const attacks = data.filter(item => item.label !== 'BENIGN');
    const benign = data.filter(item => item.label === 'BENIGN');
    
    // Get unique attack types
    const attackTypes = [...new Set(attacks.map(item => item.label))];
    
    // Count occurrences of each attack type
    const attackCounts = attackTypes.map(type => ({
      type,
      count: attacks.filter(item => item.label === type).length,
      percentage: (attacks.filter(item => item.label === type).length / total) * 100
    }));
    
    return {
      total,
      attackCount: attacks.length,
      benignCount: benign.length,
      attackPercentage: (attacks.length / total) * 100,
      benignPercentage: (benign.length / total) * 100,
      attackTypes: attackCounts
    };
  };

  return {
    data,
    loading,
    error,
    lastUpdated,
    filterByTimeRange,
    filterByAttackType,
    getStatistics
  };
};