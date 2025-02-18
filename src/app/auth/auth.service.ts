import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from './auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }

    login(loginRequest: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>('/api/auth/login', loginRequest)
            .pipe(
                map(response => {
                    localStorage.setItem('currentUser', JSON.stringify(response));
                    this.currentUserSubject.next(response);
                    return response;
                })
            );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user?.user.role === 'admin';
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }
}