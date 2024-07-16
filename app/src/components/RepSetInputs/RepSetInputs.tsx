import { FC } from 'react';
import { GiWeight, GiWeightLiftingUp } from 'react-icons/gi';
import NumberInput from '@/components/NumberInput/NumberInput.tsx';
import styles from './RepSetInputs.module.scss';

type Props = {
  repetitions: number;
  withLabels?: boolean;
  setRepetitions: (value: number) => void;
  weight: number;
  setWeight: (value: number) => void;
};

const RepSetInputs: FC<Props> = ({
  repetitions,
  withLabels,
  setRepetitions,
  weight,
  setWeight,
}) => {
  return (
    <div className={styles.repetitionsContainer}>
      <div className={styles.inputContainer}>
        {withLabels && (
          <label>
            Répétitions <GiWeightLiftingUp />
          </label>
        )}
        <NumberInput value={repetitions} setValue={setRepetitions} min={1} />
      </div>
      <span className={styles.times}>x</span>
      <div className={styles.inputContainer}>
        {withLabels && (
          <label>
            Poids <GiWeight />
          </label>
        )}
        <div className={styles.weightInput}>
          <NumberInput value={weight} setValue={setWeight} min={0} />
          <small>kg</small>
        </div>
      </div>
    </div>
  );
};

export default RepSetInputs;
