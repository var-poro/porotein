import { FC } from 'react';
import styles from './Timer.module.scss';
import { PiPauseBold, PiTriangleBold } from 'react-icons/pi';
import { GrPowerReset } from 'react-icons/gr';
import { IoMdInfinite } from 'react-icons/io';
import { useTimer } from './hooks/useTimer';

type Props = {
  seconds: number;
  defaultValue: number;
  onComplete?: () => void;
  onCountdownStart?: () => void;
  onTimeChange?: (newSeconds: number, isRunning: boolean) => void;
};

const Timer: FC<Props> = ({ seconds, defaultValue, onComplete, onCountdownStart, onTimeChange }) => {
  const {
    isRunning,
    isAutoMode,
    start,
    pause,
    reset,
    toggleAutoMode,
    handleTimeChange,
  } = useTimer({
    seconds,
    defaultValue,
    onComplete,
    onCountdownStart,
    onTimeChange,
  });

  const convertSecondsToTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
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
                onClick={start}
                aria-label="Démarrer le timer"
                className={styles.iconButton}
              >
                <PiTriangleBold className={styles.playButton} />
              </div>
            ) : (
              <div 
                onClick={pause}
                aria-label="Mettre en pause"
                className={styles.iconButton}
              >
                <PiPauseBold />
              </div>
            )}
            <div 
              onClick={reset}
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