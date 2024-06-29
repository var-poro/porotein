import {jwtDecode} from 'jwt-decode';

export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export interface DecodedToken {
    userId: string;
    username: string;
    email: string;
    exp: number;
}

export const getUserFromToken = (): DecodedToken | null => {
    const token = getToken();
    if (token) {
        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Invalid token:', error);
            removeToken();
            return null;
        }
    }
    return null;
};