import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ExercisePerformance } from '../types';
import styles from './ExerciseChartView.module.scss';

interface ExerciseChartViewProps {
  name: string;
  history: ExercisePerformance[];
  activeTooltip: number | null;
  setActiveTooltip: (index: number | null) => void;
}

export const ExerciseChartView = ({ name, history, activeTooltip, setActiveTooltip }: ExerciseChartViewProps) => (
  <div className={styles.chartView}>
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart 
        data={history}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        onClick={(e) => {
          if (e?.activeTooltipIndex !== undefined) {
            setActiveTooltip(e.activeTooltipIndex);
          }
        }}
      >
        <defs>
          <linearGradient id={`weightGradient-${name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C5DFA" stopOpacity={0.3}/>
            <stop offset="50%" stopColor="#7C5DFA" stopOpacity={0.1}/>
            <stop offset="100%" stopColor="#7C5DFA" stopOpacity={0.02}/>
          </linearGradient>
          <linearGradient id={`repsGradient-${name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ECC71" stopOpacity={0.3}/>
            <stop offset="50%" stopColor="#2ECC71" stopOpacity={0.1}/>
            <stop offset="100%" stopColor="#2ECC71" stopOpacity={0.02}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="var(--border-color)" 
          vertical={false}
          opacity={0.5}
        />
        <XAxis 
          dataKey="date" 
          stroke="var(--text-secondary)"
          fontSize={12}
          tickMargin={10}
          tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
        />
        <YAxis 
          yAxisId="weight"
          orientation="left"
          stroke="#7C5DFA"
          fontSize={12}
          tickMargin={5}
          width={35}
          domain={[0, 'dataMax + 2']}
        />
        <YAxis 
          yAxisId="reps"
          orientation="right"
          stroke="#2ECC71"
          fontSize={12}
          tickMargin={5}
          width={35}
          domain={[0, 'dataMax + 2']}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          wrapperStyle={{
            paddingTop: '20px',
            marginLeft: '-10px'
          }}
        />
        <Tooltip
          active
          trigger="click"
          cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            fontSize: '0.9em',
            zIndex: 1000
          }}
          labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
          wrapperStyle={{ visibility: activeTooltip !== null ? 'visible' : 'hidden' }}
        />
        <Area 
          yAxisId="weight"
          name="Poids"
          type="basis"
          dataKey="weight" 
          stroke="#7C5DFA" 
          strokeWidth={2}
          fill="#7C5DFA"
          fillOpacity={0.15}
          dot={false}
          activeDot={{ r: 6, strokeWidth: 2 }}
          isAnimationActive={false}
          baseValue={0}
        />
        <Area 
          yAxisId="reps"
          name="Répétitions"
          type="basis"
          dataKey="reps" 
          stroke="#2ECC71" 
          strokeWidth={2}
          fill="#2ECC71"
          fillOpacity={0.15}
          dot={false}
          activeDot={{ r: 6, strokeWidth: 2 }}
          isAnimationActive={false}
          baseValue={0}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);