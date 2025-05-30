import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DataTable from "../components/DataTable";
import PieChart from "../components/PieChart";
import StatCard from "../components/StatCard";
import { useIDSData } from "../hooks/useIDSData";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttacksAnalysis: React.FC = () => {
  const { data, loading, error, getStatistics } = useIDSData();
  const [selectedAttackType, setSelectedAttackType] = useState<string>("all");

  const stats = getStatistics();

  // Get only attack data
  const attackData = useMemo(() => {
    return data.filter((item) => item.label !== "BENIGN");
  }, [data]);

  // Get data filtered by selected attack type
  const filteredAttackData = useMemo(() => {
    if (selectedAttackType === "all") return attackData;
    return attackData.filter((item) => item.label === selectedAttackType);
  }, [attackData, selectedAttackType]);

  // 1. Group protocol counts
  const protocolCounts = stats.attack_info.reduce((acc, attack) => {
    acc[attack.protocol] = (acc[attack.protocol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Extract labels and counts
  const protocolLabels = Object.keys(protocolCounts);
  const protocolData = Object.values(protocolCounts);

  // Source IP analysis
  const sourceIPAnalysis = Object.values(
    stats.attack_info.reduce((acc, attack) => {
      const ip = attack.srcIP;
      if (!acc[ip]) {
        acc[ip] = {
          ip,
          count: 0,
          attackTypes: new Set<string>(),
        };
      }
      acc[ip].count += 1;
      acc[ip].attackTypes.add(attack.label);
      return acc;
    }, {} as Record<string, { ip: string; count: number; attackTypes: Set<string> }>)
  ).map((entry) => ({
    ip: entry.ip,
    count: entry.count,
    attackTypes: Array.from(entry.attackTypes),
    attackTypeCount: entry.attackTypes.size,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading attack data...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="p-6 text-black bg-[#F5F7FA]">
      {/* Modern Attack Type Filter */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-[#0A4170]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Attack Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <select
                value={selectedAttackType}
                onChange={(e) => setSelectedAttackType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4170] focus:border-[#0A4170] appearance-none transition-all"
                style={{
                  backgroundImage:
                    'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%236B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\')',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                }}
              >
                <option value="all">All Attack Types</option>
                {stats.attackTypes.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => setSelectedAttackType("all")}
              className="w-full bg-[#0A4170] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#083152] transition-all duration-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Total Attacks
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.attackCount.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <span className="text-red-500 text-xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Attack Types
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {stats.attackTypes.length.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-purple-500 text-xl">🔍</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Affected IPs
              </h3>
              <p className="text-2xl font-bold text-gray-800">1</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-blue-500 text-xl">🖥️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Source IPs
              </h3>
              <p className="text-2xl font-bold text-gray-800">1</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <span className="text-orange-500 text-xl">🌐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold mb-4 text-gray-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#0A4170]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Attack Distribution
          </h2>
          <div style={{ height: "300px" }}>
            <Bar
              data={{
                labels: stats.attackTypes.map((type) => type.type),
                datasets: [
                  {
                    label: "Attack Frequency",
                    data: stats.attackTypes.map((type) => type.count),
                    backgroundColor: stats.attackTypes.map(
                      (_, index) =>
                        `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
                          (index * 150) % 255
                        }, 0.8)`
                    ),
                    borderColor: stats.attackTypes.map(
                      (_, index) =>
                        `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
                          (index * 150) % 255
                        }, 1)`
                    ),
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false, // or true if you want to show just one label
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Attack Range",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Frequency",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-base font-semibold mb-4 text-gray-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#0A4170]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            Protocol Distribution
          </h2>
          <PieChart
            title="Protocol Distribution"
            data={{
              labels: protocolLabels,
              datasets: [
                {
                  label: "Protocol Usage",
                  data: protocolData,
                  backgroundColor: protocolLabels.map(
                    (_, index) =>
                      `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
                        (index * 150) % 255
                      }, 0.8)`
                  ),
                  borderColor: protocolLabels.map(
                    (_, index) =>
                      `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
                        (index * 150) % 255
                      }, 1)`
                  ),
                  borderWidth: 2,
                },
              ],
            }}
            height={300}
          />
        </div>
      </div>

      {/* Top Attack Sources */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-base font-semibold mb-4 text-gray-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-[#0A4170]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Top Attack Sources
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Source IP
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Attack Count
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Attack Types
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Diversity
                </th>
              </tr>
            </thead>
            <tbody>
              {sourceIPAnalysis.map((source) => (
                <tr key={source.ip} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {source.ip}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {source.count}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {source.attackTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 font-medium"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                      {source.attackTypeCount}{" "}
                      {source.attackTypeCount === 1 ? "type" : "types"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attack Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={stats.attack_info}
          title={`Attack Data ${
            selectedAttackType !== "all" ? `(${selectedAttackType})` : ""
          }`}
        />
      </div>
    </div>
  );
};

export default AttacksAnalysis;
