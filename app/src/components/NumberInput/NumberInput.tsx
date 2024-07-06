import { FC } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import styles from './NumberInput.module.scss';
import useLongPress from '@/utils/useLongPress.ts';

type Props = {
  value: number;
  setValue: (value: number) => void;
  min?: number;
};

const NumberInput: FC<Props> = ({ value, setValue, min = 0 }) => {
  const { start: startDecrement, stop: stopDecrement } = useLongPress(
    () => {
      if (value - 1 >= min) setValue(value - 1);
    },
    500,
    200
  );

  const { start: startIncrement, stop: stopIncrement } = useLongPress(
    () => {
      setValue(value + 1);
    },
    500,
    200
  );

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
          onMouseDown={startDecrement}
          onMouseUp={stopDecrement}
          onMouseLeave={stopDecrement}
          onTouchStart={startDecrement}
          onTouchEnd={stopDecrement}
          aria-label="Decrease value"
        />
        <BiPlus
          onMouseDown={startIncrement}
          onMouseUp={stopIncrement}
          onMouseLeave={stopIncrement}
          onTouchStart={startIncrement}
          onTouchEnd={stopIncrement}
          aria-label="Increase value"
        />
      </div>
    </div>
  );
};

export default NumberInput;
