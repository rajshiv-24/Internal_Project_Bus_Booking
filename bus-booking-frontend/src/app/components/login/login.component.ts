import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center"
      style="background: linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);">
      <div class="card shadow-lg border-0 rounded-4" style="width:100%;max-width:420px;">
        <div class="card-body p-5">
          <div class="text-center mb-4">
            <i class="bi bi-bus-front-fill" style="font-size:3rem;color:#e94560;"></i>
            <h3 class="fw-bold mt-2">Welcome Back</h3>
            <p class="text-muted small">Sign in to continue your journey</p>
          </div>

          <div *ngIf="message" [class]="'alert alert-' + (success ? 'success' : 'danger') + ' rounded-3'">
            {{ message }}
          </div>

          <form (ngSubmit)="login()" #f="ngForm">
            <div class="mb-3">
              <label class="form-label fw-semibold small">Email Address</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-envelope text-muted"></i>
                </span>
                <input type="email" class="form-control border-start-0 ps-0"
                  placeholder="you@email.com"
                  [(ngModel)]="form.email" name="email" required>
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label fw-semibold small">Password</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-lock text-muted"></i>
                </span>
                <input [type]="showPwd ? 'text' : 'password'"
                  class="form-control border-start-0 border-end-0 ps-0"
                  placeholder="Your password"
                  [(ngModel)]="form.password" name="password" required>
                <button class="btn btn-light border" type="button" (click)="showPwd=!showPwd">
                  <i class="bi" [class.bi-eye]="!showPwd" [class.bi-eye-slash]="showPwd"></i>
                </button>
              </div>
            </div>
            <button type="submit" class="btn w-100 py-2 fw-bold rounded-3"
              style="background:#e94560;color:#fff;" [disabled]="loading || f.invalid">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>

          <hr class="my-4">
          <p class="text-center text-muted small mb-0">
            Don't have an account?
            <a routerLink="/register" style="color:#e94560;" class="fw-semibold text-decoration-none">
              Register Now
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form = { email: '', password: '' };
  message = '';
  success = false;
  loading = false;
  showPwd = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.message = '';
    this.api.login(this.form).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = res.success;
        this.message = res.message;
        if (res.success) {
          // Store token + customer info from AuthResponse
          this.auth.setUser({
            custId: res.custId,
            custName: res.custName,
            email: res.email,
            token: res.token
          });
          this.router.navigate(['/schedule']);
        }
      },
      error: () => {
        this.loading = false;
        this.message = 'Server error. Please try again.';
        this.success = false;
      }
    });
  }
}
