import axios from 'axios';

interface AuthCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: { username: string; password: string }): Promise<string> => {
  try {
    const response = await axios.post('http://localhost:8000/api-token-auth/', credentials);
    return response.data.token;
  } catch (error) {
    throw new Error('Ошибка авторизации');
  }
};