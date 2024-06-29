import { useMutation, useQueryClient } from 'react-query';
import { login, register } from '../services/authService';
import { setToken, removeToken, getUserFromToken } from '../utils/tokenUtils';

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation(login, {
        onSuccess: (data) => {
            setToken(data.accessToken);
            queryClient.invalidateQueries('user');
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation(register, {
        onSuccess: () => {
            queryClient.invalidateQueries('user');
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return () => {
        removeToken();
        queryClient.invalidateQueries('user');
    };
};

export const useUser = () => {
    const user = getUserFromToken();
    return user;
};