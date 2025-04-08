"use client"

import React, { useEffect, useState, createContext } from 'react';
import {create} from 'zustand';
import LeftPane from './components/leftPane';
import RightPane from './components/rightPane';

import { format } from 'date-fns';


const setDataStore = create((set) => ({
  selected: null,
  setSelected: (record) => set({ selected: record }),
}));


const HighlightContext = createContext();

const DataProvider = ({ children }) => {
  const [highlighted, setHighlighted] = useState(null);
  return (
    <HighlightContext.Provider value={{ highlighted, setHighlighted }}>
      {children}
    </HighlightContext.Provider>
  );
};

//parse csv
const parseCSV = (csvText) => {
  const [headerLine, ...lines] = csvText.split('\n');
  const headers = headerLine.split(',');

  return lines
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const values = line.split(',');
      const row = {};
      headers.forEach((header, i) => {
        const raw = values[i];
        const num = Number(raw);
        row[header] = isNaN(num) || raw.trim() === '' ? raw : num;
      });
      // console.log(row)
      return row;
    });
};

export default function Home() {
  const [data, setData] = useState([]);
  
  const [fields, setFields] = useState([]);
  const [xAxis, setXAxis] = useState('depth');
  const [yAxis, setYAxis] = useState('mag');
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const selected = setDataStore((state) => state.selected);
  const setSelected = setDataStore((state) => state.setSelected);
  
  const rowsPerPage = 50;

  // loading flag
  const isLoading = data.length === 0;

  useEffect(() => {
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv')
      .then((res) => res.text())
      .then((csv) => {
        const data = parseCSV(csv);
          const numericCols = Object.keys(data[0] || {}).filter((key) =>
            typeof data[0][key] === 'number'
          );
          const formatted = data.map((row) => {
            const newRow = { ...row };
            // console.log('newRow:', newRow)
            if (newRow.time) newRow.time = format(new Date(newRow.time), 'MMM d, yyyy, hh:mm:ss a');
            if (newRow.updated) newRow.updated = format(new Date(newRow.updated), 'MMM d, yyyy, hh:mm:ss a');
            return newRow;
          });
          setFields(numericCols);
          setData(formatted);
      });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const index = data.findIndex((row) => row.id === selected.id);

      const newPage = Math.floor(index / rowsPerPage) + 1;

      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    
  }, [selected]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
 
  // slice data subsets
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // sort by accending vs by table order
  const chartData = [...paginatedData].sort((a, b) => Number(a[xAxis]) - Number(b[xAxis]));
  // console.log('chartdata ', chartData)

  return (
    <DataProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <LeftPane
          xAxis={xAxis}
          yAxis={yAxis}
          setXAxis={setXAxis}
          setYAxis={setYAxis}
          fields={fields}
          chartData={chartData}
          selected={selected}
          setSelected={setSelected}
        />
{isLoading ? (
  <div className="text-lg">Fetching data...</div>
) : (
  <RightPane
    data={data}
    paginatedData={paginatedData}
    currentPage={currentPage}
    totalPages={totalPages}
    setCurrentPage={setCurrentPage}
    setSelected={setSelected}
    selected={selected}
  />
)}
      </div>
    </DataProvider>
  );
}