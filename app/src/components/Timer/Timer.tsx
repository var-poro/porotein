import { FC, useEffect, useState } from 'react';
import styles from './Timer.module.scss';
import { PiPauseBold, PiTriangleBold } from 'react-icons/pi';
import { GrPowerReset } from 'react-icons/gr';
import { IoWaterOutline } from 'react-icons/io5';
import { requestNotificationPermission, sendNotification } from '@/services/notificationService';

type Props = {
  seconds: number;
  setSeconds: (value: number) => void;
  defaultValue: number;
};

const Timer: FC<Props> = ({ seconds, setSeconds, defaultValue }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Restaurer l'état du timer au chargement
  useEffect(() => {
    const savedTimer = localStorage.getItem('timer_state');
    if (savedTimer) {
      const { savedSeconds, savedStartTime, wasRunning } = JSON.parse(savedTimer);
      if (savedSeconds && savedStartTime) {
        const elapsedTime = Math.floor(
          (Date.now() - new Date(savedStartTime).getTime()) / 1000
        );
        const remainingTime = savedSeconds - elapsedTime;
        if (remainingTime > 0) {
          setSeconds(remainingTime);
          setStartTime(new Date(savedStartTime));
          setIsRunning(wasRunning);
        } else {
          localStorage.removeItem('timer_state');
        }
      }
    }
  }, []);

  // Sauvegarder l'état du timer
  useEffect(() => {
    if (isRunning && startTime) {
      localStorage.setItem(
        'timer_state',
        JSON.stringify({
          savedSeconds: seconds,
          savedStartTime: startTime.toISOString(),
          wasRunning: isRunning
        })
      );
    } else if (!isRunning) {
      localStorage.removeItem('timer_state');
    }
  }, [isRunning, startTime, seconds]);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    };
    checkNotificationPermission();
  }, []);

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
          localStorage.removeItem('timer_state');
          if (notificationsEnabled) {
            sendNotification('Temps de repos terminé ! 💪', {
              body: 'C\'est reparti pour une nouvelle série !',
              requireInteraction: true
            });
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
          }
        } else {
          setSeconds(remainingTime);
          // Vibrer quand il reste 5 secondes ou moins
          if (remainingTime <= 5 && 'vibrate' in navigator) {
            navigator.vibrate(200);
          }
        }
      }, 1000);

      setIntervalId(interval);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime, seconds, notificationsEnabled]);

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
        <div className={styles.timer}>
          <small>
            <IoWaterOutline /> C'est le moment idéal pour boire une gorgée
            d'eau.
          </small>
          <br />
          <div className={styles.timeInputWrapper}>
            <input
              type="text"
              value={convertSecondsToTime(seconds)}
              onChange={(e) => handleInputChange(e.target.value)}
              style={{
                color: seconds <= 15 ? 'red' : '#000000',
              }}
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
