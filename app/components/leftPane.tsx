import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts';


export default function LeftPane({ xAxis, yAxis, setXAxis, setYAxis, fields, chartData, selected, setSelected }) {
    return (

        <div className="p-4 overflow-auto">
                  <h2 className="font-bold mb-4">Plotting Pane</h2>
                  <ResponsiveContainer 
                    width="100%" 
                    height={500}
                    >
                    <ScatterChart>
                      <CartesianGrid/>
                      <XAxis 
                      dataKey={(d) => Number(d[xAxis])}
                      name={xAxis}
                      tickFormatter={(value) => value?.toFixed?.(2)}
                      tick={{ 
                        angle: -35,
                        dx: -5,
                        dy: 5,
                        style: { 
                            fontSize: '0.75rem',
                            maxWidth: '1.25rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis' 
                            } 
                          }}
                      >
                        <Label 
                            value={xAxis} 
                            offset={-5} 
                            position="insideBottom" 
                        />
                      </XAxis>
                      <YAxis dataKey={(d) => Number(d[yAxis])} name={yAxis}>
                        <Label 
                            value={yAxis} 
                            angle={-90} 
                            position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip/>
                      <Scatter data={chartData} onClick={(e) => setSelected(e)}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={selected?.id === entry.id ? '#d62b2b' : '#3b782a'}
                            r={6}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="p-5 gap-2">
                    <label htmlFor="xAxisLabel">X: </label>
                    <select 
                        id="xAxisLabel" 
                        value={xAxis} 
                        onChange={(e) => setXAxis(e.target.value)}
                    >
                      {fields.map((f) => {
                            return <option key={f} value={f}>{f}</option>
                    })}
                    </select>
                    <label htmlFor="yAxisLabel">Y: </label>
                    <select 
                        id="yAxisLabel" 
                        value={yAxis}
                        onChange={(e) => setYAxis(e.target.value)}
                    >
                        {fields.map((f) => {
                            return <option key={f} value={f}>{f}</option>
                    })}
                    </select>
                  </div>
                  
                </div>
    );
}