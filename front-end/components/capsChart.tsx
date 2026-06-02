'use client';

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';

interface Props {
  data: {
    month: string;
    total: number;
  }[];
}

export default function CapsChart({ data }: Props) {
  return (
    <div className="chartContainer">
      <h2>Tampinhas por mês (un)</h2>

      <ResponsiveContainer width="100%" height={410}>
        <BarChart data={data} margin={{ top: 28, right: 18, left: 18, bottom: 8 }}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="month" />
          <Tooltip />
          <Bar dataKey="total" fill="#1e88e5" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="total" position="top" fontWeight={700} fontSize={14} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
