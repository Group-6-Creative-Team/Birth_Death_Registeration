import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DistrictDeathRates({ deathData }) {
  console.log("Death Data in Chart:", deathData);  // Check what data is passed here

  // Ensure the data has 'district' and 'totalDeaths' keys
  const formattedDeathData = deathData.map(item => ({
    district: item._id,  // _id contains the district name
    totalDeaths: item.totalDeaths,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedDeathData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="district" /> {/* Use district name as the label */}
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalDeaths" fill="#82ca9d" /> {/* Correct dataKey for deaths */}
      </BarChart>
    </ResponsiveContainer>
  );
}
