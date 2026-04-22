import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top"
      style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
             box-shadow: 0 2px 20px rgba(0,0,0,0.4);">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" routerLink="/schedule">
          <i class="bi bi-bus-front-fill fs-4" style="color:#e94560;"></i>
          <span style="font-weight:700; letter-spacing:1px; color:#fff;">BusGo</span>
        </a>
        <button class="navbar-toggler border-0" type="button"
          data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto align-items-center gap-1">
            <ng-container *ngIf="isLoggedIn()">
              <li class="nav-item">
                <a class="nav-link px-3 py-2 rounded-pill"
                  routerLink="/schedule" routerLinkActive="active-link">
                  <i class="bi bi-search me-1"></i> Find Buses
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link px-3 py-2 rounded-pill"
                  routerLink="/my-bookings" routerLinkActive="active-link">
                  <i class="bi bi-ticket-perforated me-1"></i> My Bookings
                </a>
              </li>
              <li class="nav-item ms-2">
                <span class="nav-link text-warning fw-semibold">
                  <i class="bi bi-person-circle me-1"></i>{{ user?.custName }}
                </span>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </li>
            </ng-container>
            <ng-container *ngIf="!isLoggedIn()">
              <li class="nav-item">
                <a class="nav-link px-3 py-2 rounded-pill"
                  routerLink="/login" routerLinkActive="active-link">Login</a>
              </li>
              <li class="nav-item">
                <a class="btn btn-danger btn-sm rounded-pill px-3" routerLink="/register">Register</a>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .active-link { background: rgba(233,69,96,0.2) !important; color: #e94560 !important; }
    .nav-link { color: rgba(255,255,255,0.8) !important; transition: all 0.2s; }
    .nav-link:hover { color: #fff !important; background: rgba(255,255,255,0.1); }
  `]
})
export class NavbarComponent {
  constructor(private auth: AuthService, private router: Router) {}
  get user() { return this.auth.getUser(); }
  isLoggedIn() { return this.auth.isLoggedIn(); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
