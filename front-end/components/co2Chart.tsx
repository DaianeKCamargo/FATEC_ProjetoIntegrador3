'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

export default function Co2Chart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />
        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="co2"
          stroke="#16a34a"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}