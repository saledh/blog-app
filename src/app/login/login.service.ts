import axios, { AxiosHeaders } from "axios"
import { LoginRequest, LoginResponse } from "./login.model";
import { User } from "../app.model";
import { getApiJwt, getApiUrl } from "../environment";

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
    const url = `${getApiUrl()}/auth/login`;
    const resp = await axios.post<LoginResponse>(url, request);
    return resp.data;
}

export const getUserById = async (id: number): Promise<User> => {
    const url = `${getApiUrl()}/auth/user/${id}`;

    const jwtToken = getApiJwt();

    const headers = {
        Authorization: `Bearer ${jwtToken}`
    };

    const resp = await axios.get<User>(url, { headers: headers });
    return resp.data;
}