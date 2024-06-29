import { useQuery } from 'react-query';
import { getUserData } from '@/services/userService.ts';
import { User } from '@/types/User.ts';

export const useGetCurrentUser = () => {
  return useQuery<User>('currentUser', getUserData);
};
