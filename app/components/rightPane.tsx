import React from 'react';

export default function RightPane({ data, paginatedData, currentPage, totalPages, setCurrentPage, selected, setSelected }) {
    return (
        <div className="p-4 h-screen overflow-auto">
        <h2 className="font-bold mb-4">Tabular Pane</h2>
        <div className="mb-2 flex justify-between items-center">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <table className="min-w-full text-sm border">
          <thead>
            <tr>
              {data[0] &&
                Object.keys(data[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 bg-gray-100">{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, i) => {
              const isHighlighted = row.id === selected?.id;
              return (
                <tr
                  key={row.id || i}
                  className={`cursor-pointer ${isHighlighted ? 'bg-yellow-100' : ''}`}
                  onClick={() => setSelected(row)}
                >
                  {Object.entries(row).map(([key, val], idx) => (
                    <td
                      key={idx}
                      title={val}
                      className={`border px-1 py-1 whitespace-nowrap overflow-hidden text-ellipsis 
                        ${['time', 'place', 'updated'].includes(key) ? 'max-w-xs' : 'max-w-[1rem]'}`}
                    >
                      {String(val)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}