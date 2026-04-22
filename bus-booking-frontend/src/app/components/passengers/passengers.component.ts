import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { PassengerResponse } from '../../models/models';

@Component({
  selector: 'app-passengers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-vh-100" style="background:#f0f4f8;">
      <div class="container py-5" style="max-width:700px;">
        <div class="mb-4">
          <a routerLink="/my-bookings" class="btn btn-outline-secondary btn-sm rounded-3 mb-3">
            <i class="bi bi-arrow-left me-1"></i> Back to Bookings
          </a>
          <h3 class="fw-bold mb-1">
            <i class="bi bi-people-fill me-2 text-danger"></i>Passengers
          </h3>
          <p class="text-muted mb-0">Booking ID: <strong>#{{ bookingId }}</strong></p>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border text-danger" style="width:3rem;height:3rem;"></div>
          <p class="text-muted mt-3">Loading passengers...</p>
        </div>

        <!-- No Passengers -->
        <div *ngIf="!loading && passengers.length === 0" class="text-center py-5">
          <i class="bi bi-person-x fs-1 text-muted"></i>
          <h5 class="text-muted mt-3">No passengers found for this booking</h5>
        </div>

        <!-- Passengers List -->
        <div *ngIf="!loading && passengers.length > 0">
          <div class="card border-0 rounded-4 shadow-sm mb-4">
            <div class="card-header bg-white border-0 rounded-top-4 p-4 pb-0">
              <h6 class="text-muted fw-semibold">{{ passengers.length }} Passenger(s)</h6>
            </div>
            <div class="card-body p-4 pt-2">
              <div class="table-responsive">
                <table class="table table-borderless align-middle mb-0">
                  <thead>
                    <tr style="background:#f8f9fa;border-radius:8px;">
                      <th class="py-3 ps-3 rounded-start">#</th>
                      <th class="py-3">Name</th>
                      <th class="py-3">Age</th>
                      <th class="py-3">Seat No.</th>
                      <th class="py-3 rounded-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let p of passengers; let i = index" class="border-bottom passenger-row">
                      <td class="py-3 ps-3">
                        <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style="width:32px;height:32px;background:#e94560;color:#fff;font-size:0.85rem;">
                          {{ i + 1 }}
                        </div>
                      </td>
                      <td class="py-3">
                        <div class="fw-semibold">{{ p.passengerName }}</div>
                      </td>
                      <td class="py-3">
                        <span class="badge rounded-pill px-3" style="background:#e3f2fd;color:#1565c0;">
                          {{ p.passengerAge }} yrs
                        </span>
                      </td>
                      <td class="py-3">
                        <span class="badge rounded-pill px-3 fw-bold" style="background:#0f3460;color:#fff;font-size:0.9rem;">
                          {{ p.seatNo }}
                        </span>
                      </td>
                      <td class="py-3">
                        <span class="badge rounded-pill px-3" style="background:#d4edda;color:#155724;">
                          <i class="bi bi-check-circle me-1"></i> Confirmed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.passenger-row { transition: background 0.15s; }
    .passenger-row:hover { background: #f8f9fa; }`]
})
export class PassengersComponent implements OnInit {
  passengers: PassengerResponse[] = [];
  bookingId!: number;
  loading = true;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    this.api.getPassengersByBooking(this.bookingId).subscribe({
      next: (res) => { this.loading = false; if (res.success) this.passengers = res.data; },
      error: () => { this.loading = false; }
    });
  }
}
