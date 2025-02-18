import { jwtDecode } from "jwt-decode";
import { User } from "./app.model";
import { getUserById } from "./login/login.service";

const API_URL: string = "http://localhost:8080/api";

export const API_JWT_KEY: string = "BLOG_API_JWT";

export const getApiJwt = (): string => {
    return localStorage.getItem(API_JWT_KEY) as string;
}

export const setApiJwt = (jwtToken: string): void => {
    localStorage.setItem(API_JWT_KEY, jwtToken);
}

export const clearApiJwt = (): void => {
    localStorage.removeItem(API_JWT_KEY);
}

export const getApiUrl = () => {
    return API_URL;
}

export const getUserByToken = async (token: string | null): Promise<User | null> => {
    let decoded;
    if (token) {
        decoded = jwtDecode(token);
    } else {
        const storedToken = getApiJwt();
        if (storedToken) {
            decoded = jwtDecode(storedToken);
        }
    }
    if (decoded && decoded.sub) {
        return await getUserById(parseInt(decoded.sub));
    }

    return null;
}