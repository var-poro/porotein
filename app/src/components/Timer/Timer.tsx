import { FC, useEffect, useState } from 'react';
import styles from './Timer.module.scss';
import { PiPauseBold, PiTriangleBold } from 'react-icons/pi';
import { GrPowerReset } from 'react-icons/gr';

type Props = {
  defaultValue: number;
};

const Timer: FC<Props> = ({ defaultValue }) => {
  const [seconds, setSeconds] = useState(defaultValue);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            clearInterval(interval);
            setIsRunning(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
      setIntervalId(interval);
    } else if (intervalId) {
      clearInterval(intervalId);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(defaultValue);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleInputChange = (value: string) => {
    const [mins, secs] = value.split(':').map(Number);
    setSeconds(mins * 60 + (secs || 0));
  };

  return (
    <div>
      <div className={styles.timerContainer}>
        <span>Temps de repos</span>
        <br />
        <div className={styles.timer}>
          <input
            type="text"
            value={formatTime(seconds)}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={isRunning}
          />
          <div className={styles.buttonsContainer}>
            {!isRunning ? (
              <span onClick={handleStart}>
                <PiTriangleBold className={styles.playButton} />
              </span>
            ) : (
              <span onClick={handlePause}>
                <PiPauseBold />
              </span>
            )}
            {defaultValue !== seconds && (
              <span className={styles.reset} onClick={handleReset}>
                <GrPowerReset className={styles.resetButton} />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
