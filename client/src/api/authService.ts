import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return data;
}
