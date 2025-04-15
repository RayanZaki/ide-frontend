import React, { createContext, useContext, useState, ReactNode } from "react";
import { IDSData } from "../services/dataService";

interface DataContextProps {
  data: IDSData[];
  setData: React.Dispatch<React.SetStateAction<IDSData[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  lastUpdated: Date | null;
  setLastUpdated: React.Dispatch<React.SetStateAction<Date | null>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  stats: Record<string, number>;
  setStats: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<IDSData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        loading,
        setLoading,
        error,
        setError,
        lastUpdated,
        setLastUpdated,
        isRunning,
        setIsRunning,
        stats,
        setStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
