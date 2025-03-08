import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BiChevronDown, BiChevronUp, BiLineChart, BiPlus } from 'react-icons/bi';
import { HiOutlineViewList } from 'react-icons/hi';
import styles from './WeightChart.module.scss';
import { WeightDetail } from '@/types/Weight';  // Updated import
import WeightForm from './WeightForm';
import { useMutation, useQueryClient } from 'react-query';
import { deleteWeightEntry } from '@/services/weightService';
import { DotProps } from 'recharts';

interface WeightChartProps {
  data: WeightDetail[];
}

interface CustomDotProps extends DotProps {
  index: number;
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const [selectedEntry, setSelectedEntry] = useState<WeightDetail | undefined>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  const queryClient = useQueryClient();
  const deleteMutation = useMutation(deleteWeightEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries('userData');
      setSelectedEntry(undefined);
      setIsFormVisible(false);
    },
  });

  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formattedData = sortedData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('fr-FR'),
    weight: entry.weight
  }));

  if (!data || data.length === 0) {
    return (
      <div className={styles.statTile}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h4>Évolution du poids</h4>
          </div>
          <div className={styles.viewControls}>
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className={`${styles.addButton} ${isFormVisible ? styles.active : ''}`}
              aria-label="Ajouter une pesée"
            >
              <BiPlus />
            </button>
          </div>
        </div>
        {isFormVisible ? (
          <WeightForm />
        ) : (
          <div className={styles.noData}>
            <p>Pas encore d'historique disponible</p>
            <button 
              onClick={() => setIsFormVisible(true)}
              className={styles.addFirstWeight}
            >
              Ajouter ma première pesée
            </button>
          </div>
        )}
      </div>
    );
  }

  const handleEntryClick = (entry: WeightDetail) => {
    setSelectedEntry(entry);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className={`${styles.statTile} ${styles.expanded}`} data-view={viewMode}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.collapseButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <BiChevronDown /> : <BiChevronUp />}
          </button>
          <h4>Évolution du poids</h4>
        </div>
        <div className={styles.viewControls}>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className={`${styles.addButton} ${isFormVisible ? styles.active : ''}`}
            aria-label="Ajouter une pesée"
          >
            <BiPlus />
          </button>
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
          {isFormVisible && (
            <WeightForm 
              initialData={selectedEntry} 
              onDelete={handleDelete}
            />
          )}
          {viewMode === 'chart' ? (
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart 
                  data={formattedData} 
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    domain={[0, 'auto']}
                    axisLine={false}
                    tickLine={false}
                    padding={{ top: 10, bottom: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'var(--background-secondary)',
                      border: '1px solid var(--border-color)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="var(--primary-color)"
                    fill="var(--primary-color)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    dot={{ 
                      fill: 'var(--primary-color)', 
                      r: 4,
                      onClick: (e: CustomDotProps) => {
                        if (e && 'index' in e) {
                          handleEntryClick(sortedData[e.index]);
                        }
                      }
                    }}
                    activeDot={{ 
                      r: 6, 
                      strokeWidth: 0,
                      onClick: (e: CustomDotProps) => {
                        if (e && 'index' in e) {
                          handleEntryClick(sortedData[e.index]);
                        }
                      }
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={styles.listView}>
              {sortedData.map((entry) => (
                <div 
                  key={entry._id}
                  className={styles.listItem}
                  onClick={() => handleEntryClick(entry)}
                >
                  <span>{new Date(entry.date).toLocaleDateString('fr-FR')}</span>
                  <span>{entry.weight} kg</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeightChart;