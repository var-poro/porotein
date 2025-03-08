import { IconType } from 'react-icons';
import classes from './HistoryTile.module.scss';
import { useState } from 'react';
import { IoIosTrendingDown, IoIosTrendingUp, IoMdRemove } from 'react-icons/io';
import { useEffect, useRef } from 'react';

interface HistoryTileProps {
  icon: IconType;
  value: string | number;
  label: string;
  trend?: number;
  formatTrend?: (value: number) => string;
}

export const HistoryTile = ({ icon: Icon, value, label, trend, formatTrend }: HistoryTileProps) => {
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

  const showTrend = trend !== undefined && trend !== 0;
  const formattedTrend = formatTrend ? formatTrend(trend!) : Math.abs(trend!);

  const getTrendIcon = () => {
    if (trend === 0) return <IoMdRemove />;
    if (!trend)
      return null;
    return trend > 0 ? <IoIosTrendingUp /> : <IoIosTrendingDown />;
  };

  return (
    <div className={`${classes.statTile} ${showTrendDetails ? classes.hasPopup : ''}`}>
      <div className={classes.statIcon}>
        <Icon />
      </div>
      <div className={classes.statContent}>
        <span className={classes.value}>{value}</span>
        <span className={classes.label}>{label}</span>
      </div>
      {showTrend && (
        <div 
          ref={trendRef}
          className={`${classes.trend} ${
            trend === 0 ? classes.neutral : trend > 0 ? classes.positive : classes.negative
          }`}
          onClick={() => setShowTrendDetails(!showTrendDetails)}
        >
          {getTrendIcon()}
          {showTrendDetails && (
            <div className={classes.trendPopup}>
              <strong>
                {trend === 0 ? formattedTrend : `${trend > 0 ? '+ ' : '- '}${formattedTrend}`}
              </strong>
              <p>
              {label}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};