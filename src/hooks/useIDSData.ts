import { useEffect } from "react";
import { fetchIDSData, subscribeToDataUpdates } from "../services/dataService";
import { useDataContext } from "../context/DataContext";

export const useIDSData = () => {
  const dataContext = useDataContext();

  const SERVER_URL = "http://localhost:5000";

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/status`);
      const data = await res.json();
      console.log(data.stats);

      dataContext.setIsRunning(data.running);
      dataContext.setStats(data.stats || {});
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  // const startSending = async () => {
  //   try {
  //     const res = await fetch(`${SERVER_URL}/start`, { method: "POST" });
  //     if (res.ok) fetchStatus();
  //   } catch (error) {
  //     console.error("Error starting sender:", error);
  //   }
  // };

  // const stopSending = async () => {
  //   try {
  //     const res = await fetch(`${SERVER_URL}/stop`, { method: "POST" });
  //     if (res.ok) fetchStatus();
  //   } catch (error) {
  //     console.error("Error stopping sender:", error);
  //   }
  // };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        dataContext.setLoading(true);
        const result = await fetchIDSData();
        dataContext.setData(result);
        dataContext.setLastUpdated(new Date());
        dataContext.setError(null);
      } catch (err) {
        dataContext.setError("Error loading IDS data");
        console.error("Error loading IDS data:", err);
      } finally {
        dataContext.setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToDataUpdates((newData) => {
      dataContext.setData(newData);
      dataContext.setLastUpdated(new Date());
    });

    return () => unsubscribe();
  }, []);

  // Filter data by time range
  const filterByTimeRange = (startTime: Date, endTime: Date) => {
    return dataContext.data.filter((item) => {
      const timestamp = new Date(item.timestamp);
      return timestamp >= startTime && timestamp <= endTime;
    });
  };

  // Filter data by attack type
  const filterByAttackType = (attackType: string) => {
    return dataContext.data.filter((item) => item.label === attackType);
  };

  // Get attack statistics
  const getStatistics = () => {
    const attacksStats = [
      {
        type: "Bot",
        count: dataContext.stats.Bot || 0,
      },
      {
        type: "BruteForce",
        count: dataContext.stats.BruteForce || 0,
      },
      {
        type: "DoS",
        count: dataContext.stats.DoS || 0,
      },
      {
        type: "Infiltration",
        count: dataContext.stats.Infiltration || 0,
      },
      {
        type: "PortScan",
        count: dataContext.stats.PortScan || 0,
      },
      {
        type: "WebAttack",
        count: dataContext.stats.WebAttack || 0,
      },
    ];

    return {
      total: dataContext.stats?.total_traffic || 0,
      attackCount: dataContext.stats?.attack_traffic || 0,
      benignCount:
        (dataContext.stats?.total_traffic || 0) -
        (dataContext.stats?.attack_traffic || 0),
      attackPercentage: dataContext.stats?.attack_percentage || 0,
      benignPercentage: 100 - dataContext.stats?.attack_percentage || 0,
      attackTypes: attacksStats,
      attack_info:
        dataContext.stats?.attacks_info?.map((attack) => ({
          timestamp: attack.time,
          srcIP: attack.src_ip,
          dstIP: attack.dst_ip,
          srcPort: attack.src_port,
          dstPort: attack.dst_port,
          protocol: attack.protocol,
          flowDuration: 0,
          flowBytes: attack.traffic_size,
          flowPackets: 0,
          label: attack.label,
        })) || [],
    };
  };

  return {
    data: dataContext.data,
    loading: dataContext.loading,
    error: dataContext.error,
    lastUpdated: dataContext.lastUpdated,
    filterByTimeRange,
    filterByAttackType,
    getStatistics,
  };
};
