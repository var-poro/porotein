import axiosInstance from './axiosConfig';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  weightHistory: WeightDetail[];
  measurementsHistory: MeasurementDetail[];
  activeProgram?: string;
  isActive?: boolean;
  lastLogin?: string;
  emailVerified?: boolean;
  lastActivationEmailSent?: string;
  lastPasswordResetEmailSent?: string;
}

interface WeightDetail {
  date: string;
  weight: number;
}

interface MeasurementDetail {
  date: string;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    biceps: number;
    thighs: number;
  };
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/users/current');
    return response.data;
  },

  createUser: async (data: { username: string; email: string; password: string }): Promise<CreateUserResponse> => {
    const response = await axiosInstance.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  restoreUser: async (id: string): Promise<User> => {
    const response = await axiosInstance.post(`/users/${id}/restore`);
    return response.data;
  },

  login: async (email: string, password: string): Promise<{ user: User; accessToken: string }> => {
    const response = await axiosInstance.post('/auth/login', { 
      identifier: email,
      password 
    });
    return response.data;
  },

  // New methods for user management
  resendActivationEmail: async (userId: string): Promise<void> => {
    await axiosInstance.post(`/users/${userId}/resend-activation`);
  },

  resetPassword: async (userId: string): Promise<void> => {
    await axiosInstance.post(`/users/${userId}/reset-password`);
  },

  toggleUserStatus: async (userId: string, isActive: boolean): Promise<User> => {
    const response = await axiosInstance.put(`/users/${userId}/status`, { isActive });
    return response.data;
  },
};

export default userService; 