import { FC, useEffect, useState, useRef } from 'react';
import styles from './Timer.module.scss';
import { PiPauseBold, PiTriangleBold } from 'react-icons/pi';
import { GrPowerReset } from 'react-icons/gr';
import { IoMdInfinite } from 'react-icons/io';

const AUTO_MODE_KEY = 'timer_auto_mode';

type Props = {
  seconds: number;
  setSeconds: (value: number) => void;
  defaultValue: number;
  onComplete?: () => void;
};

const Timer: FC<Props> = ({ seconds, setSeconds, defaultValue, onComplete }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(() => {
    const savedAutoMode = localStorage.getItem(AUTO_MODE_KEY);
    return savedAutoMode ? JSON.parse(savedAutoMode) : false;
  });
  
  const endTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const currentTimeRef = useRef<number>(defaultValue);
  const lastUpdateRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  // Single effect to handle all timer logic
  useEffect(() => {
    // Initialize timer only once
    if (!isInitializedRef.current) {
      currentTimeRef.current = defaultValue;
      setSeconds(defaultValue);
      localStorage.removeItem('timer_state');
      isInitializedRef.current = true;
    }

    const updateTimer = () => {
      if (!isRunning || !endTimeRef.current) return;

      const now = Date.now();
      const remaining = Math.max(0, endTimeRef.current - now);
      const newSeconds = Math.ceil(remaining / 1000);

      // Only update if enough time has passed since last update
      if (newSeconds !== currentTimeRef.current && now - lastUpdateRef.current >= 1000) {
        currentTimeRef.current = newSeconds;
        setSeconds(newSeconds);
        lastUpdateRef.current = now;
      }

      if (newSeconds <= 0) {
        setIsRunning(false);
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        localStorage.removeItem('timer_state');

        if (isAutoMode) {
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 3000);
        }
        return;
      }

      frameRef.current = requestAnimationFrame(updateTimer);
    };

    // Initialize timer state
    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + currentTimeRef.current * 1000;
      }
      frameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      endTimeRef.current = null;
    }

    // Save state to localStorage when running
    if (isRunning) {
      localStorage.setItem(
        'timer_state',
        JSON.stringify({
          endTime: endTimeRef.current,
          wasRunning: isRunning
        })
      );
    } else {
      localStorage.removeItem('timer_state');
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isRunning, isAutoMode, onComplete, setSeconds, defaultValue]);

  const handleStart = () => {
    if (!isRunning && currentTimeRef.current > 0) {
      setIsRunning(true);
      endTimeRef.current = Date.now() + currentTimeRef.current * 1000;
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
      localStorage.removeItem('timer_state');
    }
  };

  const handleReset = () => {
    currentTimeRef.current = defaultValue;
    setSeconds(defaultValue);
    endTimeRef.current = Date.now() + defaultValue * 1000;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    localStorage.removeItem('timer_state');
    setIsRunning(true);
  };

  const toggleAutoMode = () => {
    const newAutoMode = !isAutoMode;
    setIsAutoMode(newAutoMode);
    localStorage.setItem(AUTO_MODE_KEY, JSON.stringify(newAutoMode));
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
    currentTimeRef.current = totalSeconds;
    setSeconds(totalSeconds);
    if (isRunning) {
      endTimeRef.current = Date.now() + totalSeconds * 1000;
    }
  };

  const getTimerColor = () => {
    if (seconds <= 15) {
      return '#FF9800';
    }
    return 'var(--text-color)';
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
              aria-label="Temps restant"
              title="Temps restant"
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
              aria-label="Définir le temps"
              title="Définir le temps"
            />
          </div>
          <div className={styles.buttonsContainer}>
            {!isRunning ? (
              <div 
                onClick={handleStart}
                aria-label="Démarrer le timer"
                className={styles.iconButton}
              >
                <PiTriangleBold className={styles.playButton} />
              </div>
            ) : (
              <div 
                onClick={handlePause}
                aria-label="Mettre en pause"
                className={styles.iconButton}
              >
                <PiPauseBold />
              </div>
            )}
            <div 
              onClick={handleReset}
              aria-label="Réinitialiser le timer"
              className={styles.iconButton}
            >
              <GrPowerReset />
            </div>
            <div
              onClick={toggleAutoMode}
              aria-label="Mode automatique"
              className={`${styles.iconButton} ${isAutoMode ? styles.autoModeActive : ''}`}
              title={isAutoMode ? "Désactiver le mode automatique" : "Activer le mode automatique"}
            >
              <IoMdInfinite />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;