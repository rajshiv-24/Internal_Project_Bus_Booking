import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Schedule } from '../../models/models';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-vh-100" style="background:#f0f4f8;">
      <!-- Hero Search Banner -->
      <div style="background: linear-gradient(135deg,#1a1a2e,#0f3460); padding: 3rem 0 4rem;">
        <div class="container text-center text-white mb-4">
          <h2 class="fw-bold fs-1"><i class="bi bi-geo-alt-fill me-2" style="color:#e94560;"></i>Find Your Bus</h2>
          <p class="text-white-50">Search available buses by route and date</p>
        </div>
        <div class="container">
          <div class="card border-0 rounded-4 shadow-lg p-4" style="max-width:750px;margin:auto;">
            <div class="row g-3 align-items-end">
              <div class="col-md-3">
                <label class="form-label fw-semibold small text-muted">FROM</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0"><i class="bi bi-geo-alt text-danger"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0" placeholder="Source city"
                    [(ngModel)]="search.src">
                </div>
              </div>
              <div class="col-md-1 text-center d-none d-md-flex align-items-center justify-content-center pb-1">
                <i class="bi bi-arrow-right fs-4 text-muted"></i>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold small text-muted">TO</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0"><i class="bi bi-geo text-success"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0" placeholder="Destination city"
                    [(ngModel)]="search.dest">
                </div>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold small text-muted">DATE</label>
                <input type="date" class="form-control" [(ngModel)]="search.date" [min]="today">
              </div>
              <div class="col-md-2">
                <button class="btn w-100 py-2 fw-bold rounded-3" style="background:#e94560;color:#fff;"
                  (click)="searchSchedules()" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm"></span>
                  <span *ngIf="!loading"><i class="bi bi-search"></i> Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="container py-4" style="margin-top:-2rem;">
        <div *ngIf="message" class="alert rounded-3" [class.alert-danger]="!hasResults" [class.alert-info]="hasResults">
          {{ message }}
        </div>

        <div *ngIf="schedules.length > 0">
          <h5 class="fw-bold mb-3 text-dark">
            <i class="bi bi-list-ul me-2 text-danger"></i>
            {{ schedules.length }} Bus(es) Found — {{ search.src }} → {{ search.dest }}
          </h5>
          <div class="row g-3">
            <div class="col-12" *ngFor="let s of schedules">
              <div class="card border-0 rounded-4 shadow-sm hover-card">
                <div class="card-body p-4">
                  <div class="row align-items-center">
                    <div class="col-md-4">
                      <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle d-flex align-items-center justify-content-center"
                          style="width:48px;height:48px;background:#e94560;color:#fff;font-size:1.3rem;">
                          <i class="bi bi-bus-front-fill"></i>
                        </div>
                        <div>
                          <div class="fw-bold fs-5">{{ s.src }} → {{ s.dest }}</div>
                          <div class="text-muted small">Route #{{ s.routeId }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-2 text-center">
                      <div class="text-muted small">Departure</div>
                      <div class="fw-bold fs-5" style="color:#0f3460;">{{ s.departureTime }}</div>
                    </div>
                    <div class="col-md-2 text-center">
                      <div class="text-muted small">Date</div>
                      <div class="fw-semibold">{{ s.scheduleDt }}</div>
                    </div>
                    <div class="col-md-2 text-center">
                      <div class="text-muted small">Available Seats</div>
                      <span class="badge rounded-pill fs-6 px-3 py-1"
                        [style.background]="s.avlSeats > 10 ? '#28a745' : '#e94560'" style="color:#fff;">
                        {{ s.avlSeats }} / {{ s.totSeats }}
                      </span>
                    </div>
                    <div class="col-md-2 text-end">
                      <button class="btn rounded-3 fw-semibold px-4 py-2"
                        style="background:#0f3460;color:#fff;"
                        (click)="bookNow(s)"
                        [disabled]="s.avlSeats === 0">
                        <i class="bi bi-ticket me-1"></i>
                        {{ s.avlSeats === 0 ? 'Full' : 'Book Now' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="searched && schedules.length === 0" class="text-center py-5">
          <i class="bi bi-bus-front" style="font-size:5rem;color:#ccc;"></i>
          <h5 class="text-muted mt-3">No buses found for this route</h5>
          <p class="text-muted">Try a different date or route</p>
        </div>
      </div>
    </div>
  `,
  styles: [`.hover-card { transition: transform 0.2s, box-shadow 0.2s; }
    .hover-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.12) !important; }`]
})
export class ScheduleComponent {
  search = { src: '', dest: '', date: '' };
  schedules: Schedule[] = [];
  message = ''; hasResults = false; loading = false; searched = false;
  today = new Date().toISOString().split('T')[0];

  constructor(private api: ApiService, private router: Router) {}

  searchSchedules() {
    if (!this.search.src || !this.search.dest || !this.search.date) {
      this.message = 'Please fill all search fields.'; this.hasResults = false; return;
    }
    this.loading = true; this.message = ''; this.schedules = [];
    this.api.searchSchedules(this.search.src, this.search.dest, this.search.date).subscribe({
      next: (res) => {
        this.loading = false; this.searched = true;
        this.hasResults = res.success;
        this.schedules = res.success ? res.data : [];
        if (!res.success) this.message = res.message;
      },
      error: () => { this.loading = false; this.message = 'Error connecting to server.'; }
    });
  }

  bookNow(schedule: Schedule) {
    this.router.navigate(['/seat-booking'], { state: { schedule } });
  }
}
