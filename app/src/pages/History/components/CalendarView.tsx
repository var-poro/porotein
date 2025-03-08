import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SavedSession } from '@/types/SavedSession';
import classes from './CalendarView.module.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MdChevronLeft, MdChevronRight, MdToday } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface CalendarViewProps {
  data: SavedSession[];
  onSelectSession: (sessionId: string) => void;
  filter: 'week' | 'month' | 'all';
}

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface ToolbarProps {
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  messages: {
    previous: string;
    next: string;
    today: string;
  };
}

const CustomToolbar = ({ label, onNavigate, messages }: ToolbarProps) => {
  return (
    <div className={classes.toolbar}>
      <span className={classes.label}>
        {label}
      </span>
      <span className={classes.navigation}>
        <button onClick={() => onNavigate('PREV')} aria-label={messages?.previous}>
          <MdChevronLeft />
        </button>
        <button onClick={() => onNavigate('TODAY')} aria-label={messages?.today}>
          <MdToday />
        </button>
        <button onClick={() => onNavigate('NEXT')} aria-label={messages?.next}>
          <MdChevronRight />
        </button>
      </span>
    </div>
  );
};

const CustomHeader = ({ date, localizer, view }: { 
  date: Date; 
  localizer: { format: (date: Date, format: string) => string }; 
  view: string 
}) => {
  const day = localizer.format(date, 'dd');
  const weekday = localizer.format(date, 'EEE');
  
  if (view === 'week') {
    return (
      <div className={classes.headerCell}>
        <span className={classes.dayNumber}>{day}</span>
        <span className={classes.weekday}>{weekday}</span>
      </div>
    );
  }
  
  return <span>{weekday}</span>;
};

export const CalendarView = ({ data, filter }: CalendarViewProps) => {
  const navigate = useNavigate();

  const events = data.map(savedSession => {

    const startDate = new Date(savedSession.performedAt);
    const endDate = new Date(startDate.getTime() + (savedSession.duration));
    return {
      title: savedSession.session?.name,
      start: startDate,
      end: endDate,
      resource: savedSession,
    };
  });

  const calendarView = filter === 'week' ? 'week' : 'month';

  return (
    <div className={classes.calendarContainer}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="fr"
        defaultView={calendarView}
        views={['week', 'month']}
        messages={{
          today: "Aujourd'hui",
          previous: 'Précédent',
          next: 'Suivant',
          month: 'Mois',
          week: 'Semaine',
        }}
        onSelectEvent={(event) => {
          navigate(`/workout/${event.resource._id}/recap`);
        }}
        components={{
          toolbar: (props) => <CustomToolbar {...props} messages={{
            previous: 'Précédent',
            next: 'Suivant',
            today: "Aujourd'hui"
          }} />,
          header: ({ date, localizer }) => (
            <CustomHeader date={date} localizer={localizer} view={calendarView} />
          )
        }}
      />
    </div>
  );
};