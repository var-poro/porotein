import styles from './Tile.module.scss';
import { useState, useEffect, useRef } from 'react';
import { BiTime, BiDumbbell, BiLineChart } from 'react-icons/bi';
import { IoIosTrendingDown, IoIosTrendingUp, IoMdRemove } from 'react-icons/io';

interface TileProps {
  title: string;
  value: string | number;
  trend?: number;
  trendSuffix?: string;
  icon?: 'time' | 'performance' | 'stats';
}

export const Tile = ({ title, value, trend, trendSuffix = '%', icon }: TileProps) => {
  const [showTrendDetails, setShowTrendDetails] = useState(false);
  const trendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trendRef.current && !trendRef.current.contains(event.target as Node)) {
        setShowTrendDetails(false);
      }
    };

    if (showTrendDetails) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTrendDetails]);

  const getIcon = () => {
    switch (icon) {
      case 'time':
        return <BiTime />;
      case 'performance':
        return <BiDumbbell />;
      case 'stats':
        return <BiLineChart />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    if (!trend || trend === 0) return <IoMdRemove />;
    return trend > 0 ? <IoIosTrendingUp /> : <IoIosTrendingDown />;
  };

  const showTrend = trend !== undefined;
  const formattedTrend = Math.abs(trend || 0).toFixed(1) + trendSuffix;

  return (
    <div className={`${styles.statTile} ${showTrendDetails ? styles.hasPopup : ''}`}>
      <div className={styles.statIcon}>
        {getIcon()}
      </div>
      <div className={styles.statContent}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{title}</span>
      </div>
      {showTrend && (
        <div 
          ref={trendRef}
          className={`${styles.trend} ${
            !trend || trend === 0 ? styles.neutral : trend > 0 ? styles.positive : styles.negative
          }`}
          onClick={() => setShowTrendDetails(!showTrendDetails)}
        >
          {getTrendIcon()}
          {showTrendDetails && (
            <div className={styles.trendPopup}>
              <strong>
                {!trend || trend === 0 ? formattedTrend : `${trend > 0 ? '+ ' : '- '}${formattedTrend}`}
              </strong>
              <p>{title}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};