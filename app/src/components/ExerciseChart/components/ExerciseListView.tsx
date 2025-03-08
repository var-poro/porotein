import { ExercisePerformance } from '../types';
import styles from './ExerciseListView.module.scss';
import { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { IoIosTrendingDown, IoIosTrendingUp, IoMdRemove } from 'react-icons/io';
import { FaDumbbell } from 'react-icons/fa';
import { TbRepeat } from 'react-icons/tb';

export const ExerciseListView = ({ history }: { history: ExercisePerformance[] }) => {
  const [compareIndex, setCompareIndex] = useState(1);

  const handlePrevious = () => {
    if (compareIndex < history.length - 1) {
      setCompareIndex(compareIndex + 1);
    }
  };

  const handleNext = () => {
    if (compareIndex > 1) {
      setCompareIndex(compareIndex - 1);
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current === previous) return <IoMdRemove />;
    return current > previous ? <IoIosTrendingUp /> : <IoIosTrendingDown />;
  };

  const currentSession = history[0];
  const comparedSession = history[compareIndex];

  return (
    <div className={styles.listView}>
      <div className={styles.navigation}>
        <button 
          onClick={handlePrevious}
          disabled={compareIndex >= history.length - 1}
          className={styles.navButton}
        >
          <BiChevronLeft />
        </button>
        <span className={styles.date}>
          {new Date(comparedSession.date).toLocaleDateString('fr-FR', { 
            day: '2-digit',
            month: 'long'
          })}
        </span>
        <button 
          onClick={handleNext}
          disabled={compareIndex <= 1}
          className={styles.navButton}
        >
          <BiChevronRight />
        </button>
      </div>

      <div className={styles.tiles}>
        <div className={styles.statTile}>
          <div className={styles.statIcon}>
            <FaDumbbell />
          </div>
          <div className={styles.statContent}>
            <span className={styles.value}>{currentSession.weight} kg</span>
            <span className={styles.label}>Poids</span>
          </div>
          <div className={`${styles.trend} ${
            currentSession.weight === comparedSession.weight 
              ? styles.neutral 
              : currentSession.weight > comparedSession.weight 
                ? styles.positive 
                : styles.negative
          }`}>
            {getTrendIcon(currentSession.weight, comparedSession.weight)}
            <span className={styles.trendValue}>
              {Math.abs(currentSession.weight - comparedSession.weight).toFixed(1)} kg
            </span>
          </div>
        </div>

        <div className={styles.statTile}>
          <div className={styles.statIcon}>
            <TbRepeat />
          </div>
          <div className={styles.statContent}>
            <span className={styles.value}>{currentSession.reps}</span>
            <span className={styles.label}>Répétitions</span>
          </div>
          <div className={`${styles.trend} ${
            currentSession.reps === comparedSession.reps 
              ? styles.neutral 
              : currentSession.reps > comparedSession.reps 
                ? styles.positive 
                : styles.negative
          }`}>
            {getTrendIcon(currentSession.reps, comparedSession.reps)}
            <span className={styles.trendValue}>
              {Math.abs(currentSession.reps - comparedSession.reps)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};