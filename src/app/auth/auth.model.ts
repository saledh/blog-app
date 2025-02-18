export interface LoginRequest {
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  }