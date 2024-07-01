import { FC, useEffect, useState } from 'react';
import styles from './Timer.module.scss';
import { PiPauseBold, PiTriangleBold } from 'react-icons/pi';
import { GrPowerReset } from 'react-icons/gr';

type Props = {
  defaultValue: number;
};

const Timer: FC<Props> = ({ defaultValue }) => {
  const [seconds, setSeconds] = useState(defaultValue);
  const [isRunning, setIsRunning] = useState(true); // Start running by default
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      const now = new Date();
      if (!startTime) {
        setStartTime(now);
      }

      interval = setInterval(() => {
        const elapsedTime = Math.floor(
          (new Date().getTime() - (startTime?.getTime() || now.getTime())) /
            1000
        );
        const remainingTime = seconds - elapsedTime;

        if (remainingTime <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          setSeconds(0);
        } else {
          setSeconds(remainingTime);
        }
      }, 1000);

      setIntervalId(interval);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(new Date());
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
    setStartTime(null);
  };

  const convertSecondsToTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleInputChange = (value: string) => {
    const [minutes, seconds] = value.split(':').map(Number);
    const totalSeconds = minutes * 60 + (seconds || 0);
    setSeconds(totalSeconds);
    setStartTime(new Date());
  };

  const handleTimeInputChange = (value: string) => {
    const [minutes, seconds] = value.split(':').map(Number);
    const totalSeconds = minutes * 60 + (seconds || 0);
    setSeconds(totalSeconds);
    setStartTime(new Date());
  };

  return (
    <div>
      <div className={styles.timerContainer}>
        <span>Temps de repos</span>
        <br />
        <div className={styles.timer}>
          <div className={styles.timeInputWrapper}>
            <input
              type="text"
              value={convertSecondsToTime(seconds)}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={isRunning}
              className={styles.timeDisplay}
            />
            <input
              type="time"
              value={convertSecondsToTime(defaultValue)}
              onChange={(e) => handleTimeInputChange(e.target.value)}
              className={styles.timePicker}
              min={'00:00'}
              max={'59:59'}
              pattern="[0-9]{2}:[0-9]{2}"
              step={1}
            />
          </div>
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
