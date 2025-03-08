import { getSavedSessions } from '@/services/savedSessionService.ts';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { Loading } from '@/components';
import classes from './History.module.scss';
import { FaDumbbell, FaClock, FaCalendarCheck, FaFire } from 'react-icons/fa';
import { HistoryTile } from './components/HistoryTile';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { formatDuration } from '@/utils/formatDuration.ts'; 
import { HiOutlineViewList } from'react-icons/hi';
import { CiCalendar } from 'react-icons/ci'
import { SavedSession } from '@/types/SavedSession';

const History = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [filter, setFilter] = useState<'week' | 'month' | 'all'>('month');
  const { data = [], isLoading } = useQuery(['savedSessions', filter], 
    () => getSavedSessions(filter)
  );
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const toggleSession = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  if (isLoading) {
    return <Loading />;
  }

  const calculateStreak = () => {
    if (!data.length) return 0;
    
    const sortedDates = data
      .map((session: SavedSession) => new Date(session.performedAt).setHours(0, 0, 0, 0))
      .sort((a: number, b: number) => b - a);

    let streak = 1;
    const today = new Date().setHours(0, 0, 0, 0);
    let currentDate = sortedDates[0];

    // Si la dernière session n'est pas aujourd'hui ou hier, pas de streak
    if (currentDate < today - 86400000) return 0;

    for (let i = 1; i < sortedDates.length; i++) {
      if (currentDate - sortedDates[i] === 86400000) {
        streak++;
        currentDate = sortedDates[i];
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateStats = (currentData: SavedSession[]) => {
    const now = new Date();
    const previousPeriodData = data.filter((session: SavedSession) => {
      const date = new Date(session.performedAt);
      if (filter === 'week') {
        // Compare avec la semaine précédente
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return date.getTime() < weekAgo.getTime();
      } else if (filter === 'month') {
        // Compare avec le mois précédent
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return date.getTime() < monthAgo.getTime();
      }
      // Pour 'all', on compare avec la moitié du temps total
      const oldestDate = new Date(Math.min(...data.map((s: SavedSession) => new Date(s.performedAt).getTime())));
      const midPoint = new Date((now.getTime() + oldestDate.getTime()) / 2);
      return date < midPoint;
    });

    const currentStats = {
      sessionsCount: currentData.length,
      exercisesCount: currentData.reduce((acc, session) => acc + session.exercises.length, 0),
      totalDuration: currentData.reduce((acc, session) => acc + session.duration, 0),
      streak: calculateStreak(),
    };

    const previousStats = {
      sessionsCount: previousPeriodData.length,
      exercisesCount: previousPeriodData.reduce((acc: number, session: SavedSession) => acc + session.exercises.length, 0),
      totalDuration: previousPeriodData.reduce((acc: number, session: SavedSession) => acc + session.duration, 0),
    };

    return {
      current: currentStats,
      trends: {
        sessionsCount: currentStats.sessionsCount - previousStats.sessionsCount,
        exercisesCount: currentStats.exercisesCount - previousStats.exercisesCount,
        totalDuration: currentStats.totalDuration - previousStats.totalDuration,
      }
    };
  };

  const stats = calculateStats(data);

  return (
    <div className={classes.historyContainer}>
      <h1>Historique des séances</h1>
      
      <div className={classes.statsGrid}>
        <HistoryTile
          icon={FaCalendarCheck}
          value={stats.current.sessionsCount}
          label="Séances"
          trend={stats.trends.sessionsCount}
        />
        <HistoryTile
          icon={FaDumbbell}
          value={stats.current.exercisesCount}
          label="Exercices"
          trend={stats.trends.exercisesCount}
        />
        <HistoryTile
          icon={FaClock}
          value={formatDuration(stats.current.totalDuration)}
          label="Temps total"
          trend={stats.trends.totalDuration}
          formatTrend={(value) => formatDuration(Math.abs(value))}
        />
        <HistoryTile
          icon={FaFire}
          value={`${stats.current.streak}`}
          label={`jour${stats.current.streak > 1 ? 's' : ''} consécutif${stats.current.streak > 1 ? 's' : ''}`}
        />
      </div>

      <div className={classes.controlsRow}>
        <div className={classes.filters}>
          <button
            onClick={() => setFilter('week')}
            className={filter === 'week' ? classes.active : ''}
          >
            Semaine
          </button>
          <button
            onClick={() => setFilter('month')}
            className={filter === 'month' ? classes.active : ''}
          >
            Mois
          </button>
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? classes.active : ''}
          >
            Tout
          </button>
        </div>
    
        <div className={classes.viewControls}>
          <button 
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? classes.active : ''}
            aria-label="Vue liste"
          >
            <HiOutlineViewList />
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={viewMode === 'calendar' ? classes.active : ''}
            aria-label="Vue calendrier"
          >
            <CiCalendar />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <ListView 
          data={data}
          expandedSessionId={expandedSessionId}
          toggleSession={toggleSession}
        />
      ) : (
        <CalendarView 
          data={data}
          onSelectSession={toggleSession}
          filter={filter}
        />
      )}
    </div>
  );
};

export default History;