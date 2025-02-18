import { AxiosError } from './../../../node_modules/axios/index.d';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { getUserByToken, setApiJwt } from '../environment';
import { login } from './login.service';

@Component({
    selector: 'app-login',
    template: `
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      
      <form class="login-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="Enter your email"
          >
          <div class="error" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']">
            Email is required
          </div>
          <div class="error" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']">
            Please enter a valid email
          </div>
        </div>
  
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            placeholder="Enter your password"
          >
          <div class="error" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']">
            Password is required
          </div>
          <div class="error" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['minlength']">
            Password must be at least 6 characters
          </div>
        </div>
  
        <div class="form-group">
          <label for="role">Login as:</label>
          <select id="role" formControlName="role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
  
        <div class="error-message" *ngIf="error">{{ error }}</div>
  
        <button type="submit" [disabled]="loginForm.invalid || isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
  `,
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule
    ]
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['user']
        });
    }

    async onSubmit(): Promise<void> {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.error = '';

            const email = this.loginForm.get('email')?.value;
            const password = this.loginForm.get('password')?.value;
            const role = this.loginForm.get('role')?.value;

            try {
                const resp = await login({
                    email: email,
                    password: password,
                    role: role
                });
                const auth = resp.auth;
                setApiJwt(auth);
                const user = await getUserByToken(auth);
                if (user) {
                    this.router.navigate(['/dashboard']);
                }
            } catch (err) {
                console.log('Si è verificato un errore', err);
                this.error = err as string;
            } finally {
                this.isLoading = false;
            }
        }
    }
}