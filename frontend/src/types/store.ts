import type { User } from "./user";

export interface AuthState {
  acessToken: string | null;
  user: User | null;
  loading: boolean;

  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  )=> Promise<void>;

}