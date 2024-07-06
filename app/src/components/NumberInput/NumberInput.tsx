import { FC, useRef } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';
import styles from './NumberInput.module.scss';

type Props = {
  value: number;
  setValue: (value: number) => void;
  min?: number;
};

const handleMouseDown = (callback: () => void) => {
  callback();
  const initialDelay = 500;
  let intervalDelay = 200;
  const intervalStep = 50;
  const maxIntervalDelay = 50;
  let timeoutId: ReturnType<typeof setTimeout>;
  let intervalId: ReturnType<typeof setInterval>;

  const startInterval = () => {
    intervalId = setInterval(() => {
      callback();
      if (intervalDelay > maxIntervalDelay) {
        intervalDelay -= intervalStep;
        clearInterval(intervalId);
        startInterval();
      }
    }, intervalDelay);
  };

  timeoutId = setTimeout(() => {
    startInterval();
  }, initialDelay);

  const clearTimers = () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    intervalDelay = 200;
  };

  document.addEventListener('mouseup', clearTimers, { once: true });
  document.addEventListener('touchend', clearTimers, { once: true });
};

const NumberInput: FC<Props> = ({ value, setValue, min = 0 }) => {
  const touchStartedRef = useRef(false);

  const handleTouchStart = (callback: () => void) => {
    touchStartedRef.current = true;
    handleMouseDown(callback);
  };

  const handleMouseDownWithCheck = (callback: () => void) => {
    if (!touchStartedRef.current) {
      handleMouseDown(callback);
    }
    touchStartedRef.current = false;
  };

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
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent focus on the button
            handleMouseDownWithCheck(() => {
              if (value - 1 >= min) setValue(value - 1);
            });
          }}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent focus on the button
            handleTouchStart(() => {
              if (value - 1 >= min) setValue(value - 1);
            });
          }}
          aria-label="Decrease value"
        />
        <BiPlus
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent focus on the button
            handleMouseDownWithCheck(() => {
              setValue(value + 1);
            });
          }}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent focus on the button
            handleTouchStart(() => {
              setValue(value + 1);
            });
          }}
          aria-label="Increase value"
        />
      </div>
    </div>
  );
};

export default NumberInput;
