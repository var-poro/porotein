import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getPrograms } from '@/services/programService';
import { getUserData, updateUserData } from '@/services/userService';
import { Program } from '@/types/Program';
import { User } from '@/types/User';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProgramsPage.module.scss';
import { Loading } from '@/components';
import { AiTwotoneStar } from 'react-icons/ai';
import { GrEdit } from 'react-icons/gr';
import { FaPlus } from 'react-icons/fa6';

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery<User>(
    'user',
    getUserData
  );
  const { data: programs, isLoading: isLoadingPrograms } = useQuery<Program[]>(
    'programs',
    getPrograms
  );

  const updateUserMutation = useMutation(updateUserData, {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
    },
  });

  const handleAddNewProgram = () => {
    navigate('/programs/create');
  };

  const handleSetFavoriteProgram = (e: React.MouseEvent, programId: string) => {
    e.preventDefault();
    updateUserMutation.mutate({ activeProgram: programId });
  };

  if (isLoadingUser || isLoadingPrograms) {
    return <Loading />;
  }

  const activeProgramId = user?.activeProgram || '';

  return (
    <div className={styles.programsPage}>
      <div className={styles.header}>
        <h1>Programs</h1>
        <button 
          onClick={handleAddNewProgram} 
          className={styles.addButton}
          title="Add New Program"
        >
          <FaPlus /> Add New Program
        </button>
      </div>
      <div className={styles.programsList}>
        {programs?.map((program) => (
          <Link
            key={program._id}
            to={`/programs/${program._id}`}
            className={styles.programCard}
          >
            <div className={styles.programHeader}>
              <h2>{program.name}</h2>
              <button
                onClick={(e) => handleSetFavoriteProgram(e, program._id)}
                className={`${styles.favoriteButton} ${
                  program._id === activeProgramId ? styles.active : ''
                }`}
                title={program._id === activeProgramId ? "Remove from favorites" : "Mark as favorite"}
              >
                <AiTwotoneStar />
              </button>
            </div>
            <p>{program.description}</p>
            <div className={styles.programFooter}>
              <span>{program.sessions.length} sessions</span>
              <button 
                className={styles.editButton}
                title="Edit program"
              >
                <GrEdit />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProgramsPage;
