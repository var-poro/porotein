import { FC, useEffect, useState } from 'react';
import styles from './Timer.module.scss';
import { PiPauseBold, PiTriangleBold } from 'react-icons/pi';
import { GrPowerReset } from 'react-icons/gr';

type Props = {
  seconds: number;
  setSeconds: (value: number) => void;
  defaultValue: number;
};

const Timer: FC<Props> = ({ seconds, setSeconds, defaultValue }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timerKey, setTimerKey] = useState(Date.now());

  useEffect(() => {
    const savedTimer = localStorage.getItem('timer_state');
    if (savedTimer) {
      try {
        const { endTime, wasRunning } = JSON.parse(savedTimer);
        if (endTime) {
          const now = new Date();
          const end = new Date(endTime);
          const remainingTime = Math.ceil((end.getTime() - now.getTime()) / 1000);
          
          if (remainingTime > 0) {
            setSeconds(remainingTime);
            setStartTime(new Date(end.getTime() - remainingTime * 1000));
            setIsRunning(wasRunning);
          } else {
            localStorage.removeItem('timer_state');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la restauration du timer:', error);
        localStorage.removeItem('timer_state');
      }
    }
  }, [timerKey]);

  useEffect(() => {
    if (isRunning && startTime) {
      localStorage.setItem(
        'timer_state',
        JSON.stringify({
          endTime: new Date(startTime.getTime() + seconds * 1000).toISOString(),
          wasRunning: isRunning
        })
      );
    } else if (!isRunning) {
      localStorage.removeItem('timer_state');
    }
  }, [isRunning, startTime, seconds]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('Timer: Application mise en arrière-plan');
      } else if (document.visibilityState === 'visible') {
        console.log('Timer: Application remise au premier plan');
        setTimerKey(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      const endTime = startTime ? 
        new Date(startTime.getTime() + seconds * 1000) : 
        new Date(Date.now() + seconds * 1000);

      if (!startTime) {
        setStartTime(new Date());
      }

      interval = setInterval(() => {
        const now = new Date();
        const remainingTime = Math.max(0, Math.ceil((endTime.getTime() - now.getTime()) / 1000));

        if (remainingTime <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          setSeconds(0);
          localStorage.removeItem('timer_state');
        } else {
          setSeconds(remainingTime);
        }
      }, 100); // Intervalle plus court pour une mise à jour plus fluide

      setIntervalId(interval);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime, timerKey]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(new Date());
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
      localStorage.removeItem('timer_state');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(defaultValue);
    setStartTime(null);
    localStorage.removeItem('timer_state');
  };

  const convertSecondsToTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleTimeChange = (value: string) => {
    const [minutes, seconds] = value.split(':').map(Number);
    const totalSeconds = minutes * 60 + (seconds || 0);
    setSeconds(totalSeconds);
    if (isRunning) {
      setStartTime(new Date());
    }
  };

  const getTimerColor = () => {
    if (seconds <= 15) {
      return '#FF9800';
    }
    return '#000000';
  };

  return (
    <div>
      <div className={styles.timerContainer}>
        <div className={styles.timer}>
          <div className={styles.timeInputWrapper}>
            <input
              type="text"
              value={convertSecondsToTime(seconds)}
              onChange={(e) => handleTimeChange(e.target.value)}
              style={{
                color: getTimerColor(),
              }}
              className={styles.timeDisplay}
            />
            <input
              type="time"
              value={convertSecondsToTime(defaultValue)}
              onChange={(e) => handleTimeChange(e.target.value)}
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
            <span onClick={handleReset}>
              <GrPowerReset />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
