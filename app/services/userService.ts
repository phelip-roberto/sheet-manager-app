import api from './api';
import { User } from '../types/User';

export const getUsers = async (token: string): Promise<User[]> => {
  const res = await api.get<User[]>('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};