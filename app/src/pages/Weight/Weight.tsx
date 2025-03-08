import React from 'react';
import { useQuery } from 'react-query';
import { getWeightHistory } from '@/services/weightService';
import { Loading } from '@/components';
import styles from './Weight.module.scss';
import WeightChart from './components/WeightChart';
import WeightForm from './components/WeightForm';
import { WeightDetail } from '@/types/Weight';

const Weight: React.FC = () => {
  const { data: weightHistory, isLoading } = useQuery<WeightDetail[]>('weightHistory', getWeightHistory);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.weightPage}>
      <h1>Suivi du poids</h1>
      <div className={styles.content}>
        <WeightForm />
        {weightHistory && <WeightChart data={weightHistory} />}
      </div>
    </div>
  );
};

export default Weight;