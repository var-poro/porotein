import { BiLineChart, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import styles from './ExerciseChart.module.scss';
import { useEffect, useRef, useState } from 'react';
import { ExerciseChartView } from './components/ExerciseChartView';
import { ExerciseListView } from './components/ExerciseListView';
import { ExercisePerformance } from './types';
import { HiOutlineViewList } from 'react-icons/hi';

interface ExerciseChartProps {
  name: string;
  history?: ExercisePerformance[];
}

export const ExerciseChart = ({ name, history = [] }: ExerciseChartProps) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!history || history.length === 0) {
    return (
      <div className={styles.statTile}>
        <div className={styles.header}>
          <h4>{name}</h4>
        </div>
        <div className={styles.noData}>
          Pas encore d'historique disponible
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.statTile} ${styles.expanded}`} 
      ref={chartRef}
      data-view={viewMode}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.collapseButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <BiChevronDown /> : <BiChevronUp />}
          </button>
          <h4>{name}</h4>
        </div>
        <div className={styles.viewControls}>
        <button 
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? styles.active : ''}
            aria-label="Vue liste"
          >
            <HiOutlineViewList />
          </button>
          <button 
            onClick={() => setViewMode('chart')}
            className={viewMode === 'chart' ? styles.active : ''}
            aria-label='Vue graphique'
          >
            <BiLineChart />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className={styles.content}>
          {viewMode === 'chart' ? (
            <ExerciseChartView
              name={name}
              history={history}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
          ) : (
            <ExerciseListView history={history} />
          )}
        </div>
      )}
    </div>
  );
};