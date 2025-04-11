import React, { useState } from 'react';
import { IDSData } from '../services/dataService';
import { format } from 'date-fns';

interface DataTableProps {
  data: IDSData[];
  title?: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, title = 'Network Traffic' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  const renderPagination = () => {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, data.length)} of {data.length} entries
        </div>
        <div className="flex">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-l-md bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-1 border-t border-b bg-white">
            {currentPage} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-r-md bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Protocol
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Traffic
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((row, index) => (
              <tr key={index} className={row.label !== 'BENIGN' ? 'bg-red-50' : ''}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.timestamp ? format(new Date(row.timestamp), 'yyyy-MM-dd HH:mm:ss') : '—'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {row.srcIP}:{row.srcPort}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {row.dstIP}:{row.dstPort}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.protocol}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {row.flowPackets} packets / {Math.round(row.flowBytes / 1024)} KB
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.label === 'BENIGN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {row.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default DataTable;