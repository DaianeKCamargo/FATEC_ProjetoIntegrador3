'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Info } from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface Props {
  data: {
    month: string;
    total: number;
  }[];
}

export default function Co2Chart({ data }: Props) {
  return (
    <div className="chartContainer">
      <h2 className={styles.chartTitle}>
        CO2 reduzido por mês
        <span className={styles.infoTooltip} tabIndex={0} aria-label="Origem do dado de CO2">
          <Info size={18} aria-hidden="true" />
          <span className={styles.tooltipText}>
            O calculo feito e uma estimativa: CO2 reduzido (kg) = (quantidade de tampinhas x peso medio da tampinha em gramas / 1000) x fator de CO2 por kg de plastico. No fallback do sistema sao usados 2g por tampinha e fator 1,9 kg CO2/kg esses valores foram fornecido pelo ChatGPT por meio de fontes de artigos sustentaveis.
          </span>
        </span>
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} kg`, 'CO2 reduzido']} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#9d43c2"
            strokeWidth={3}
            dot={{ r: 4, fill: '#9d43c2' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
