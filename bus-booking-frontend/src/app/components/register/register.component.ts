import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);">
      <div class="card shadow-lg border-0 rounded-4" style="width:100%;max-width:460px;">
        <div class="card-body p-5">
          <div class="text-center mb-4">
            <div class="mb-3">
              <i class="bi bi-bus-front-fill" style="font-size:3rem;color:#e94560;"></i>
            </div>
            <h3 class="fw-bold">Create Account</h3>
            <p class="text-muted small">Join BusGo and book your journey</p>
          </div>

          <div *ngIf="message" [class]="'alert alert-' + (success ? 'success' : 'danger') + ' rounded-3'" role="alert">
            {{ message }}
          </div>

          <form (ngSubmit)="register()" #f="ngForm">
            <div class="mb-3">
              <label class="form-label fw-semibold small">Full Name</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-person text-muted"></i></span>
                <input type="text" class="form-control border-start-0 ps-0" placeholder="Your full name"
                  [(ngModel)]="form.custName" name="custName" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small">Phone Number</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-phone text-muted"></i></span>
                <input type="tel" class="form-control border-start-0 ps-0" placeholder="10-digit mobile number"
                  [(ngModel)]="form.phoneNo" name="phoneNo" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small">Email Address</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-envelope text-muted"></i></span>
                <input type="email" class="form-control border-start-0 ps-0" placeholder="you@email.com"
                  [(ngModel)]="form.email" name="email" required>
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label fw-semibold small">Password</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-lock text-muted"></i></span>
                <input [type]="showPwd ? 'text' : 'password'" class="form-control border-start-0 border-end-0 ps-0"
                  placeholder="Create a password" [(ngModel)]="form.password" name="password" required>
                <button class="btn btn-light border" type="button" (click)="showPwd=!showPwd">
                  <i class="bi" [class.bi-eye]="!showPwd" [class.bi-eye-slash]="showPwd"></i>
                </button>
              </div>
            </div>
            <button type="submit" class="btn w-100 py-2 fw-bold rounded-3" style="background:#e94560;color:#fff;" [disabled]="loading || f.invalid">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Registering...' : 'Create Account' }}
            </button>
          </form>

          <hr class="my-4">
          <p class="text-center text-muted small mb-0">
            Already have an account? <a routerLink="/login" style="color:#e94560;" class="fw-semibold text-decoration-none">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = { custName: '', phoneNo: '', email: '', password: '' };
  message = ''; success = false; loading = false; showPwd = false;

  constructor(private api: ApiService, private router: Router) {}

  register() {
    this.loading = true; this.message = '';
    this.api.register(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res.success;
        this.message = res.message;
        if (res.success) setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => { this.loading = false; this.message = 'Server error. Please try again.'; this.success = false; }
    });
  }
}
