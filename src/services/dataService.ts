import axios from 'axios';

// Define the structure of our IDS data based on CICIDS2017 dataset
export interface IDSData {
  timestamp: string;
  srcIP: string;
  dstIP: string;
  srcPort: number;
  dstPort: number;
  protocol: string;
  flowDuration: number;
  flowBytes: number;
  flowPackets: number;
  label: string;
  // Add more fields as needed based on your CSV structure
}

// Mock API function to fetch data from CSV files
// In a real application, you would implement a backend service to read and parse CSV files
export const fetchIDSData = async (): Promise<IDSData[]> => {
  try {
    // Using the local CSV file path (in a real app, you'd use a backend endpoint)
    const response = await axios.get('/data/CICIDS2017_sample.csv', {
      responseType: 'text',
    });
    
    // Parse CSV data
    const parsedData = parseCSV(response.data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching IDS data:', error);
    return [];
  }
};

// Mock function to simulate real-time updates
// In a real application, you would use WebSockets or server-sent events
export const subscribeToDataUpdates = (callback: (data: IDSData[]) => void): (() => void) => {
  const interval = setInterval(async () => {
    const data = await fetchIDSData();
    callback(data);
  }, 30000); // Update every 30 seconds
  
  return () => clearInterval(interval);
};

// Helper function to parse CSV data
const parseCSV = (csvText: string): IDSData[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const record: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      if (!isNaN(Number(value))) {
        record[header] = Number(value);
      } else {
        record[header] = value;
      }
    });
    
    return {
      timestamp: record['Timestamp'] || new Date().toISOString(),
      srcIP: record['Source IP'] || record['src_ip'] || '',
      dstIP: record['Destination IP'] || record['dst_ip'] || '',
      srcPort: record['Source Port'] || record['src_port'] || 0,
      dstPort: record['Destination Port'] || record['dst_port'] || 0,
      protocol: record['Protocol'] || record['protocol'] || '',
      flowDuration: record['Flow Duration'] || record['flow_duration'] || 0,
      flowBytes: record['Total Fwd Packets'] || record['flow_bytes'] || 0,
      flowPackets: record['Total Backward Packets'] || record['flow_packets'] || 0,
      label: record['Label'] || 'BENIGN',
      // Add more mappings as needed
    } as IDSData;
  });
};

// Function to get attack statistics from data
export const getAttackStatistics = (data: IDSData[]) => {
  const total = data.length;
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

// Function to filter data by time range
export const filterDataByTimeRange = (data: IDSData[], startTime: Date, endTime: Date): IDSData[] => {
  return data.filter(item => {
    const timestamp = new Date(item.timestamp);
    return timestamp >= startTime && timestamp <= endTime;
  });
};

// Function to filter data by attack type
export const filterDataByAttackType = (data: IDSData[], attackType: string): IDSData[] => {
  return data.filter(item => item.label === attackType);
};