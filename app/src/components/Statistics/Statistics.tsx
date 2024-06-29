import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './Statistics.module.scss';

interface StatisticsProps {
  data: { date: string; value: number }[];
}

const Statistics: React.FC<StatisticsProps> = ({ data }) => (
  <div className={styles.statistics}>
    <h3>Statistiques</h3>
    <LineChart width={300} height={200} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#f5f5f5" />
      <Line type="monotone" dataKey="value" stroke="#ff7300" />
    </LineChart>
  </div>
);

export default Statistics;
