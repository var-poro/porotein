import React from 'react';
import styles from './ProgramSelector.module.scss';
import { Program } from '@/types/Program';

interface ProgramSelectorProps {
  programs: Program[];
  activeProgramId: string;
  onSelectProgram: (programId: string) => void;
}

const ProgramSelector: React.FC<ProgramSelectorProps> = ({
  programs,
  activeProgramId,
  onSelectProgram,
}) => (
  <div className={styles.programSelector}>
    <select
      value={activeProgramId}
      onChange={(e) => onSelectProgram(e.target.value)}
    >
      {programs.map((program) => (
        <option key={program._id} value={program._id}>
          {program.name}
        </option>
      ))}
    </select>
  </div>
);

export default ProgramSelector;
