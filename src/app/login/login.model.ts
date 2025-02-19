import { User } from "../app.model";

export interface LoginRequest {
  email: string,
  password: string,
}

export interface LoginResponse {
  auth: string,
  user: User,
}