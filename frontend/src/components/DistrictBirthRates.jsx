import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function DistrictBirthRates({ birthData }) {
  // Map the data to ensure it has a 'district' field instead of '_id'
  const formattedData = birthData.map(item => ({
    district: item._id,  // Assuming _id contains the district name
    totalBirths: item.totalBirths
  }));

  console.log("Formatted Birth Data in Chart:", formattedData);  // Check the formatted data

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="totalBirths"
          label={({ district, percent }) => `${district} ${(percent * 100).toFixed(0)}%`}  // Use 'district' for the label
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name, props) => [`${value} births`, props.payload.district]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
