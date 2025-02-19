import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { setApiJwt } from '../environment';
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
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';

      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      try {
        const resp = await login({
          email: email,
          password: password,
        });
        const auth = resp.auth;
        setApiJwt(auth);
        const user = resp.user;
        if (user.roleId !== 2) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard-admin']);
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