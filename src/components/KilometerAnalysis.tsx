"use client";

import React from 'react';
import { KilometerData } from '@/lib/strava';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface KilometerAnalysisProps {
  kilometerData: KilometerData[];
  loading?: boolean;
  onLoadData?: () => void;
  showLoadButton?: boolean;
}

const KilometerAnalysis: React.FC<KilometerAnalysisProps> = ({
  kilometerData,
  loading = false,
  onLoadData,
  showLoadButton = false
}) => {
  const hasData = kilometerData.length > 0;
  const hasHeartrate = kilometerData.some(km => km.heartrate);

  // Prepare chart data
  const chartData = kilometerData.map(km => ({
    ...km,
    speedKmh: km.speed
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Análisis por Kilómetro
        </h3>
        {showLoadButton && (
          <button
            onClick={onLoadData}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Cargando...
              </div>
            ) : (
              "Cargar Datos Detallados"
            )}
          </button>
        )}
      </div>

      {hasData ? (
        <>
          {/* Kilometer Data Table */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Datos por Kilómetro
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Km
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pace
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Elevación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FC
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kilometerData.map((kmData, index) => (
                    <tr 
                      key={kmData.km} 
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {kmData.km}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-mono">{kmData.pace}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`${kmData.elevation > 0 ? 'text-red-600' : kmData.elevation < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {kmData.elevation > 0 ? `+${kmData.elevation}` : kmData.elevation}m
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {kmData.heartrate ? (
                          <span className="text-red-600">{kmData.heartrate} bpm</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Desempeño por Kilómetro
            </h4>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="km" 
                    label={{ value: 'Kilómetro', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="elevation"
                    label={{ value: 'Elevación (m)', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="speed"
                    orientation="right"
                    label={{ value: 'Velocidad (km/h)', angle: 90, position: 'insideRight' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length > 0) {
                        const kmData = kilometerData.find(km => km.km === label);
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold">{`Kilómetro ${label}`}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }}>
                                {entry.name}: {entry.name === 'Elevación (m)' ? 
                                  `${entry.value}m` : 
                                  entry.name === 'Velocidad (km/h)' ? 
                                  `${(entry.value as number).toFixed(1)} km/h` :
                                  `${entry.value} bpm`
                                }
                              </p>
                            ))}
                            {kmData && (
                              <p className="text-blue-600 font-mono">
                                Pace: {kmData.pace} min/km
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="elevation"
                    dataKey="elevation" 
                    fill="#10b981" 
                    name="Elevación (m)"
                    opacity={0.7}
                  />
                  <Line 
                    yAxisId="speed"
                    type="monotone" 
                    dataKey="speedKmh"
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Velocidad (km/h)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#3b82f6' }}
                  />
                  {hasHeartrate && (
                    <Line 
                      yAxisId="speed"
                      type="monotone" 
                      dataKey="heartrate" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      strokeDasharray="8 8"
                      name="FC (bpm)"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: '#ef4444' }}
                      connectNulls={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Chart Legend Explanation */}
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-2">Leyenda del gráfico:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 opacity-70 mr-2"></div>
                  <span>Barras verdes: Elevación ganada por kilómetro</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-blue-500 mr-2"></div>
                  <span>Línea azul: Velocidad promedio</span>
                </div>
                {hasHeartrate && (
                  <div className="flex items-center">
                    <div className="w-4 h-1 bg-red-500 border-dashed border-t-2 mr-2"></div>
                    <span>Línea roja punteada: Frecuencia cardíaca</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : showLoadButton ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <p>Haz clic en "Cargar Datos Detallados" para ver el análisis por kilómetro</p>
          <p className="text-sm mt-2">Incluye pace, elevación y frecuencia cardíaca por kilómetro</p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No se pudieron procesar los datos detallados para esta actividad.</p>
          <p className="text-sm mt-2">Es posible que la actividad no tenga datos de streams disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default KilometerAnalysis;
