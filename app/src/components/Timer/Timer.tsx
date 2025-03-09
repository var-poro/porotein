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
    }
  }, []);

  // Sauvegarder l'état du timer
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
    const checkNotificationPermission = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    };
    checkNotificationPermission();
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
  }, [isRunning, startTime, notificationsEnabled]);

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
              onChange={(e) => handleTimeChange(e.target.value)}
              style={{
                color: seconds <= 15 ? 'red' : '#000000',
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
