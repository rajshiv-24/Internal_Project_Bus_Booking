import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { BookingResponse } from '../../models/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-vh-100" style="background:#f0f4f8;">
      <div class="container py-5">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 class="fw-bold mb-1"><i class="bi bi-ticket-perforated-fill me-2 text-danger"></i>My Bookings</h3>
            <p class="text-muted mb-0">All your travel bookings in one place</p>
          </div>
          <a routerLink="/schedule" class="btn rounded-3 fw-semibold px-4" style="background:#e94560;color:#fff;">
            <i class="bi bi-plus-lg me-1"></i> New Booking
          </a>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border text-danger" style="width:3rem;height:3rem;"></div>
          <p class="text-muted mt-3">Fetching your bookings...</p>
        </div>

        <!-- No Bookings -->
        <div *ngIf="!loading && bookings.length === 0" class="text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <h5 class="text-muted mt-3">No bookings found</h5>
          <a routerLink="/schedule" class="btn rounded-3 mt-2" style="background:#e94560;color:#fff;">
            Book Your First Trip
          </a>
        </div>

        <!-- Bookings List -->
        <div class="row g-3" *ngIf="!loading && bookings.length > 0">
          <div class="col-12" *ngFor="let b of bookings">
            <div class="card border-0 rounded-4 shadow-sm booking-card">
              <div class="card-body p-4">
                <div class="row align-items-center">
                  <div class="col-md-5">
                    <div class="d-flex align-items-center gap-3">
                      <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style="width:52px;height:52px;background:linear-gradient(135deg,#e94560,#c0392b);color:#fff;font-size:1.4rem;">
                        <i class="bi bi-bus-front-fill"></i>
                      </div>
                      <div>
                        <div class="fw-bold fs-5">{{ b.src }} → {{ b.dest }}</div>
                        <div class="text-muted small">
                          <i class="bi bi-calendar3 me-1"></i>{{ b.scheduleDt }}
                          &nbsp;|&nbsp;
                          <i class="bi bi-clock me-1"></i>{{ b.departureTime }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2 text-center">
                    <div class="text-muted small">Booking ID</div>
                    <div class="fw-bold text-dark">#{{ b.id }}</div>
                  </div>
                  <div class="col-md-2 text-center">
                    <div class="text-muted small">Booked On</div>
                    <div class="fw-semibold small">{{ b.bookingDt }}</div>
                  </div>
                  <div class="col-md-1 text-center">
                    <span class="badge rounded-pill px-3 py-2"
                      [style.background]="b.bookingStatus === 'CONFIRMED' ? '#28a745' : '#ffc107'"
                      style="color:#fff;font-size:0.75rem;">
                      {{ b.bookingStatus }}
                    </span>
                  </div>
                  <div class="col-md-2 text-end">
                    <a [routerLink]="['/passengers', b.id]"
                      class="btn btn-outline-primary rounded-3 btn-sm px-3 fw-semibold">
                      <i class="bi bi-people me-1"></i> Passengers
                    </a>
                  </div>
                </div>

                <!-- Passenger mini preview -->
                <div *ngIf="b.passengers && b.passengers.length > 0" class="mt-3 pt-3 border-top">
                  <div class="d-flex gap-2 flex-wrap">
                    <span *ngFor="let p of b.passengers"
                      class="badge rounded-pill px-3 py-1"
                      style="background:#e8eaf6;color:#3949ab;font-size:0.78rem;">
                      <i class="bi bi-person me-1"></i>{{ p.passengerName }} (Seat: {{ p.seatNo }})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.booking-card { transition: transform 0.2s, box-shadow 0.2s; }
    .booking-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important; }`]
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user) { this.router.navigate(['/login']); return; }
    this.api.getBookingsByCustomer(user.custId).subscribe({
      next: (res) => { this.loading = false; if (res.success) this.bookings = res.data; },
      error: () => { this.loading = false; }
    });
  }
}
