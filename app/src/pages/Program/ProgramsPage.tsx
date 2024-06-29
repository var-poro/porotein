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

  const handleSetFavoriteProgram = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    updateUserMutation.mutate({ activeProgram: id });
  };

  if (isLoadingUser || isLoadingPrograms) {
    return <Loading />;
  }

  return (
    <div className={styles.programsPage}>
      {programs && (
        <>
          <div>
            <div className={styles.activeProgram}>
              <div
                className={styles.activeProgramHeader}
                onClick={handleAddNewProgram}
              >
                <h2>Mon programme</h2>
                <FaPlus />
              </div>
              {user?.activeProgram && (
                <div className={styles.programItem}>
                  <div className={styles.programItemHeader}>
                    <h3>{(user.activeProgram as Program).name}</h3>
                    <Link
                      to={`/programs/edit/${(user.activeProgram as Program)._id}`}
                    >
                      <GrEdit />
                    </Link>
                  </div>
                  <span>{(user.activeProgram as Program).description}</span>
                </div>
              )}
            </div>
          </div>
          <div className={styles.otherPrograms}>
            <h2>Autres programmes</h2>
            {programs
              .filter(
                (program) =>
                  program._id !== (user?.activeProgram as Program)?._id
              )
              .map((program) => (
                <div key={program._id} className={styles.programItem}>
                  <div className={styles.programItemHeader}>
                    <h3>{program.name}</h3>
                    <Link to={`/programs/edit/${program._id}`}>
                      <GrEdit />
                    </Link>
                  </div>
                  <p>{program.description}</p>
                  <button
                    className={styles.markAsFavorite}
                    onClick={(e) => handleSetFavoriteProgram(e, program._id)}
                  >
                    <span>Marquer comme actif</span>
                    <AiTwotoneStar />
                  </button>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgramsPage;
