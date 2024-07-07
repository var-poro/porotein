import { FC } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import styles from './NumberInput.module.scss';

type Props = {
  value: number;
  setValue: (value: number) => void;
  min?: number;
};

const NumberInput: FC<Props> = ({ value, setValue, min = 0 }) => {
  return (
    <div className={styles.numberInputContainer}>
      <input
        type="tel"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          setValue(isNaN(newValue) ? min : newValue);
        }}
      />
      <div className={styles.editInputContainer}>
        <BiMinus
          onClick={() => {
            if (value - 1 >= min) setValue(value - 1);
          }}
          aria-label="Decrease value"
        />
        <BiPlus
          onClick={() => {
            setValue(value + 1);
          }}
          aria-label="Increase value"
        />
      </div>
    </div>
  );
};

export default NumberInput;
