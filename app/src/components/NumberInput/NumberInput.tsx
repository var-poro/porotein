import { FC, useCallback, useRef } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import styles from './NumberInput.module.scss';

type Props = {
  value: number;
  setValue: (value: number) => void;
  min?: number;
};

const INITIAL_DELAY = 500;
const INITIAL_INTERVAL = 250;
const MIN_INTERVAL = 50;
const ACCELERATION_RATE = 0.85;

const handleValueChange = (
  type: 'increase' | 'decrease',
  value: number,
  setValue: (value: number) => void,
  min: number
) => {
  if (type === 'decrease' && value - 1 >= min) {
    setValue(value - 1);
  } else if (type === 'increase') {
    setValue(value + 1);
  }
};

const NumberInput: FC<Props> = ({ value, setValue, min = 0 }) => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const valueRef = useRef(value);
  const currentIntervalRef = useRef(INITIAL_INTERVAL);
  
  valueRef.current = value;

  const startChanging = useCallback((type: 'increase' | 'decrease') => {
    handleValueChange(type, valueRef.current, setValue, min);
    currentIntervalRef.current = INITIAL_INTERVAL;
    
    const accelerate = () => {
      handleValueChange(type, valueRef.current, setValue, min);
      currentIntervalRef.current = Math.max(
        MIN_INTERVAL,
        currentIntervalRef.current * ACCELERATION_RATE
      );
      intervalRef.current = setTimeout(accelerate, currentIntervalRef.current);
    };
    
    timeoutRef.current = setTimeout(accelerate, INITIAL_DELAY);
  }, [setValue, min]);

  const stopChanging = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className={styles.numberInputContainer}>
      <input
        title="NumberInput"
        type="tel"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          setValue(isNaN(newValue) ? min : newValue);
        }}
      />
      <div className={styles.editInputContainer}>
        <BiMinus
          onTouchStart={() => startChanging('decrease')}
          onTouchEnd={stopChanging}
          onContextMenu={(e: React.MouseEvent<SVGElement>) => e.preventDefault()}
          aria-label="Decrease value"
        />
        <BiPlus
          onTouchStart={() => startChanging('increase')}
          onTouchEnd={stopChanging}
          onContextMenu={(e: React.MouseEvent<SVGElement>) => e.preventDefault()}
          aria-label="Increase value"
        />
      </div>
    </div>
  );
};

export default NumberInput;