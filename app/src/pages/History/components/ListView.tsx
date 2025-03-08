import { SavedExercise, SavedRepSet, SavedSession } from '@/types/SavedSession';
import { format } from 'date-fns';
import { MdToday, MdExpandMore, MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { FaClock, FaDumbbell } from 'react-icons/fa';
import { formatDuration } from '@/utils/formatDuration.ts';
import classes from './ListView.module.scss';
import { useState } from 'react';

interface ListViewProps {
  data: SavedSession[];
  expandedSessionId: string | null;
  toggleSession: (sessionId: string) => void;
}

const SessionExercises = ({ exercises }: { exercises: SavedExercise[] }) => {
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);

  const toggleExercise = (exerciseId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  return (
    <ul className={classes.exercises}>
      {exercises.map((savedExercise: SavedExercise) => (
        <li key={savedExercise._id} className={classes.exercise}>
          <div 
            className={classes.exerciseHeader}
            onClick={(e) => {savedExercise._id && toggleExercise(savedExercise._id, e)}}
          >
            <div className={classes.exerciseTitle}>
              {savedExercise._id && expandedExercises.includes(savedExercise._id) 
                ? <MdKeyboardArrowDown /> 
                : <MdKeyboardArrowRight />
              }
              <h4>{savedExercise.name}</h4>
            </div>
            <span className={classes.exerciseDuration}>
                <FaClock />
              {formatDuration(savedExercise.duration)}
            </span>
          </div>
          {savedExercise._id && expandedExercises.includes(savedExercise._id) && (
            <ul className={classes.repSets}>
              {savedExercise.savedRepSets.map((savedRepSet: SavedRepSet) => (
                <li key={savedRepSet._id} className={classes.repSet}>
                  <FaDumbbell />
                  {savedRepSet.repetitions} × {savedRepSet.weight}kg
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export const ListView = ({ data, expandedSessionId, toggleSession }: ListViewProps) => {
  if (data.length === 0) {
    return <p className={classes.noData}>Aucune session enregistrée pour cette période.</p>;
  }

  return (
    <div className={classes.listContainer}>
      {data.map((session: SavedSession) => (
        <div
          key={session._id}
          className={`${classes.savedSession} ${expandedSessionId === session._id ? classes.expanded : ''}`}
        >
          <div className={classes.sessionHeader} onClick={() => toggleSession(session._id)}>
            <div className={classes.sessionInfo}>
              <h3>{session?.session?.name}</h3>
              <p className={classes.date}>
                <MdToday />
                {format(new Date(session.performedAt), 'dd/MM/yyyy - HH:mm')}
              </p>
            </div>
            <div className={classes.sessionMeta}>
              <span className={classes.duration}>
                {formatDuration(session.duration)}
              </span>
              <MdExpandMore className={classes.expandIcon} />
            </div>
          </div>
          
          {expandedSessionId === session._id && (
            <SessionExercises exercises={session.savedExercises} />
          )}
        </div>
      ))}
    </div>
  );
};